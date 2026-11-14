const { supabase } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * Workflow Automation Engine
 * Evaluates triggers and rules, executes actions, and writes audit logs.
 */
class AutomationEngine {
  /**
   * Evaluate rules for an event
   * @param {string} triggerEvent - e.g. 'request_created', 'task_updated', 'deadline_approaching'
   * @param {object} entityData - The entity object (request, task, approval)
   * @param {string} orgId - Organization ID
   */
  async evaluateEvent(triggerEvent, entityData, orgId) {
    const startTime = Date.now();
    try {
      // 1. Fetch active rules for this trigger event in this org
      const { data: rules, error } = await supabase
        .from('workflow_rules')
        .select('*')
        .eq('org_id', orgId)
        .eq('trigger_event', triggerEvent)
        .eq('is_active', true);

      if (error || !rules || rules.length === 0) {
        return { executed: 0, rulesMatched: 0 };
      }

      let executedCount = 0;

      for (const rule of rules) {
        const matches = this.evaluateConditions(rule.conditions, entityData);

        if (matches) {
          const executedActions = await this.executeActions(rule.actions, entityData, orgId, rule);
          executedCount++;

          // Log execution
          await supabase.from('automation_logs').insert({
            id: uuidv4(),
            org_id: orgId,
            rule_id: rule.id,
            rule_name: rule.name,
            trigger_event: triggerEvent,
            trigger_entity_id: entityData.id,
            actions_executed: executedActions,
            status: 'success',
            execution_duration_ms: Date.now() - startTime,
            executed_at: new Date().toISOString()
          });

          // Update execution count on rule
          await supabase
            .from('workflow_rules')
            .update({
              execution_count: (rule.execution_count || 0) + 1,
              last_triggered_at: new Date().toISOString()
            })
            .eq('id', rule.id);
        }
      }

      return { executed: executedCount, rulesMatched: rules.length };
    } catch (err) {
      console.error('[AutomationEngine] Error evaluating event:', err);
      return { executed: 0, error: err.message };
    }
  }

  /**
   * Check if an entity satisfies rule conditions
   */
  evaluateConditions(conditions, data) {
    if (!conditions || !Array.isArray(conditions) || conditions.length === 0) {
      return true; // No conditions means trigger for all
    }

    return conditions.every(cond => {
      const actualVal = data[cond.field];
      const targetVal = cond.value;

      switch (cond.operator) {
        case 'equals':
        case '==':
          return String(actualVal).toLowerCase() === String(targetVal).toLowerCase();
        case 'not_equals':
        case '!=':
          return String(actualVal).toLowerCase() !== String(targetVal).toLowerCase();
        case 'contains':
          return actualVal && String(actualVal).toLowerCase().includes(String(targetVal).toLowerCase());
        case 'greater_than':
        case '>':
          return Number(actualVal) > Number(targetVal);
        case 'less_than':
        case '<':
          return Number(actualVal) < Number(targetVal);
        case 'in':
          return Array.isArray(targetVal) && targetVal.includes(actualVal);
        default:
          return true;
      }
    });
  }

  /**
   * Execute actions associated with a matched rule
   */
  async executeActions(actions, entityData, orgId, rule) {
    const executed = [];

    if (!actions || !Array.isArray(actions)) return executed;

    for (const act of actions) {
      try {
        switch (act.action) {
          case 'notify_department_manager': {
            if (entityData.assigned_dept || entityData.dept_id) {
              const deptId = entityData.assigned_dept || entityData.dept_id;
              const { data: dept } = await supabase
                .from('departments')
                .select('manager_id, name')
                .eq('id', deptId)
                .single();

              if (dept && dept.manager_id) {
                await supabase.from('notifications').insert({
                  id: uuidv4(),
                  org_id: orgId,
                  user_id: dept.manager_id,
                  type: 'manager_escalation',
                  title: `Automation Alert: ${rule.name}`,
                  message: `New critical item "${entityData.title}" requires immediate review for ${dept.name}.`,
                  link: `/requests/${entityData.id}`,
                  severity: 'critical'
                });
                executed.push({ action: act.action, targetUser: dept.manager_id, status: 'success' });
              }
            }
            break;
          }

          case 'notify_assigned_user': {
            if (entityData.assigned_to) {
              await supabase.from('notifications').insert({
                id: uuidv4(),
                org_id: orgId,
                user_id: entityData.assigned_to,
                type: 'task_assigned',
                title: `Task Assignment: ${entityData.title}`,
                message: `You have been assigned to: ${entityData.title}`,
                link: `/tasks/${entityData.id}`,
                severity: 'info'
              });
              executed.push({ action: act.action, targetUser: entityData.assigned_to, status: 'success' });
            }
            break;
          }

          case 'create_approval_request': {
            await supabase.from('approvals').insert({
              id: uuidv4(),
              org_id: orgId,
              entity_type: 'request',
              entity_id: entityData.id,
              title: `Approval required for ${entityData.title}`,
              requested_by: entityData.submitted_by || entityData.created_by,
              status: 'pending',
              decision_notes: 'Automatically generated by workflow rule: ' + rule.name
            });
            executed.push({ action: act.action, status: 'success' });
            break;
          }

          case 'set_sla_hours': {
            executed.push({ action: act.action, slaHours: act.value, status: 'success' });
            break;
          }

          default:
            executed.push({ action: act.action, status: 'skipped', reason: 'Unknown action' });
        }
      } catch (err) {
        executed.push({ action: act.action, status: 'failed', error: err.message });
      }
    }

    return executed;
  }
}

const automationEngine = new AutomationEngine();
module.exports = { automationEngine };

