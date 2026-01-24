/**
 * API service for communicating with FastAPI backend
 * Handles REST calls and WebSocket connections
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

export interface Workload {
  id: number;
  model_name: string;
  job_type: string;
  gpu_count: number;
  cloud_region: string;
  start_time: string;
  runtime_seconds: number;
  status: string;
  created_at: string;
  updated_at: string;
  energy_kwh?: number; // Energy consumption in kWh
}

export interface EnergySummary {
  total_energy_today_kwh: number;
  average_energy_per_model_kwh: number;
  total_workloads: number;
}

export interface ModelEnergy {
  model_name: string;
  total_energy_kwh: number;
}

export interface TopConsumer {
  workload_id: number;
  model_name: string;
  job_type: string;
  gpu_count: number;
  runtime_seconds: number;
  energy_kwh: number;
  status: string;
}

export interface WorkloadCreate {
  model_name?: string;
  job_type?: string;
  gpu_count?: number;
  cloud_region?: string;
}

/**
 * Fetch all active (running) workloads
 */
export async function getActiveWorkloads(): Promise<Workload[]> {
  const response = await fetch(`${API_URL}/api/workloads/active`);
  if (!response.ok) throw new Error('Failed to fetch workloads');
  return response.json();
}

/**
 * Fetch workload history for reporting
 */
export async function getWorkloadHistory(limit: number = 100): Promise<Workload[]> {
  const response = await fetch(`${API_URL}/api/workloads/history?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
}

/**
 * Start a new AI workload
 */
export async function startWorkload(workload: WorkloadCreate): Promise<Workload> {
  const response = await fetch(`${API_URL}/api/workloads/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workload),
  });
  if (!response.ok) throw new Error('Failed to start workload');
  return response.json();
}

/**
 * Stop a running workload
 */
export async function stopWorkload(workloadId: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/workloads/stop/${workloadId}`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to stop workload');
}

/**
 * Create WebSocket connection for real-time updates
 */
export function createWebSocket(onMessage: (data: any) => void): WebSocket {
  const ws = new WebSocket(`${WS_URL}/ws/workloads`);
  
  ws.onopen = () => {
    console.log('✓ WebSocket connected');
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket disconnected');
  };
  
  return ws;
}


/**
 * Get energy summary for ESG dashboard
 */
export async function getEnergySummary(): Promise<EnergySummary> {
  const response = await fetch(`${API_URL}/api/energy/summary`);
  if (!response.ok) throw new Error('Failed to fetch energy summary');
  return response.json();
}

/**
 * Get energy consumption by model
 */
export async function getEnergyByModel(): Promise<ModelEnergy[]> {
  const response = await fetch(`${API_URL}/api/energy/by-model`);
  if (!response.ok) throw new Error('Failed to fetch energy by model');
  return response.json();
}

/**
 * Get top energy-consuming workloads
 */
export async function getTopEnergyConsumers(limit: number = 5): Promise<TopConsumer[]> {
  const response = await fetch(`${API_URL}/api/energy/top-consumers?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch top consumers');
  return response.json();
}

/**
 * Get energy estimation methodology for transparency
 */
export async function getEnergyMethodology(): Promise<any> {
  const response = await fetch(`${API_URL}/api/energy/transparency`);
  if (!response.ok) throw new Error('Failed to fetch methodology');
  return response.json();
}

/**
 * Get all optimization recommendations
 */
export async function getOptimizationRecommendations(): Promise<any[]> {
  const response = await fetch(`${API_URL}/api/optimization/recommendations`);
  if (!response.ok) throw new Error('Failed to fetch recommendations');
  return response.json();
}

/**
 * Get optimization summary with potential savings
 */
export async function getOptimizationSummary(): Promise<any> {
  const response = await fetch(`${API_URL}/api/optimization/summary`);
  if (!response.ok) throw new Error('Failed to fetch optimization summary');
  return response.json();
}

/**
 * Get optimization recommendations for specific workload
 */
