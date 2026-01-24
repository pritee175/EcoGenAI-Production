/**
 * ESG Sustainability Score Dashboard
 * Feature 5: Executive-level composite ESG performance indicator
 * Provides unified view of AI sustainability health
 */
'use client';

import { useEffect, useState } from 'react';
import { createWebSocket, getESGScore, getESGScoreHistory } from '@/services/api';
import ESGScoreGauge from '@/components/ESGScoreGauge';
import ESGBreakdownPanel from '@/components/ESGBreakdownPanel';
import ESGTrendChart from '@/components/ESGTrendChart';

interface ESGScore {
  score: number;
  breakdown: {
    carbon_efficiency_score: number;
    energy_efficiency_score: number;
    optimization_adoption_score: number;
    regional_sustainability_score: number;
    carbon_weight: number;
    energy_weight: number;
    optimization_weight: number;
    regional_weight: number;
    total_carbon_kg: number;
    total_energy_kwh: number;
    total_workloads: number;
    low_carbon_region_percentage: number;
    optimization_opportunities: number;
    recommendations_adopted: number;
  };
  interpretation: {
    rating: string;
    color: string;
    message: string;
    icon: string;
  };
}

interface ESGHistory {
  id: number;
  score: number;
  score_date: string;
  breakdown: any;
}

export default function ESGScorePage() {
  const [esgScore, setEsgScore] = useState<ESGScore | null>(null);
  const [history, setHistory] = useState<ESGHistory[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch ESG score data
  const fetchESGData = async () => {
    try {
      const [scoreData, historyData] = await Promise.all([
        getESGScore(),
        getESGScoreHistory(7)
      ]);
      setEsgScore(scoreData);
      setHistory(historyData);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch ESG data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchESGData();

    // WebSocket connection for real-time updates
    const ws = createWebSocket((data) => {
      if (data.type === 'workload_update') {
        setIsConnected(true);
        // Refresh ESG score when workload data changes
        fetchESGData();
      }
    });

    // Refresh every 15 seconds
    const interval = setInterval(fetchESGData, 15000);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: 'white',
        padding: '24px 32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 600 }}>
              📊 ESG Sustainability Score
            </h1>
            <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: '14px' }}>
              Executive-Level AI Sustainability Performance Indicator
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
            <a href="/governance" style={{
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
              🛡️ Governance →
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            <div style={{ fontSize: '18px', fontWeight: 500 }}>Loading ESG score...</div>
          </div>
        ) : esgScore ? (
          <>
            {/* ESG Score Gauge and Interpretation */}
            <ESGScoreGauge 
              score={esgScore.score} 
              interpretation={esgScore.interpretation}
            />
            
            {/* Score Breakdown and Trend */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '24px', 
              marginTop: '32px' 
            }}>
              <ESGBreakdownPanel breakdown={esgScore.breakdown} />
              <ESGTrendChart history={history} />
            </div>
            
            {/* ESG Transparency Notice */}
            <div style={{
              marginTop: '32px',
              padding: '20px 24px',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderLeft: '4px solid #6366f1',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <svg width="20" height="20" viewBox="0 0 16 16" fill="#6366f1" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '8px', fontSize: '15px' }}>
                    ESG Score Transparency Notice
                  </div>
                  <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                    <strong>ESG scores are composite indicators</strong> based on estimated sustainability metrics 
                    and are intended for internal governance and continuous improvement. Scores aggregate carbon 
                    efficiency, energy efficiency, optimization adoption, and regional sustainability into a single 
                    0-100 indicator.
                  </div>
                  <div style={{ 
                    marginTop: '12px', 
                    paddingTop: '12px', 
                    borderTop: '1px solid #e5e7eb',
                    fontSize: '13px',
                    color: '#6b7280'
                  }}>
                    <strong>Methodology:</strong> Weighted composite scoring (Carbon: 40%, Energy: 30%, Optimization: 20%, Regional: 10%)
                    <br />
                    <strong>Score Ranges:</strong> Excellent (80-100), Good (60-79), Fair (40-59), Needs Improvement (0-39)
                    <br />
                    <strong>Purpose:</strong> Enable executive-level ESG performance tracking and decision-making
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            <div style={{ fontSize: '18px', fontWeight: 500 }}>No ESG data available</div>
          </div>
        )}
      </main>
    </div>
  );
}
