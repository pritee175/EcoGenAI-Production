/**
 * Automation Hub - Phase 2 Advanced Features
 * Green-Time Scheduler, Carbon Autopilot, Gamification, Climate Risk
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getSchedulingStatistics,
  getAutopilotStatistics,
  getGamificationSummary,
  getLatestClimateRisk,
  createWebSocket
} from '@/services/api';

export default function AutomationHubPage() {
  const router = useRouter();
  const [schedulerStats, setSchedulerStats] = useState<any>(null);
  const [autopilotStats, setAutopilotStats] = useState<any>(null);
  const [gamificationSummary, setGamificationSummary] = useState<any>(null);
  const [climateRisk, setClimateRisk] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [scheduler, autopilot, gamification, climate] = await Promise.all([
        getSchedulingStatistics(),
        getAutopilotStatistics(),
        getGamificationSummary(),
        getLatestClimateRisk()
      ]);
      
      setSchedulerStats(scheduler);
      setAutopilotStats(autopilot);
      setGamificationSummary(gamification);
      setClimateRisk(climate);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch automation data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const ws = createWebSocket((data) => {
      if (data.type === 'workload_update') {
        setIsConnected(true);
        fetchData();
      }
    });

    const interval = setInterval(fetchData, 20000);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  const features = [
    {
      id: 'scheduler',
      title: 'Green-Time Scheduler',
      icon: '⏰',
      description: 'Schedule workloads during low-carbon electricity periods',
      color: '#10b981',
      stats: schedulerStats,
      route: '/automation/scheduler'
    },
    {
      id: 'autopilot',
      title: 'Carbon Autopilot',
      icon: '🤖',
      description: 'Automatically detect and manage idle resources',
      color: '#3b82f6',
      stats: autopilotStats,
      route: '/automation/autopilot'
    },
    {
      id: 'gamification',
      title: 'Eco-Score Leaderboard',
      icon: '🏆',
      description: 'Team-based sustainability competition',
      color: '#f59e0b',
      stats: gamificationSummary,
      route: '/automation/leaderboard'
    },
    {
      id: 'climate-risk',
      title: 'Climate Risk Simulator',
      icon: '🌍',
      description: 'Predictive climate impact modeling',
      color: '#ef4444',
      stats: climateRisk,
      route: '/automation/climate-risk'
    }
  ];

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
              🚀 Automation Hub
            </h1>
            <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: '14px' }}>
              Phase 2: Advanced Automation & Intelligence Layer
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
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="/" style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500
            }}>
              ← Dashboard
            </a>
            <a href="/governance" style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500
            }}>
              Governance
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            <div style={{ fontSize: '18px', fontWeight: 500 }}>Loading automation features...</div>
          </div>
        ) : (
          <>
            {/* Feature Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {features.map((feature) => (
                <div
                  key={feature.id}
                  onClick={() => router.push(feature.route)}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                >
                  {/* Color accent bar */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: feature.color
                  }} />

                  {/* Icon and Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{
                      fontSize: '48px',
                      width: '72px',
                      height: '72px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `${feature.color}15`,
                      borderRadius: '12px'
                    }}>
                      {feature.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#1f2937'
                      }}>
                        {feature.title}
                      </h3>
                      <p style={{
                        margin: '4px 0 0',
                        fontSize: '13px',
                        color: '#6b7280',
                        lineHeight: '1.5'
                      }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  {feature.stats && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '12px',
                      marginTop: '20px'
                    }}>
                      {feature.id === 'scheduler' && (
                        <>
                          <StatBox label="Scheduled" value={feature.stats.total_scheduled || 0} />
                          <StatBox label="Completed" value={feature.stats.completed || 0} />
                          <StatBox label="Carbon Saved" value={`${feature.stats.total_carbon_saved_kg || 0} kg`} />
                        </>
                      )}
                      {feature.id === 'autopilot' && (
                        <>
                          <StatBox label="Actions" value={feature.stats.total_actions || 0} />
                          <StatBox label="Carbon Saved" value={`${feature.stats.total_carbon_saved_kg || 0} kg`} />
                          <StatBox label="Cost Saved" value={`$${feature.stats.total_cost_saved_usd || 0}`} />
                        </>
                      )}
                      {feature.id === 'gamification' && (
                        <>
                          <StatBox label="Teams" value={feature.stats.total_teams || 0} />
                          <StatBox label="Carbon Saved" value={`${feature.stats.total_carbon_saved_kg || 0} kg`} />
                          <StatBox label="Optimizations" value={feature.stats.total_optimizations_adopted || 0} />
                        </>
                      )}
                      {feature.id === 'climate-risk' && feature.stats.risk_score !== undefined && (
                        <>
                          <StatBox label="Risk Score" value={Math.round(feature.stats.risk_score)} />
                          <StatBox label="Category" value={feature.stats.climate_impact_category || 'N/A'} />
                          <StatBox label="Trend" value={feature.stats.emissions_trend || 'N/A'} />
                        </>
                      )}
                    </div>
                  )}

                  {/* View Details Link */}
                  <div style={{
                    marginTop: '20px',
                    paddingTop: '20px',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: feature.color
                    }}>
                      View Details →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Phase 2 Overview */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
                About Phase 2 Automation
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                Phase 2 introduces advanced automation and intelligence capabilities to the EcoGenAI platform.
                These features enable proactive carbon management, behavioral change through gamification,
                and strategic climate risk planning.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏰</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#1f2937' }}>Smart Scheduling</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                    Run workloads during low-carbon hours
                  </div>
                </div>
                <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🤖</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#1f2937' }}>Auto-Management</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                    Detect and stop idle resources
                  </div>
                </div>
                <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏆</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#1f2937' }}>Team Competition</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                    Gamified sustainability engagement
                  </div>
                </div>
                <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🌍</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#1f2937' }}>Risk Planning</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                    Strategic climate impact modeling
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

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{
      padding: '12px',
      background: '#f9fafb',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '4px', fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>
        {value}
      </div>
    </div>
  );
}
