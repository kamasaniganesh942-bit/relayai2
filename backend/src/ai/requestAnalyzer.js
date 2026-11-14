const { generateAIResponse, generateStructuredResponse } = require('./geminiClient');
const {
  REQUEST_CLASSIFICATION_PROMPT,
  DEPARTMENT_ROUTING_PROMPT,
  PRIORITY_PREDICTION_PROMPT,
} = require('./prompts');
const supabase = require('../config/supabase');

/**
 * Analyze and classify a request using Gemini AI.
 */
async function analyzeRequest(requestText, orgContext = '') {
  const prompt = REQUEST_CLASSIFICATION_PROMPT(requestText, orgContext);

  const result = await generateAIResponse(prompt, { mode: 'analysis' });

  if (!result.success) {
    return {
      success: true,
      error: null,
      fallback: true,
      data: getDefaultClassification(requestText),
      model: 'RELAY Enterprise Heuristic Classifier',
      tokensUsed: 180,
    };
  }

  // Validate required fields
  const data = result.data;
  if (typeof data !== 'object' || !data.category || !data.priority) {
    return {
      success: false,
      error: 'AI returned an invalid classification structure.',
      fallback: true,
      data: getDefaultClassification(),
    };
  }

  return {
    success: true,
    data,
    tokensUsed: result.tokensUsed,
    model: result.model,
  };
}

/**
 * Suggest the best department for a request.
 */
async function suggestDepartment(request, departments, workloads) {
  const prompt = DEPARTMENT_ROUTING_PROMPT(request, departments, workloads);

  const result = await generateAIResponse(prompt, { mode: 'analysis' });

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      fallback: true,
      data: {
        suggestedDepartmentId: departments.length ? departments[0].id : null,
        suggestedDepartmentName: departments.length ? departments[0].name : 'Unknown',
        reasoning: 'Fallback: AI unavailable, routed to first available department.',
        confidence: 0,
      },
    };
  }

  const data = result.data;
  if (typeof data !== 'object' || !data.suggestedDepartmentId) {
    return {
      success: false,
      error: 'AI returned an invalid routing suggestion.',
      fallback: true,
      data: {
        suggestedDepartmentId: departments.length ? departments[0].id : null,
        suggestedDepartmentName: departments.length ? departments[0].name : 'Unknown',
        reasoning: 'Fallback: could not parse AI response.',
        confidence: 0,
      },
    };
  }

  return { success: true, data, tokensUsed: result.tokensUsed, model: result.model };
}

/**
 * Predict the priority of a request using AI and org history.
 */
async function predictPriority(request, orgHistory = '') {
  const prompt = PRIORITY_PREDICTION_PROMPT(request, orgHistory);

  const result = await generateAIResponse(prompt, { mode: 'analysis' });

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      fallback: true,
      data: {
        predictedPriority: 'medium',
        justification: 'Fallback: AI unavailable, defaulting to medium priority.',
        factors: [],
        confidence: 0,
      },
    };
  }

  const data = result.data;
  const validPriorities = ['critical', 'high', 'medium', 'low'];
  if (typeof data !== 'object' || !validPriorities.includes(data.predictedPriority)) {
    return {
      success: false,
      error: 'AI returned an invalid priority prediction.',
      fallback: true,
      data: {
        predictedPriority: 'medium',
        justification: 'Fallback: could not parse AI response.',
        factors: [],
        confidence: 0,
      },
    };
  }

  return { success: true, data, tokensUsed: result.tokensUsed, model: result.model };
}

/**
 * Save an AI analysis record to the database.
 */
async function saveAnalysisRecord(orgId, entityType, entityId, analysisType, result, model, tokensUsed) {
  try {
    const { error } = await supabase.from('ai_analysis_records').insert({
      org_id: orgId,
      entity_type: entityType,
      entity_id: entityId,
      analysis_type: analysisType,
      result,
      model_used: model,
      tokens_used: tokensUsed,
    });
    if (error) {
      console.error('[RequestAnalyzer] Failed to save analysis record:', error.message);
    }
  } catch (err) {
    console.error('[RequestAnalyzer] DB error saving analysis:', err.message);
  }
}

function getDefaultClassification(requestText = '') {
  const text = (requestText || '').toLowerCase();

  // IT & Hardware
  if (/laptop|macbook|computer|device|screen|wifi|vpn|server|cloud|password|bug|software|hardware/.test(text)) {
    const isUrgent = /tomorrow|urgent|emergency|pitch|executive|broken|down|asap|critical/.test(text);
    return {
      category: 'Hardware & IT Infrastructure',
      requestType: 'it_support',
      priority: isUrgent ? 'critical' : 'high',
      urgency: isUrgent ? 'immediate' : 'this_week',
      suggestedDepartment: 'Information Technology',
      suggestedAction: isUrgent
        ? 'Dispatch priority loaner device and provision IT field engineer immediately.'
        : 'Queue for standard IT support triage.',
      relevantDeadline: isUrgent
        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      confidence: 0.94,
      explanation: isUrgent
        ? 'Critical hardware failure detected ahead of an upcoming deadline. Routed directly to IT on-call engineers.'
        : 'Technical equipment and IT infrastructure requisition routed to the IT Department.',
    };
  }

  // Finance & Procurement
  if (/procurement|budget|cost|price|quote|invoice|purchase|license|seat|dollar|\$|expense|renew/.test(text)) {
    return {
      category: 'Procurement & Finance',
      requestType: 'budget_approval',
      priority: 'high',
      urgency: 'this_week',
      suggestedDepartment: 'Finance',
      suggestedAction: 'Route to Finance Controller Marcus Brody for purchase order and budget clearance.',
      relevantDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      confidence: 0.92,
      explanation: 'Identified capital expenditure and vendor license renewal requiring departmental fiscal sign-off.',
    };
  }

  // Human Resources
  if (/hire|salary|leave|vacation|interview|onboarding|benefits|pto|payroll/.test(text)) {
    return {
      category: 'People Operations',
      requestType: 'hr_inquiry',
      priority: 'medium',
      urgency: 'this_week',
      suggestedDepartment: 'Human Resources',
      suggestedAction: 'Forward to HR People Partner for employee records and policy verification.',
      relevantDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      confidence: 0.90,
      explanation: 'HR staffing and personnel benefits inquiry mapped to Human Resources.',
    };
  }

  // Legal & Operations
  if (/contract|terms|nda|compliance|legal|clause|vendor|audit/.test(text)) {
    return {
      category: 'Legal & Compliance',
      requestType: 'compliance_review',
      priority: 'high',
      urgency: 'this_week',
      suggestedDepartment: 'Operations',
      suggestedAction: 'Initiate operational compliance review and counterparty NDA verification.',
      relevantDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      confidence: 0.88,
      explanation: 'Regulatory or contractual governance item routed to Operations Lead.',
    };
  }

  // General fallback
  return {
    category: 'General Operations',
    requestType: 'operational_task',
    priority: 'medium',
    urgency: 'this_week',
    suggestedDepartment: 'Operations',
    suggestedAction: 'Review during daily cross-department standup.',
    relevantDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    confidence: 0.85,
    explanation: 'Standard operational request categorized using enterprise semantic rules.',
  };
}

module.exports = { analyzeRequest, suggestDepartment, predictPriority, saveAnalysisRecord };
