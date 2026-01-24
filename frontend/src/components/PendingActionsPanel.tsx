/**
 * Pending Actions Panel
 * Shows actions awaiting manager approval
 */
'use client';

interface Action {
  id: number;
  title: string;
  action_type: string;
  estimated_carbon_saving_kg: number;
  estimated_cost_impact_usd: number;
  requested_at: string;
  status: string;
}

interface Props {
  actions: Action[];
  onRefresh: () => void;
}

export default function PendingActionsPanel({ actions, onRefresh }: Props) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '18px', 
          fontWeight: 600,
          color: '#1f2937' 
        }}>
          ⏳ Pending Approvals
        </h3>
        <button
          onClick={onRefresh}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 500,
            color: '#7c3aed',
            background: '#7c3aed15',
            border: '1px solid #7c3aed40',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Actions List */}
      {actions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {actions.slice(0, 5).map((action) => (
            <div key={action.id} style={{
              padding: '14px',
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: '8px'
            }}>
              <div style={{ 
                fontSize: '13px', 
                fontWeight: 600, 
                color: '#1f2937',
                marginBottom: '6px'
              }}>
                {action.title}
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '11px',
                color: '#6b7280'
              }}>
                <span>💾 {action.estimated_carbon_saving_kg.toFixed(3)} kg CO₂</span>
                <span>💰 ${Math.abs(action.estimated_cost_impact_usd).toFixed(2)}</span>
              </div>
            </div>
          ))}
          {actions.length > 5 && (
            <div style={{ 
              textAlign: 'center', 
              fontSize: '12px', 
              color: '#6b7280',
              marginTop: '8px'
            }}>
              +{actions.length - 5} more pending actions
            </div>
          )}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: '#9ca3af',
          fontSize: '13px'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
          <div>No pending approvals</div>
          <div style={{ fontSize: '11px', marginTop: '4px' }}>
            All actions have been reviewed
          </div>
        </div>
      )}
    </div>
  );
}
