/**
 * Green-Time Scheduler Dashboard
 * Schedule AI workloads during low-carbon electricity periods
 */
'use client';

import { useEffect, useState } from 'react';
import {
  getSchedulingStatistics,
  getScheduledWorkloads,
  getNextGreenWindow,
  scheduleWorkload,
  createWebSocket
} from '@/services/api';

export default function SchedulerPage() {
  const [statistics, setStatistics] = useState<any>(null);
  const [scheduledWorkloads, setScheduledWorkloads] = useState<any[]>([]);
  const [nextWindows, setNextWindows] = useState<any>({});
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const regions = ['us-east-1', 'eu-west-1', 'ap-south-1'];

  const fetchData = async () => {
    try {
      const [stats, workloads] = await Promise.all([
        getSchedulingStatistics(),
        getScheduledWorkloads()
      ]);
      
      setStatistics(stats);
      setScheduledWorkloads(workloads.scheduled_workloads || []);

      // Fetch next windows for all regions
      const windows: any = {};
      for (const region of regions) {
        try {
          const window = await getNextGreenWindow(region);
          windows[region] = window;
        } catch (error) {
          console.error(`Failed to fetch window for ${region}:`, error);
        }
      }
      setNextWindows(windows);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch scheduler data:', error);
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

    const interval = setInterval(fetchData, 15000);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  const handleSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await scheduleWorkload({
        model_name: formData.get('model_name') as string,
        job_type: formData.get('job_type') as string,
        gpu_count: parseInt(formData.get('gpu_count') as string),
        preferred_region: formData.get('region') as string,
        created_by: 'User'
      });
      
      setShowScheduleForm(false);
      fetchData();
      alert('Workload scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule workload:', error);
      alert('Failed to schedule workload');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '24px 32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 600 }}>
              ⏰ Green-Time Scheduler
            </h1>
            <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: '14px' }}>
              Schedule AI Workloads During Low-Carbon Electricity Periods
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
            <button
              onClick={() => setShowScheduleForm(true)}
              style={{
                padding: '10px 20px',
                background: 'white',
                border: 'none',
                borderRadius: '6px',
                color: '#10b981',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              + Schedule Workload
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            <div style={{ fontSize: '18px', fontWeight: 500 }}>Loading scheduler data...</div>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            {statistics && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                <StatCard
                  label="Total Scheduled"
                  value={statistics.total_scheduled}
                  icon="📅"
                  color="#10b981"
                />
                <StatCard
                  label="Completed"
                  value={statistics.completed}
                  icon="✅"
                  color="#059669"
                />
                <StatCard
                  label="Pending"
                  value={statistics.pending}
                  icon="⏳"
                  color="#f59e0b"
                />
                <StatCard
                  label="Carbon Saved"
                  value={`${statistics.total_carbon_saved_kg} kg`}
                  icon="🌱"
                  color="#10b981"
                />
              </div>
            )}

            {/* Next Green Windows */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb',
              marginBottom: '32px'
            }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
                Next Green Time Windows
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {regions.map((region) => {
                  const window = nextWindows[region];
                  return (
                    <div key={region} style={{
                      padding: '20px',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', marginBottom: '12px' }}>
                        {region}
                      </div>
                      {window ? (
                        <>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                            Next Window: {window.hours_until?.toFixed(1)} hours
                          </div>
                          <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                            Renewable: {window.window?.renewable_percentage}%
                          </div>
                          <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                            Carbon: {window.window?.carbon_intensity} kg/kWh
                          </div>
                        </>
                      ) : (
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>Loading...</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scheduled Workloads */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
                Scheduled Workloads
              </h3>
              {scheduledWorkloads.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Model</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Job Type</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Region</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Scheduled Time</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Carbon Saved</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduledWorkloads.slice(0, 10).map((workload) => (
                        <tr key={workload.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#1f2937' }}>{workload.model_name}</td>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#6b7280' }}>{workload.job_type}</td>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#6b7280' }}>{workload.preferred_region}</td>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#6b7280' }}>
                            {new Date(workload.scheduled_time).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              background: workload.status === 'COMPLETED' ? '#d1fae5' : '#fef3c7',
                              color: workload.status === 'COMPLETED' ? '#065f46' : '#92400e'
                            }}>
                              {workload.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#10b981', fontWeight: 600 }}>
                            {workload.carbon_saved_kg?.toFixed(3)} kg
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                  <div style={{ fontSize: '14px' }}>No scheduled workloads yet</div>
                  <div style={{ fontSize: '12px', marginTop: '8px' }}>
                    Click "Schedule Workload" to get started
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Schedule Form Modal */}
      {showScheduleForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 600 }}>
              Schedule Workload for Green Time
            </h3>
            <form onSubmit={handleSchedule}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Model Name
                </label>
                <input
                  name="model_name"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="e.g., PolicyGPT-Large"
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Job Type
                </label>
                <select
                  name="job_type"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="training">Training</option>
                  <option value="inference">Inference</option>
                  <option value="batch">Batch Processing</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  GPU Count
                </label>
                <input
                  name="gpu_count"
                  type="number"
                  required
                  min="1"
                  max="16"
                  defaultValue="4"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Preferred Region
                </label>
                <select
                  name="region"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="us-east-1">US East (Virginia)</option>
                  <option value="eu-west-1">EU West (Ireland)</option>
                  <option value="ap-south-1">Asia Pacific (Mumbai)</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowScheduleForm(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: 'white'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: '#10b981',
                    color: 'white'
                  }}
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