export async function getWorkloadOptimization(workloadId: number): Promise<any[]> {
  const response = await fetch(`${API_URL}/api/optimization/workload/${workloadId}`);
  if (!response.ok) throw new Error('Failed to fetch workload optimization');
  return response.json();
}

/**
 * Get optimization methodology for transparency
 */
export async function getOptimizationMethodology(): Promise<any> {
  const response = await fetch(`${API_URL}/api/optimization/transparency`);
  if (!response.ok) throw new Error('Failed to fetch optimization methodology');
  return response.json();
}

/**
 * Get current ESG sustainability score
 */
export async function getESGScore(): Promise<any> {
  const response = await fetch(`${API_URL}/api/esg-score/current`);
  if (!response.ok) throw new Error('Failed to fetch ESG score');
  return response.json();
}

/**
 * Get ESG score history for trend analysis
 */
export async function getESGScoreHistory(days: number = 7): Promise<any[]> {
  const response = await fetch(`${API_URL}/api/esg-score/history?days=${days}`);
  if (!response.ok) throw new Error('Failed to fetch ESG score history');
  return response.json();
}

/**
 * Save current ESG score to database
 */
export async function saveESGScore(): Promise<any> {
  const response = await fetch(`${API_URL}/api/esg-score/save`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Failed to save ESG score');
  return response.json();
}

/**
 * Get ESG score methodology for transparency
 */
export async function getESGMethodology(): Promise<any> {
  const response = await fetch(`${API_URL}/api/esg-score/transparency`);
  if (!response.ok) throw new Error('Failed to fetch ESG methodology');
  return response.json();
}

// ============================================================================
// GOVERNANCE & RESPONSIBLE AI
// ============================================================================

/**
 * Get governance statistics for dashboard
 */
export async function getGovernanceStatistics(): Promise<any> {
  const response = await fetch(`${API_URL}/api/governance/statistics`);
  if (!response.ok) throw new Error('Failed to fetch governance statistics');
  return response.json();
}

/**
 * Get all pending action requests
 */
export async function getPendingActions(): Promise<any[]> {
  const response = await fetch(`${API_URL}/api/governance/actions/pending`);
  if (!response.ok) throw new Error('Failed to fetch pending actions');
  return response.json();
}

/**
 * Get all action requests with history
 */
export async function getAllActions(limit: number = 100): Promise<any[]> {
  const response = await fetch(`${API_URL}/api/governance/actions/all?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch all actions');
  return response.json();
}

/**
 * Approve an action request
 */
export async function approveAction(actionId: number, reviewData: { reviewed_by: string; review_notes?: string }): Promise<any> {
  const response = await fetch(`${API_URL}/api/governance/actions/${actionId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
  if (!response.ok) throw new Error('Failed to approve action');
  return response.json();
}

/**
 * Reject an action request
 */
export async function rejectAction(actionId: number, reviewData: { reviewed_by: string; review_notes: string }): Promise<any> {
  const response = await fetch(`${API_URL}/api/governance/actions/${actionId}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
  if (!response.ok) throw new Error('Failed to reject action');
  return response.json();
}

/**
 * Get model optimization recommendations
 */
export async function getModelOptimizationRecommendations(): Promise<any[]> {
  const response = await fetch(`${API_URL}/api/governance/model-optimization/recommendations`);
  if (!response.ok) throw new Error('Failed to fetch model optimization recommendations');
  return response.json();
}

/**
 * Get model optimization summary
 */
export async function getModelOptimizationSummary(): Promise<any> {
  const response = await fetch(`${API_URL}/api/governance/model-optimization/summary`);
  if (!response.ok) throw new Error('Failed to fetch model optimization summary');
  return response.json();
}

/**
 * Get current cost analysis
 */
export async function getCostAnalysis(): Promise<any> {
  const response = await fetch(`${API_URL}/api/governance/cost-analysis/current`);
  if (!response.ok) throw new Error('Failed to fetch cost analysis');
  return response.json();
}

/**
 * Get cost vs carbon impact analysis
 */
export async function getCostImpactAnalysis(): Promise<any> {
  const response = await fetch(`${API_URL}/api/governance/cost-analysis/impact`);
  if (!response.ok) throw new Error('Failed to fetch cost impact analysis');
  return response.json();
}

/**
 * Get comprehensive ESG report
 */
export async function getComprehensiveESGReport(periodDays: number = 30): Promise<any> {
  const response = await fetch(`${API_URL}/api/governance/reports/comprehensive?period_days=${periodDays}`);
  if (!response.ok) throw new Error('Failed to fetch comprehensive ESG report');
  return response.json();
}

/**
 * Download ESG report as CSV
 */
export async function downloadESGReportCSV(periodDays: number = 30): Promise<Blob> {
  const response = await fetch(`${API_URL}/api/governance/reports/export/csv?period_days=${periodDays}`);
  if (!response.ok) throw new Error('Failed to download CSV report');
  return response.blob();
}

/**
 * Download ESG report as JSON
 */
export async function downloadESGReportJSON(periodDays: number = 30): Promise<Blob> {
  const response = await fetch(`${API_URL}/api/governance/reports/export/json?period_days=${periodDays}`);
  if (!response.ok) throw new Error('Failed to download JSON report');
  return response.blob();
}

/**
 * Get governance methodology for transparency
 */
export async function getGovernanceMethodology(): Promise<any> {
  const response = await fetch(`${API_URL}/api/governance/transparency`);
  if (!response.ok) throw new Error('Failed to fetch governance methodology');
  return response.json();
}


// ============================================================================
// PHASE 2: ADVANCED AUTOMATION
// ============================================================================

// GREEN-TIME SCHEDULER

/**
 * Initialize green time windows
 */
export async function initializeGreenWindows(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/scheduler/initialize`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Failed to initialize green windows');
  return response.json();
}

/**
 * Get green time windows for a region
 */
export async function getGreenWindows(region: string): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/scheduler/windows/${region}`);
  if (!response.ok) throw new Error('Failed to fetch green windows');
  return response.json();
}

/**
 * Get next green time window for a region
 */
export async function getNextGreenWindow(region: string): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/scheduler/next-window/${region}`);
  if (!response.ok) throw new Error('Failed to fetch next green window');
  return response.json();
}

/**
 * Schedule workload for green-time execution
 */
export async function scheduleWorkload(data: {
  model_name: string;
  job_type: string;
  gpu_count: number;
  preferred_region: string;
  created_by?: string;
}): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/scheduler/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to schedule workload');
  return response.json();
}

/**
 * Get scheduled workloads
 */
export async function getScheduledWorkloads(status?: string): Promise<any> {
  const url = status 
    ? `${API_URL}/api/phase2/scheduler/scheduled?status=${status}`
    : `${API_URL}/api/phase2/scheduler/scheduled`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch scheduled workloads');
  return response.json();
}

/**
 * Get scheduling statistics
 */
export async function getSchedulingStatistics(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/scheduler/statistics`);
  if (!response.ok) throw new Error('Failed to fetch scheduling statistics');
  return response.json();
}

// CARBON AUTOPILOT

/**
 * Detect idle workloads
 */
export async function detectIdleWorkloads(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/autopilot/detect-idle`);
  if (!response.ok) throw new Error('Failed to detect idle workloads');
  return response.json();
}

