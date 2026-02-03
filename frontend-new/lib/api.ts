/**
 * API service for communicating with FastAPI backend
 * Handles REST calls and WebSocket connections
 * Industry-ready with retry logic, error handling, and connection management
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const REQUEST_TIMEOUT = 30000; // 30 seconds (increased for slower endpoints)

// Helper function for fetch with timeout and retry
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new Error('Request timeout'));
  }, REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Don't retry on abort errors (timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`Request to ${url} timed out after ${REQUEST_TIMEOUT}ms`);
      throw new Error('Request timeout - please check if the backend server is running');
    }
    
    if (retries > 0) {
      console.warn(`Retrying request to ${url}, ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

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
  energy_kwh?: number;
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

// ============================================================================
// WORKLOAD MANAGEMENT
// ============================================================================

export async function getActiveWorkloads(): Promise<Workload[]> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/workloads/active`);
    if (!response.ok) {
      console.error(`Failed to fetch workloads: ${response.status} ${response.statusText}`);
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching active workloads:', error);
    return [];
  }
}

export async function getWorkloadHistory(limit: number = 100): Promise<Workload[]> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/workloads/history?limit=${limit}`);
    if (!response.ok) {
      console.error(`Failed to fetch history: ${response.status}`);
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching workload history:', error);
    return [];
  }
}

export async function startWorkload(workload: WorkloadCreate): Promise<Workload | null> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/workloads/start`, {
      method: 'POST',
      body: JSON.stringify(workload),
    });
    if (!response.ok) {
      console.error(`Failed to start workload: ${response.status}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error starting workload:', error);
    return null;
  }
}

export async function stopWorkload(workloadId: number): Promise<boolean> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/workloads/stop/${workloadId}`, {
      method: 'POST',
    });
    return response.ok;
  } catch (error) {
    console.error('Error stopping workload:', error);
    return false;
  }
}

// WebSocket connection manager with auto-reconnect
let wsInstance: WebSocket | null = null;
let wsReconnectTimer: NodeJS.Timeout | null = null;
let wsReconnectAttempts = 0;
const MAX_WS_RECONNECT_ATTEMPTS = 5;
const WS_RECONNECT_DELAY = 3000;

export function createWebSocket(onMessage: (data: any) => void): WebSocket {
  // Close existing connection if any
  if (wsInstance) {
    wsInstance.close();
    wsInstance = null;
  }

  // Clear any pending reconnect timer
  if (wsReconnectTimer) {
    clearTimeout(wsReconnectTimer);
    wsReconnectTimer = null;
  }

  try {
    const ws = new WebSocket(`${WS_URL}/ws/workloads`);
    wsInstance = ws;
    
    ws.onopen = () => {
      console.log('✓ WebSocket connected');
      wsReconnectAttempts = 0; // Reset reconnect attempts on successful connection
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.warn('WebSocket connection error - will attempt to reconnect');
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      wsInstance = null;
      
      // Attempt to reconnect if not exceeded max attempts
      if (wsReconnectAttempts < MAX_WS_RECONNECT_ATTEMPTS) {
        wsReconnectAttempts++;
        console.log(`Attempting to reconnect WebSocket (${wsReconnectAttempts}/${MAX_WS_RECONNECT_ATTEMPTS})...`);
        
        wsReconnectTimer = setTimeout(() => {
          createWebSocket(onMessage);
        }, WS_RECONNECT_DELAY);
      } else {
        console.error('Max WebSocket reconnection attempts reached');
      }
    };
    
    return ws;
  } catch (error) {
    console.error('Failed to create WebSocket:', error);
    // Return a dummy WebSocket object to prevent crashes
    return {
      close: () => {},
      send: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    } as any;
  }
}

// ============================================================================
// ENERGY CONSUMPTION
// ============================================================================

export async function getEnergySummary(): Promise<EnergySummary | null> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/energy/summary`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching energy summary:', error);
    return null;
  }
}

export async function getEnergyByModel(): Promise<ModelEnergy[]> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/energy/by-model`);
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('Error fetching energy by model:', error);
    return [];
  }
}

export async function getTopEnergyConsumers(limit: number = 5): Promise<TopConsumer[]> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/energy/top-consumers?limit=${limit}`);
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('Error fetching top consumers:', error);
    return [];
  }
}

export async function getEnergyMethodology(): Promise<any> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/energy/transparency`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching methodology:', error);
    return null;
  }
}

// ============================================================================
// CARBON FOOTPRINT
// ============================================================================

export async function getCarbonSummary(): Promise<any> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/carbon/summary`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching carbon summary:', error);
    return null;
  }
}

export async function getCarbonByRegion(): Promise<any[]> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/carbon/by-region`);
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('Error fetching carbon by region:', error);
    return [];
  }
}

export async function getCarbonMethodology(): Promise<any> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/carbon/transparency`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching carbon methodology:', error);
    return null;
  }
}

// ============================================================================
// OPTIMIZATION
// ============================================================================

export async function getOptimizationRecommendations(): Promise<any[]> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/optimization/recommendations`);
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
}

export async function getOptimizationSummary(): Promise<any> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/optimization/summary`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching optimization summary:', error);
    return null;
  }
}

export async function getWorkloadOptimization(workloadId: number): Promise<any[]> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/optimization/workload/${workloadId}`);
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('Error fetching workload optimization:', error);
    return [];
  }
}

export async function getOptimizationMethodology(): Promise<any> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/optimization/transparency`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching optimization methodology:', error);
    return null;
  }
}

// ============================================================================
// ESG SCORE
// ============================================================================

export async function getESGScore(): Promise<any> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/esg-score/current`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching ESG score:', error);
    return null;
  }
}

export async function getESGScoreHistory(days: number = 7): Promise<any[]> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/esg-score/history?days=${days}`);
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('Error fetching ESG score history:', error);
    return [];
  }
}

export async function saveESGScore(): Promise<any> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/esg-score/save`, {
      method: 'POST'
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error saving ESG score:', error);
    return null;
  }
}

export async function getESGMethodology(): Promise<any> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/esg-score/transparency`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching ESG methodology:', error);
    return null;
  }
}

// ============================================================================
// GOVERNANCE & RESPONSIBLE AI
// ============================================================================

export async function getGovernanceStatistics(): Promise<any> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/governance/statistics`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching governance statistics:', error);
    return null;
  }
}

export async function getPendingActions(): Promise<any[]> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/governance/actions/pending`);
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('Error fetching pending actions:', error);
    return [];
  }
}

export async function getAllActions(limit: number = 100): Promise<any[]> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/governance/actions/all?limit=${limit}`);
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('Error fetching all actions:', error);
    return [];
  }
}

export async function approveAction(actionId: number, reviewData: { reviewed_by: string; review_notes?: string }): Promise<any> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/governance/actions/${actionId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error approving action:', error);
    return null;
  }
}

export async function rejectAction(actionId: number, reviewData: { reviewed_by: string; review_notes: string }): Promise<any> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/governance/actions/${actionId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error rejecting action:', error);
    return null;
  }
}

export async function getModelOptimizationRecommendations(): Promise<any[]> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/governance/model-optimization/recommendations`);
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('Error fetching model optimization recommendations:', error);
    return [];
  }
}

export async function getModelOptimizationSummary(): Promise<any> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/governance/model-optimization/summary`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching model optimization summary:', error);
    return null;
  }
}

export async function getCostAnalysis(): Promise<any> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/governance/cost-analysis/current`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching cost analysis:', error);
    return null;
  }
}

export async function getCostImpactAnalysis(): Promise<any> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/governance/cost-analysis/impact`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching cost impact analysis:', error);
    return null;
  }
}

export async function getComprehensiveESGReport(periodDays: number = 30): Promise<any> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/governance/reports/comprehensive?period_days=${periodDays}`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching comprehensive ESG report:', error);
    return null;
  }
}

export async function downloadESGReportCSV(periodDays: number = 30): Promise<Blob | null> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/governance/reports/export/csv?period_days=${periodDays}`);
    if (!response.ok) return null;
    return response.blob();
  } catch (error) {
    console.error('Error downloading CSV report:', error);
    return null;
  }
}

export async function downloadESGReportJSON(periodDays: number = 30): Promise<Blob | null> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/governance/reports/export/json?period_days=${periodDays}`);
    if (!response.ok) return null;
    return response.blob();
  } catch (error) {
    console.error('Error downloading JSON report:', error);
    return null;
  }
}

export async function getGovernanceMethodology(): Promise<any> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/governance/transparency`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching governance methodology:', error);
    return null;
  }
}

// ============================================================================
// PHASE 2: ADVANCED AUTOMATION
// ============================================================================

// GREEN-TIME SCHEDULER

export async function initializeGreenWindows(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/scheduler/initialize`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Failed to initialize green windows');
  return response.json();
}

export async function getGreenWindows(region: string): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/scheduler/windows/${region}`);
  if (!response.ok) throw new Error('Failed to fetch green windows');
  return response.json();
}

export async function getNextGreenWindow(region: string): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/scheduler/next-window/${region}`);
  if (!response.ok) throw new Error('Failed to fetch next green window');
  return response.json();
}

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

export async function getScheduledWorkloads(status?: string): Promise<any> {
  const url = status 
    ? `${API_URL}/api/phase2/scheduler/scheduled?status=${status}`
    : `${API_URL}/api/phase2/scheduler/scheduled`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch scheduled workloads');
  return response.json();
}

export async function getSchedulingStatistics(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/scheduler/statistics`);
  if (!response.ok) throw new Error('Failed to fetch scheduling statistics');
  return response.json();
}

// CARBON AUTOPILOT

export async function detectIdleWorkloads(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/autopilot/detect-idle`);
  if (!response.ok) throw new Error('Failed to detect idle workloads');
  return response.json();
}

export async function detectLongRunningWorkloads(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/autopilot/detect-long-running`);
  if (!response.ok) throw new Error('Failed to detect long-running workloads');
  return response.json();
}

export async function getAutopilotRecommendations(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/autopilot/recommendations`);
  if (!response.ok) throw new Error('Failed to fetch autopilot recommendations');
  return response.json();
}

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

export async function getAutopilotStatistics(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/autopilot/statistics`);
  if (!response.ok) throw new Error('Failed to fetch autopilot statistics');
  return response.json();
}

export async function getRecentAutopilotActions(limit: number = 10): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/autopilot/recent-actions?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch recent autopilot actions');
  return response.json();
}

// ECO-SCORE GAMIFICATION

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

export async function getLeaderboard(month?: string): Promise<any> {
  const url = month 
    ? `${API_URL}/api/phase2/gamification/leaderboard?month=${month}`
    : `${API_URL}/api/phase2/gamification/leaderboard`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch leaderboard');
  return response.json();
}

export async function getTeamStats(teamName: string): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/gamification/team/${teamName}`);
  if (!response.ok) throw new Error('Failed to fetch team stats');
  return response.json();
}

export async function getBadgeInfo(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/gamification/badges`);
  if (!response.ok) throw new Error('Failed to fetch badge info');
  return response.json();
}

export async function getGamificationSummary(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/gamification/summary`);
  if (!response.ok) throw new Error('Failed to fetch gamification summary');
  return response.json();
}

// CLIMATE RISK SIMULATOR

export async function generateClimateRiskAssessment(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/climate-risk/assessment`);
  if (!response.ok) throw new Error('Failed to generate climate risk assessment');
  return response.json();
}

export async function getLatestClimateRisk(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/climate-risk/latest`);
  if (!response.ok) throw new Error('Failed to fetch latest climate risk');
  return response.json();
}

export async function getClimateRiskHistory(days: number = 30): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/climate-risk/history?days=${days}`);
  if (!response.ok) throw new Error('Failed to fetch climate risk history');
  return response.json();
}

export async function getClimateRiskMethodology(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/climate-risk/transparency`);
  if (!response.ok) throw new Error('Failed to fetch climate risk methodology');
  return response.json();
}

export async function getPhase2Overview(): Promise<any> {
  const response = await fetch(`${API_URL}/api/phase2/overview`);
  if (!response.ok) throw new Error('Failed to fetch Phase 2 overview');
  return response.json();
}

// ============================================================================
// SUSTAINABILITY AUDITOR BOT
// ============================================================================

export async function askAuditorQuestion(question: string): Promise<any> {
  const response = await fetch(`${API_URL}/api/auditor/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });
  if (!response.ok) throw new Error('Failed to ask question');
  return response.json();
}

export async function getEmissionTrends(days: number = 7): Promise<any> {
  const response = await fetch(`${API_URL}/api/auditor/trends?days=${days}`);
  if (!response.ok) throw new Error('Failed to fetch emission trends');
  return response.json();
}

export async function explainEmissionIncrease(days: number = 7): Promise<any> {
  const response = await fetch(`${API_URL}/api/auditor/explain-increase?days=${days}`);
  if (!response.ok) throw new Error('Failed to get explanation');
  return response.json();
}

export async function getRecommendedQuestions(): Promise<any> {
  const response = await fetch(`${API_URL}/api/auditor/recommended-questions`);
  if (!response.ok) throw new Error('Failed to fetch recommended questions');
  return response.json();
}
