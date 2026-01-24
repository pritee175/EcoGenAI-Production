/**
 * ESG Score Gauge Component
 * Displays overall ESG score with visual gauge and interpretation
 */
'use client';

interface Interpretation {
  rating: string;
  color: string;
  message: string;
  icon: string;
}

interface Props {
  score: number;
  interpretation: Interpretation;
}

export default function ESGScoreGauge({ score, interpretation }: Props) {
  // Calculate gauge rotation (0-180 degrees for semicircle)
  const rotation = (score / 100) * 180;
  
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '40px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ 
          margin: '0 0 8px', 
          fontSize: '24px', 
          fontWeight: 600,
          color: '#1f2937' 
        }}>
          Overall ESG Sustainability Score
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
          Composite indicator of AI environmental performance
        </p>
      </div>

      {/* Gauge Visualization */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        {/* Semicircle Gauge */}
        <div style={{ 
          position: 'relative', 
          width: '300px', 
          height: '150px',
          marginBottom: '24px'
        }}>
          {/* Background arc */}
          <svg width="300" height="150" style={{ position: 'absolute', top: 0, left: 0 }}>
            <path
              d="M 30 150 A 120 120 0 0 1 270 150"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="24"
              strokeLinecap="round"
            />
            {/* Colored segments */}
            {/* Red: 0-40 */}
            <path
              d="M 30 150 A 120 120 0 0 1 102 42"
              fill="none"
              stroke="#dc2626"
              strokeWidth="24"
              strokeLinecap="round"
              opacity="0.3"
            />
            {/* Orange: 40-60 */}
            <path
              d="M 102 42 A 120 120 0 0 1 150 30"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="24"
              strokeLinecap="round"
              opacity="0.3"
            />
            {/* Light Green: 60-80 */}
            <path
              d="M 150 30 A 120 120 0 0 1 198 42"
              fill="none"
              stroke="#10b981"
              strokeWidth="24"
              strokeLinecap="round"
              opacity="0.3"
            />
            {/* Green: 80-100 */}
            <path
              d="M 198 42 A 120 120 0 0 1 270 150"
              fill="none"
              stroke="#059669"
              strokeWidth="24"
              strokeLinecap="round"
              opacity="0.3"
            />
          </svg>
          
          {/* Needle */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            width: '4px',
            height: '110px',
            background: interpretation.color,
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) rotate(${rotation - 90}deg)`,
            transition: 'transform 1s ease-out',
            borderRadius: '2px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }} />
          
          {/* Center dot */}
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            width: '16px',
            height: '16px',
            background: interpretation.color,
            borderRadius: '50%',
            transform: 'translateX(-50%)',
            border: '3px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }} />
        </div>

        {/* Score Display */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '72px', 
            fontWeight: 700, 
            color: interpretation.color,
            lineHeight: 1,
            marginBottom: '8px'
          }}>
            {score.toFixed(1)}
          </div>
          <div style={{ 
            fontSize: '16px', 
            color: '#6b7280',
            fontWeight: 500
          }}>
            out of 100
          </div>
        </div>
      </div>

      {/* Rating Badge */}
      <div style={{ 
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 600,
          color: interpretation.color,
          background: `${interpretation.color}15`,
          border: `2px solid ${interpretation.color}40`
        }}>
          {interpretation.icon} {interpretation.rating}
        </div>
      </div>

      {/* Interpretation Message */}
      <div style={{
        padding: '20px',
        background: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          fontSize: '15px', 
          color: '#374151', 
          lineHeight: '1.6',
          textAlign: 'center'
        }}>
          {interpretation.message}
        </div>
      </div>

      {/* Score Scale Reference */}
      <div style={{ 
        marginTop: '24px',
        paddingTop: '24px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '12px',
          fontSize: '12px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '100%', 
              height: '4px', 
              background: '#dc2626', 
              borderRadius: '2px',
              marginBottom: '6px'
            }} />
            <div style={{ color: '#6b7280', fontWeight: 500 }}>0-39</div>
            <div style={{ color: '#9ca3af', fontSize: '11px' }}>Needs Work</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '100%', 
              height: '4px', 
              background: '#f59e0b', 
              borderRadius: '2px',
              marginBottom: '6px'
            }} />
            <div style={{ color: '#6b7280', fontWeight: 500 }}>40-59</div>
            <div style={{ color: '#9ca3af', fontSize: '11px' }}>Fair</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '100%', 
              height: '4px', 
              background: '#10b981', 
              borderRadius: '2px',
              marginBottom: '6px'
            }} />
            <div style={{ color: '#6b7280', fontWeight: 500 }}>60-79</div>
            <div style={{ color: '#9ca3af', fontSize: '11px' }}>Good</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '100%', 
              height: '4px', 
              background: '#059669', 
              borderRadius: '2px',
              marginBottom: '6px'
            }} />
            <div style={{ color: '#6b7280', fontWeight: 500 }}>80-100</div>
            <div style={{ color: '#9ca3af', fontSize: '11px' }}>Excellent</div>
          </div>
        </div>
      </div>
    </div>
  );
}