/**
 * Detect long-running workloads
 */
export async function detectLongRunningWorkloads(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/autopilot/detect-long-running`);
  if (!response.ok) throw new Error('Failed to detect long-running workloads');
  return response.json();
}

/**
 * Get autopilot recommendations
 */
export async function getAutopilotRecommendations(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/autopilot/recommendations`);
  if (!response.ok) throw new Error('Failed to fetch autopilot recommendations');
  return response.json();
}

/**
 * Execute autopilot action
 */
export async function executeAutopilotAction(data: {
  workload_id: number;
  action_type: string;
  reason: string;
}): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/autopilot/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to execute autopilot action');
  return response.json();
}

/**
 * Get autopilot statistics
 */
export async function getAutopilotStatistics(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/autopilot/statistics`);
  if (!response.ok) throw new Error('Failed to fetch autopilot statistics');
  return response.json();
}

/**
 * Get recent autopilot actions
 */
export async function getRecentAutopilotActions(limit: number = 10): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/autopilot/recent-actions?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch recent autopilot actions');
  return response.json();
}

// ECO-SCORE GAMIFICATION

/**
 * Update team eco-score
 */
export async function updateTeamScore(data: {
  team_name: string;
  carbon_saved_kg?: number;
  energy_saved_kwh?: number;
  optimizations_adopted?: number;
}): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/gamification/update-score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update team score');
  return response.json();
}

/**
 * Get team leaderboard
 */
export async function getLeaderboard(month?: string): Promise<any> {
  const url = month 
    ? `${API_URL}/api/phase2/gamification/leaderboard?month=${month}`
    : `${API_URL}/api/phase2/gamification/leaderboard`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch leaderboard');
  return response.json();
}

/**
 * Get team statistics
 */
export async function getTeamStats(teamName: string): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/gamification/team/${teamName}`);
  if (!response.ok) throw new Error('Failed to fetch team stats');
  return response.json();
}

