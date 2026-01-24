/**
 * Optimization & Emission Reduction Dashboard
 * Feature 4: Rule-based sustainability recommendations
 * Advisory system for reducing AI carbon footprint
 */
'use client';

import { useEffect, useState } from 'react';
import { createWebSocket, getOptimizationSummary, getOptimizationRecommendations } from '@/services/api';
import OptimizationStatsCards from '@/components/OptimizationStatsCards';
import RecommendationList from '@/components/RecommendationList';

interface Recommendation {
  workload_id: number;
  model_name: string;
  recommendation_type: string;
  title: string;
  message: string;
  estimated_carbon_saving_kg: number;
  severity: string;
  impact_description: string;
}

interface OptimizationSummary {
  total_recommendations: number;
  total_carbon_saving_kg: number;
  total_energy_saving_kwh: number;
  high_severity_count: number;
  medium_severity_count: number;
  low_severity_count: number;
}

export default function OptimizationPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [summary, setSummary] = useState<OptimizationSummary | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch optimization data
  const fetchOptimizationData = async () => {
    try {
      const [summaryData, recommendationsData] = await Promise.all([
        getOptimizationSummary(),
        getOptimizationRecommendations()
      ]);
      setSummary(summaryData);
      setRecommendations(recommendationsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch optimization data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchOptimizationData();

    // WebSocket connection for real-time updates
    const ws = createWebSocket((data) => {
      if (data.type === 'workload_update') {
        setIsConnected(true);
        // Refresh recommendations when workload data changes
        fetchOptimizationData();
      }
    });

    // Refresh every 10 seconds
    const interval = setInterval(fetchOptimizationData, 10000);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #0033a0 0%, #005eb8 100%)',
        color: 'white',
        padding: '24px 32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 600 }}>
              ⚡ Optimization & Emission Reduction
            </h1>
            <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: '14px' }}>
              AI Sustainability Recommendations | Advisory System for ESG Optimization
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
              📊 ESG Score
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
            <div style={{ fontSize: '18px', fontWeight: 500 }}>Loading optimization recommendations...</div>
          </div>
        ) : (
          <>
            {/* Optimization Summary KPIs */}
            {summary && <OptimizationStatsCards summary={summary} />}
            
            {/* Recommendations List */}
            <RecommendationList recommendations={recommendations} />
            
            {/* ESG Transparency Notice */}
            <div style={{
              marginTop: '32px',
              padding: '20px 24px',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderLeft: '4px solid #0033a0',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <svg width="20" height="20" viewBox="0 0 16 16" fill="#0033a0" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '8px', fontSize: '15px' }}>
                    Advisory System - No Automated Enforcement
                  </div>
                  <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                    <strong>All recommendations are advisory only.</strong> This system analyzes AI workload data 
                    and suggests optimization opportunities based on rule-based logic. No automated changes are made 
                    to your infrastructure. Final deployment decisions remain with Allianz.
                  </div>
                  <div style={{ 
                    marginTop: '12px', 
                    paddingTop: '12px', 
                    borderTop: '1px solid #e5e7eb',
                    fontSize: '13px',
                    color: '#6b7280'
                  }}>
                    <strong>Methodology:</strong> Rule-based optimization engine analyzing runtime, region, model type, and utilization patterns
                    <br />
                    <strong>Recommendation Types:</strong> Region optimization, time scheduling, model efficiency, idle detection
                    <br />
                    <strong>Compliance:</strong> Supports ESG reporting and responsible AI governance
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
