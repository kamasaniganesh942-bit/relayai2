const { supabase } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * Background Scheduler for Deadlines and Bottleneck Monitoring
 */
class Scheduler {
  constructor() {
    this.intervalId = null;
  }

  start(intervalMs = 60000 * 15) { // Check every 15 minutes by default
    console.log('[Scheduler] Background deadline & bottleneck monitor started.');
    // Run an initial check after 10 seconds
    setTimeout(() => this.runChecks(), 10000);
    this.intervalId = setInterval(() => this.runChecks(), intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async runChecks() {
    try {
      await this.checkApproachingDeadlines();
      await this.checkOverdueTasks();
    } catch (err) {
      console.error('[Scheduler] Error running background checks:', err.message);
    }
  }

  async checkApproachingDeadlines() {
    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 3600 * 1000).toISOString();

    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .neq('status', 'completed')
      .neq('status', 'rejected');

    if (!tasks) return;

    for (const task of tasks) {
      if (task.deadline && task.deadline <= next24h && task.deadline >= now.toISOString() && task.assigned_to) {
        // Send deadline warning notification if assigned
        await supabase.from('notifications').insert({
          id: uuidv4(),
          org_id: task.org_id,
          user_id: task.assigned_to,
          type: 'approaching_deadline',
          title: `Upcoming Deadline: ${task.title}`,
          message: `Task is due within 24 hours. Current status: ${task.status}.`,
          link: `/tasks/${task.id}`,
          severity: 'warning'
        });
      }
    }
  }

  async checkOverdueTasks() {
    const now = new Date().toISOString();

    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .neq('status', 'completed')
      .neq('status', 'rejected');

    if (!tasks) return;

    for (const task of tasks) {
      if (task.deadline && task.deadline < now && task.assigned_to) {
        await supabase.from('notifications').insert({
          id: uuidv4(),
          org_id: task.org_id,
          user_id: task.assigned_to,
          type: 'overdue_task',
          title: `OVERDUE ALERT: ${task.title}`,
          message: `This task missed its scheduled deadline (${new Date(task.deadline).toLocaleDateString()}). Please provide an update.`,
          link: `/tasks/${task.id}`,
          severity: 'critical'
        });
      }
    }
  }
}

const scheduler = new Scheduler();
module.exports = { scheduler };