/**
 * Get badge information
 */
export async function getBadgeInfo(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/gamification/badges`);
  if (!response.ok) throw new Error('Failed to fetch badge info');
  return response.json();
}

/**
 * Get gamification summary
 */
export async function getGamificationSummary(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/gamification/summary`);
  if (!response.ok) throw new Error('Failed to fetch gamification summary');
  return response.json();
}

// CLIMATE RISK SIMULATOR

/**
 * Generate climate risk assessment
 */
export async function generateClimateRiskAssessment(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/climate-risk/assessment`);
  if (!response.ok) throw new Error('Failed to generate climate risk assessment');
  return response.json();
}

/**
 * Get latest climate risk assessment
 */
export async function getLatestClimateRisk(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/climate-risk/latest`);
  if (!response.ok) throw new Error('Failed to fetch latest climate risk');
  return response.json();
}

/**
 * Get climate risk history
 */
export async function getClimateRiskHistory(days: number = 30): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/climate-risk/history?days=${days}`);
  if (!response.ok) throw new Error('Failed to fetch climate risk history');
  return response.json();
}

/**
 * Get climate risk methodology
 */
export async function getClimateRiskMethodology(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/climate-risk/transparency`);
  if (!response.ok) throw new Error('Failed to fetch climate risk methodology');
  return response.json();
}

/**
 * Get Phase 2 overview
 */
export async function getPhase2Overview(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/overview`);
  if (!response.ok) throw new Error('Failed to fetch Phase 2 overview');
  return response.json();
}

// ============================================================================
// SUSTAINABILITY AUDITOR BOT
// ============================================================================

/**
 * Ask the sustainability auditor bot a question
 */
export async function askAuditorQuestion(question: string): Promise<any> {
  const response = await fetch(`${API_URL}/api/auditor/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });
  if (!response.ok) throw new Error('Failed to ask question');
  return response.json();
}

/**
 * Get emission trend analysis
 */
export async function getEmissionTrends(days: number = 7): Promise<any> {
  const response = await fetch(`${API_URL}/api/auditor/trends?days=${days}`);
  if (!response.ok) throw new Error('Failed to fetch emission trends');
  return response.json();
}

/**
 * Get explanation for emission increase
 */
export async function explainEmissionIncrease(days: number = 7): Promise<any> {
  const response = await fetch(`${API_URL}/api/auditor/explain-increase?days=${days}`);
  if (!response.ok) throw new Error('Failed to get explanation');
  return response.json();
}

/**
 * Get recommended questions
 */
export async function getRecommendedQuestions(): Promise<any> {
  const response = await fetch(`${API_URL}/api/auditor/recommended-questions`);
  if (!response.ok) throw new Error('Failed to fetch recommended questions');
  return response.json();
}