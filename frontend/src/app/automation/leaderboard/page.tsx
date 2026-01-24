/**
 * Eco-Score Leaderboard
 * Team-based sustainability competition and gamification
 */
'use client';

import { useEffect, useState } from 'react';
import {
  getLeaderboard,
  getGamificationSummary,
  getBadgeInfo,
  createWebSocket
} from '@/services/api';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [badges, setBadges] = useState<any>({});
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [leaderboardData, summaryData, badgeData] = await Promise.all([
        getLeaderboard(),
        getGamificationSummary(),
        getBadgeInfo()
      ]);
      
      setLeaderboard(leaderboardData.leaderboard || []);
      setSummary(summaryData);
      setBadges(badgeData.badges || {});
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch leaderboard data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const ws = createWebSocket((data) => {
      if (data.type === 'workload_update') {
        setIsConnected(true);
      }
    });

    const interval = setInterval(fetchData, 20000);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#f59e0b'; // Gold
    if (rank === 2) return '#9ca3af'; // Silver
    if (rank === 3) return '#cd7f32'; // Bronze
    return '#6b7280';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: 'white',
        padding: '24px 32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 600 }}>
              🏆 Eco-Score Leaderboard
            </h1>
            <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: '14px' }}>
              Team-Based Sustainability Competition | Current Month Rankings
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
            <a href="/automation" style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500
            }}>
              ← Automation Hub
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            <div style={{ fontSize: '18px', fontWeight: 500 }}>Loading leaderboard...</div>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            {summary && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                <StatCard
                  label="Total Teams"
                  value={summary.total_teams}
                  icon="👥"
                  color="#f59e0b"
                />
                <StatCard
                  label="Carbon Saved"
                  value={`${summary.total_carbon_saved_kg} kg`}
                  icon="🌱"
                  color="#10b981"
                />
                <StatCard
                  label="Optimizations"
                  value={summary.total_optimizations_adopted}
                  icon="⚡"
                  color="#3b82f6"
                />
                <StatCard
                  label="Avg Score"
                  value={Math.round(summary.average_score_per_team)}
                  icon="📊"
                  color="#8b5cf6"
                />
              </div>
            )}

            {/* Leaderboard */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb',
              marginBottom: '32px'
            }}>
              <h3 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 600, color: '#1f2937' }}>
                Team Rankings
              </h3>
              
              {leaderboard.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {leaderboard.map((team) => (
                    <div
                      key={team.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '20px',
                        background: team.rank <= 3 ? `${getRankColor(team.rank)}08` : '#f9fafb',
                        border: `2px solid ${team.rank <= 3 ? getRankColor(team.rank) : '#e5e7eb'}`,
                        borderRadius: '12px',
                        transition: 'all 0.2s'
                      }}
                    >
                      {/* Rank */}
                      <div style={{
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: team.rank <= 3 ? '32px' : '20px',
                        fontWeight: 700,
                        color: getRankColor(team.rank),
                        marginRight: '20px'
                      }}>
                        {getRankIcon(team.rank)}
                      </div>

                      {/* Team Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>
                          {team.team_name}
                        </div>
                        <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#6b7280' }}>
                          <span>🌱 {team.carbon_saved_kg.toFixed(1)} kg CO₂</span>
                          <span>⚡ {team.energy_saved_kwh.toFixed(1)} kWh</span>
                          <span>✅ {team.optimizations_adopted} optimizations</span>
                        </div>
                      </div>

                      {/* Score */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginLeft: '20px',
                        padding: '12px 24px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>
                          SCORE
                        </div>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b' }}>
                          {team.score.toLocaleString()}
                        </div>
                      </div>

                      {/* Badges */}
                      {team.badges && team.badges.length > 0 && (
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          marginLeft: '20px',
                          flexWrap: 'wrap',
                          maxWidth: '200px'
                        }}>
                          {team.badges.slice(0, 5).map((badgeKey: string) => {
                            const badge = badges[badgeKey];
                            return badge ? (
                              <div
                                key={badgeKey}
                                title={badge.description}
                                style={{
                                  fontSize: '24px',
                                  cursor: 'help'
                                }}
                              >
                                {badge.icon}
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>
                  <div style={{ fontSize: '16px', fontWeight: 500 }}>No teams yet</div>
                  <div style={{ fontSize: '13px', marginTop: '8px' }}>
                    Teams will appear here as they earn eco-scores
                  </div>
                </div>
              )}
            </div>

            {/* Available Badges */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
                Available Badges
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {Object.entries(badges).map(([key, badge]: [string, any]) => (
                  <div
                    key={key}
                    style={{
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{ fontSize: '32px' }}>{badge.icon}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>
                        {badge.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                        {badge.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scoring Info */}
            <div style={{
              marginTop: '32px',
              padding: '20px 24px',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderLeft: '4px solid #f59e0b',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '8px', fontSize: '15px' }}>
                How Scoring Works
              </div>
              <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                Teams earn points for sustainable actions:
              </div>
              <div style={{ 
                marginTop: '12px', 
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                fontSize: '13px',
                color: '#6b7280'
              }}>
                <div>🌱 <strong>10 points</strong> per kg CO₂ saved</div>
                <div>⚡ <strong>5 points</strong> per kWh saved</div>
                <div>✅ <strong>50 points</strong> per optimization adopted</div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, color }: any) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          fontSize: '32px',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `${color}15`,
          borderRadius: '8px'
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', fontWeight: 500 }}>
            {label}
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1f2937' }}>
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}
