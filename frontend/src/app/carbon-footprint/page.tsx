/**
 * Carbon Footprint Dashboard Page
 * Feature 3: Converts energy consumption into CO₂ emissions
 * Provides regional climate impact analysis for ESG reporting
 */
'use client';

import { useEffect, useState } from 'react';
import { createWebSocket } from '@/services/api';
import CarbonStatsCards from '@/components/CarbonStatsCards';
import CarbonByRegionChart from '@/components/CarbonByRegionChart';
import CarbonByModelChart from '@/components/CarbonByModelChart';

interface Workload {
  id: number;
  model_name: string;
  cloud_region: string;
  energy_kwh?: number;
  carbon_kg?: number;
  status: string;
}

export default function CarbonFootprintPage() {
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [carbonSummary, setCarbonSummary] = useState<any>(null);

  useEffect(() => {
    // WebSocket connection for real-time updates
    const ws = createWebSocket((data) => {
      if (data.type === 'workload_update') {
        setWorkloads(data.data);
        setIsConnected(true);
        
        // Update carbon summary if available
        if (data.carbon_summary) {
          setCarbonSummary(data.carbon_summary);
        }
      }
    });

    return () => ws.close();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        color: 'white',
        padding: '24px 32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 600 }}>
              🌍 Carbon Footprint Dashboard
            </h1>
            <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: '14px' }}>
              AI-Related CO₂ Emissions | Regional Climate Impact Analysis
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
        {/* Carbon Summary KPIs */}
        <CarbonStatsCards workloads={workloads} carbonSummary={carbonSummary} />
        
        {/* Carbon Analytics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '24px', 
          marginTop: '32px' 
        }}>
          <CarbonByRegionChart workloads={workloads} />
          <CarbonByModelChart workloads={workloads} />
        </div>
        
        {/* ESG Transparency Notice */}
        <div style={{
          marginTop: '32px',
          padding: '20px 24px',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderLeft: '4px solid #059669',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="#059669" style={{ flexShrink: 0, marginTop: '2px' }}>
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '8px', fontSize: '15px' }}>
                ESG Transparency Notice
              </div>
              <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                <strong>Carbon emissions are estimated</strong> using region-based electricity carbon intensity factors. 
                Values represent estimates for ESG reporting and climate impact assessment.
              </div>
              <div style={{ 
                marginTop: '12px', 
                paddingTop: '12px', 
                borderTop: '1px solid #e5e7eb',
                fontSize: '13px',
                color: '#6b7280'
              }}>
                <strong>Formula:</strong> CO₂ (kg) = Energy (kWh) × Carbon Intensity (kg CO₂ / kWh)
                <br />
                <strong>Carbon Intensities:</strong> EU: 0.25 | US: 0.40 | India: 0.70 kg CO₂/kWh
                <br />
                <strong>Compliance:</strong> Aligned with GHG Protocol Scope 2 guidance
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
