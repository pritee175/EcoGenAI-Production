/**
 * Responsible AI Governance Dashboard
 * Phase 1: Enterprise-grade governance, cost analysis, and ESG reporting
 */
'use client';

import { useEffect, useState } from 'react';
import { 
  getGovernanceStatistics, 
  getCostImpactAnalysis, 
  getModelOptimizationSummary,
  getPendingActions,
  createWebSocket
} from '@/services/api';
import GovernanceStatsCards from '@/components/GovernanceStatsCards';
import CostVsCarbonChart from '@/components/CostVsCarbonChart';
import ModelOptimizationPanel from '@/components/ModelOptimizationPanel';
import PendingActionsPanel from '@/components/PendingActionsPanel';
import ESGReportDownload from '@/components/ESGReportDownload';

export default function GovernancePage() {
  const [statistics, setStatistics] = useState<any>(null);
  const [costAnalysis, setCostAnalysis] = useState<any>(null);
  const [modelOptimization, setModelOptimization] = useState<any>(null);
  const [pendingActions, setPendingActions] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch governance data
  const fetchGovernanceData = async () => {
    try {
      const [statsData, costData, modelData, actionsData] = await Promise.all([
        getGovernanceStatistics(),
        getCostImpactAnalysis(),
        getModelOptimizationSummary(),
        getPendingActions()
      ]);
      
      setStatistics(statsData);
      setCostAnalysis(costData);
      setModelOptimization(modelData);
      setPendingActions(actionsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch governance data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchGovernanceData();

    // WebSocket connection for real-time updates
    const ws = createWebSocket((data) => {
      if (data.type === 'workload_update') {
        setIsConnected(true);
        // Refresh governance data when workload data changes
        fetchGovernanceData();
      }
    });

    // Refresh every 15 seconds
    const interval = setInterval(fetchGovernanceData, 15000);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
        color: 'white',
        padding: '24px 32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 600 }}>
              🏛️ Responsible AI Governance
            </h1>
            <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: '14px' }}>
              Enterprise-Grade Approval Workflow | Cost vs Carbon Analysis | ESG Reporting
            </p>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isConnected ? '#4ade80' : '#ef4444'
              }} />
              <span style={{ fontSize: '13px' }}>
                {isConnected ? 'Live Updates Active' : 'Connecting...'}
              </span>
            </div>
          </div>
          
          {/* Navigation */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="/" style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              ← AI Monitoring
            </a>
            <a href="/carbon-footprint" style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              Carbon Footprint
            </a>
            <a href="/optimization" style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              Optimization
            </a>
            <a href="/esg-score" style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              ESG Score
            </a>
            <a href="/automation" style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              🚀 Automation →
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            <div style={{ fontSize: '18px', fontWeight: 500 }}>Loading governance data...</div>
          </div>
        ) : (
          <>
            {/* Governance Statistics */}
            {statistics && <GovernanceStatsCards statistics={statistics} />}
            
            {/* Cost vs Carbon Analysis */}
            {costAnalysis && (
              <div style={{ marginTop: '32px' }}>
                <CostVsCarbonChart costAnalysis={costAnalysis} />
              </div>
            )}
            
            {/* Model Optimization and Pending Actions */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '24px', 
              marginTop: '32px' 
            }}>
              {modelOptimization && <ModelOptimizationPanel optimization={modelOptimization} />}
              <PendingActionsPanel actions={pendingActions} onRefresh={fetchGovernanceData} />
            </div>
            
            {/* ESG Report Download */}
            <ESGReportDownload />
            
            {/* Governance Transparency Notice */}
            <div style={{
              marginTop: '32px',
              padding: '20px 24px',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderLeft: '4px solid #7c3aed',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <svg width="20" height="20" viewBox="0 0 16 16" fill="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '8px', fontSize: '15px' }}>
                    Enterprise Governance Framework
                  </div>
                  <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                    <strong>All sustainability actions require manager approval.</strong> This governance system ensures 
                    enterprise compliance, business alignment, and full auditability. No automated execution occurs without 
                    explicit approval. Cost and carbon estimates are based on industry-standard methodologies.
                  </div>
                  <div style={{ 
                    marginTop: '12px', 
                    paddingTop: '12px', 
                    borderTop: '1px solid #e5e7eb',
                    fontSize: '13px',
                    color: '#6b7280'
                  }}>
                    <strong>Approval Workflow:</strong> System generates recommendations → Manager reviews → Approval/Rejection → Execution → Audit trail
                    <br />
                    <strong>Cost Calculations:</strong> $0.12/kWh energy cost, $2.50/GPU-hour, $500 implementation cost per action
                    <br />
                    <strong>Compliance:</strong> Full audit trail maintained for regulatory and internal compliance requirements
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
