/**
 * WorkloadTable Component
 * Professional data table with modern styling and real-time updates
 */
import { Workload } from '@/services/api';

interface Props {
  workloads: Workload[];
  onStop?: (id: number) => void;
}

export default function WorkloadTable({ workloads, onStop }: Props) {
  return (
    <div className="workload-table-container card">
      <div className="table-header">
        <h3 className="table-title">Active AI Workloads</h3>
        <span className="badge badge-info">{workloads.length} Running</span>
      </div>

      <div className="table-wrapper">
        <table className="workload-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Type</th>
              <th>GPUs</th>
              <th>Region</th>
              <th>Runtime</th>
              <th>Energy (kWh)</th>
              <th>Carbon (kg)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {workloads.length === 0 ? (
              <tr>
                <td colSpan={9} className="empty-state">
                  <div className="empty-icon">📊</div>
                  <div>No active workloads</div>
                  <div className="empty-hint">Start a new workload to begin monitoring</div>
                </td>
              </tr>
            ) : (
              workloads.map((w, index) => (
                <tr key={w.id} className="table-row animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                  <td>
                    <div className="model-cell">
                      <span className="model-icon">🤖</span>
                      <strong>{w.model_name}</strong>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${w.job_type === 'training' ? 'badge-warning' : 'badge-info'}`}>
                      {w.job_type}
                    </span>
                  </td>
                  <td><strong>{w.gpu_count}</strong></td>
                  <td>
                    <span className="region-badge">{getRegionFlag(w.cloud_region)} {w.cloud_region}</span>
                  </td>
                  <td>
                    <span className="runtime-badge">{formatRuntime(w.runtime_seconds)}</span>
                  </td>
                  <td>
                    <span className="metric-value energy">
                      {w.energy_kwh !== undefined ? w.energy_kwh.toFixed(4) : '0.0000'}
                    </span>
                  </td>
                  <td>
                    <span className="metric-value carbon">
                      {w.carbon_kg !== undefined ? w.carbon_kg.toFixed(4) : '0.0000'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${w.status}`}>
                      <span className="status-dot"></span>
                      {w.status}
                    </span>
                  </td>
                  <td>
                    {w.status === 'running' && onStop && (
                      <button
                        onClick={() => onStop(w.id)}
                        className="btn-stop"
                      >
                        ⏹ Stop
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .workload-table-container {
          padding: 0;
          overflow: hidden;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-lg) var(--space-xl);
          border-bottom: 1px solid var(--border);
        }

        .table-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .workload-table {
          width: 100%;
          border-collapse: collapse;
        }

        .workload-table thead {
          background: var(--gray-50);
        }

        .workload-table th {
          text-align: left;
          padding: var(--space-md) var(--space-lg);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .workload-table td {
          padding: var(--space-lg);
          font-size: 0.875rem;
          color: var(--text-primary);
          border-bottom: 1px solid var(--gray-100);
        }

        .table-row {
          transition: background var(--transition-fast);
        }

        .table-row:hover {
          background: var(--gray-50);
        }

        .model-cell {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .model-icon {
          font-size: 1.25rem;
        }

        .region-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.875rem;
        }

        .runtime-badge {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          color: var(--success);
          background: #E8F5E9;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
        }

        .metric-value {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
        }

        .metric-value.energy {
          color: #F57C00;
          background: #FFF3E0;
        }

        .metric-value.carbon {
          color: #D32F2F;
          background: #FFEBEE;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-badge.running {
          background: #E8F5E9;
          color: #2E7D32;
        }

        .status-badge.completed {
          background: var(--gray-100);
          color: var(--gray-600);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          animation: pulse 2s ease-in-out infinite;
        }

        .btn-stop {
          padding: 6px 12px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--error);
          background: #FFEBEE;
          border: 1px solid #FFCDD2;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .btn-stop:hover {
          background: #FFCDD2;
          transform: translateY(-1px);
        }

        .empty-state {
          text-align: center;
          padding: var(--space-2xl) !important;
          color: var(--text-tertiary);
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: var(--space-md);
          opacity: 0.5;
        }

        .empty-hint {
          font-size: 0.875rem;
          margin-top: var(--space-sm);
          color: var(--text-tertiary);
        }

        @media (max-width: 1024px) {
          .table-wrapper {
            overflow-x: scroll;
          }

          .workload-table {
            min-width: 900px;
          }
        }
      `}</style>
    </div>
  );
}

function formatRuntime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getRegionFlag(region: string): string {
  const flags: Record<string, string> = {
    'US': '🇺🇸',
    'EU': '🇪🇺',
    'India': '🇮🇳',
  };
  return flags[region] || '🌍';
}
