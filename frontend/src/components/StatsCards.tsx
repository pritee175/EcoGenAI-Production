/**
 * StatsCards Component
 * Professional KPI cards with animations and modern design
 */
import { Workload } from '@/services/api';

interface StatsCardsProps {
  workloads: Workload[];
}

export default function StatsCards({ workloads }: StatsCardsProps) {
  const activeWorkloads = workloads.filter(w => w.status === 'running');
  const totalGPUs = activeWorkloads.reduce((sum, w) => sum + w.gpu_count, 0);
  const avgRuntime = activeWorkloads.length > 0
    ? activeWorkloads.reduce((sum, w) => sum + w.runtime_seconds, 0) / activeWorkloads.length
    : 0;

  const formatRuntime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const stats = [
    {
      icon: '🚀',
      label: 'Active Workloads',
      value: activeWorkloads.length,
      change: '+12%',
      changeType: 'positive',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: '⚡',
      label: 'Total GPUs',
      value: totalGPUs,
      change: '+8%',
      changeType: 'positive',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: '⏱️',
      label: 'Avg Runtime',
      value: formatRuntime(Math.floor(avgRuntime)),
      change: '-5%',
      changeType: 'negative',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: '🌍',
      label: 'Regions',
      value: new Set(activeWorkloads.map(w => w.cloud_region)).size,
      change: 'Stable',
      changeType: 'neutral',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="stat-card card animate-fadeIn"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="stat-icon" style={{ background: stat.color }}>
            {stat.icon}
          </div>
          <div className="stat-content">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className={`stat-change ${stat.changeType}`}>
              {stat.changeType === 'positive' && '↑ '}
              {stat.changeType === 'negative' && '↓ '}
              {stat.change}
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          padding: var(--space-xl);
          transition: all var(--transition-base);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--primary);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform var(--transition-base);
        }

        .stat-card:hover::before {
          transform: scaleX(1);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
        }

        .stat-icon {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          flex-shrink: 0;
          box-shadow: var(--shadow-md);
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: var(--space-xs);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
          margin-bottom: var(--space-xs);
        }

        .stat-change {
          font-size: 0.875rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .stat-change.positive {
          color: var(--success);
        }

        .stat-change.negative {
          color: var(--error);
        }

        .stat-change.neutral {
          color: var(--text-tertiary);
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
