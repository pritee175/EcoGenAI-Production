/**
 * Sustainability Auditor Bot Component
 * Step 8: Natural language Q&A for ESG transparency
 */
'use client';

import { useState, useEffect } from 'react';
import { askAuditorQuestion, getRecommendedQuestions } from '@/services/api';

interface Message {
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  supportingData?: any;
}

export default function SustainabilityAuditorBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>([]);

  useEffect(() => {
    // Load recommended questions
    getRecommendedQuestions()
      .then(data => setRecommendedQuestions(data.questions || []))
      .catch(console.error);
    
    // Initial bot greeting
    setMessages([{
      type: 'bot',
      text: "Hello! I'm your Sustainability Auditor Bot. I can help explain carbon emissions, trends, and answer questions about your AI sustainability metrics. Try asking: 'Why did emissions increase this week?'",
      timestamp: new Date()
    }]);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      type: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askAuditorQuestion(input);
      
      const botMessage: Message = {
        type: 'bot',
        text: response.answer,
        timestamp: new Date(),
        supportingData: response.supporting_data
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        type: 'bot',
        text: "I'm sorry, I encountered an error processing your question. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommendedClick = (question: string) => {
    setInput(question);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #e5e7eb',
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        color: 'white',
        borderRadius: '12px 12px 0 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '32px' }}>🤖</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
              Sustainability Auditor Bot
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.9 }}>
              Ask questions about carbon emissions and sustainability metrics
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start',
              gap: '12px'
            }}
          >
            {msg.type === 'bot' && (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0
              }}>
                🤖
              </div>
            )}
            
            <div style={{
              maxWidth: '75%',
              padding: '12px 16px',
              borderRadius: '12px',
              background: msg.type === 'user' ? '#0033a0' : '#f3f4f6',
              color: msg.type === 'user' ? 'white' : '#1f2937',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              {msg.text}
              
              {msg.supportingData && msg.type === 'bot' && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: 'white',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  <div style={{ fontWeight: 600, marginBottom: '8px', color: '#374151' }}>
                    Supporting Data:
                  </div>
                  {msg.supportingData.trend && (
                    <div>Trend: <strong>{msg.supportingData.trend}</strong></div>
                  )}
                  {msg.supportingData.change_percentage !== undefined && (
                    <div>Change: <strong>{msg.supportingData.change_percentage}%</strong></div>
                  )}
                  {msg.supportingData.top_contributing_models && (
                    <div style={{ marginTop: '8px' }}>
                      Top Models: {msg.supportingData.top_contributing_models.map((m: any) => m.model).join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>

            {msg.type === 'user' && (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#0033a0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: 'white',
                flexShrink: 0
              }}>
                👤
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🤖
            </div>
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#f3f4f6',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Recommended Questions */}
      {recommendedQuestions.length > 0 && (
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #e5e7eb',
          background: '#f9fafb',
          maxHeight: '120px',
          overflowY: 'auto'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '8px' }}>
            Suggested Questions:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {recommendedQuestions.slice(0, 4).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleRecommendedClick(q)}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#10b981';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: '12px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question about emissions..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          style={{
            padding: '12px 24px',
            background: isLoading || !input.trim() ? '#d1d5db' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

