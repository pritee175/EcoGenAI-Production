/**
 * AI Sustainability Auditor Bot
 * Natural language Q&A interface for ESG transparency
 */
'use client';

import { useEffect, useState } from 'react';
import { 
  askAuditorQuestion,
  getEmissionTrends,
  getRecommendedQuestions,
  createWebSocket
} from '@/services/api';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  supportingData?: any;
}

export default function AuditorBotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>([]);
  const [trends, setTrends] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [questionsData, trendsData] = await Promise.all([
          getRecommendedQuestions(),
          getEmissionTrends(7)
        ]);
        
        setRecommendedQuestions(questionsData.questions || []);
        setTrends(trendsData);

        // Add welcome message
        setMessages([{
          id: Date.now().toString(),
          type: 'bot',
          content: `Hello! I'm your AI Sustainability Auditor. I can help you understand your organization's carbon footprint, emission trends, and ESG performance. Ask me anything about your AI sustainability metrics!`,
          timestamp: new Date()
        }]);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };

    fetchInitialData();

    // WebSocket connection for real-time updates
    const ws = createWebSocket((data) => {
      if (data.type === 'workload_update') {
        setIsConnected(true);
        // Refresh trends when workload data changes
        getEmissionTrends(7).then(setTrends).catch(console.error);
      }
    });

    return () => {
      ws.close();
    };
  }, []);

  const handleAskQuestion = async (question: string) => {
    if (!question.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await askAuditorQuestion(question);
      
      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.answer,
        timestamp: new Date(),
        supportingData: response.supporting_data
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to ask question:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error processing your question. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleAskQuestion(question);
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
              🤖 AI Sustainability Auditor
            </h1>
            <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: '14px' }}>
              Natural Language Q&A for ESG Transparency | Ask Anything About Your Carbon Footprint
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
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
          
          {/* Chat Area */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 250px)'
          }}>
            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: message.type === 'user' 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : '#f3f4f6',
                    color: message.type === 'user' ? 'white' : '#1f2937',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {message.content}
                    </p>
                    {message.supportingData && (
                      <div style={{
                        marginTop: '12px',
                        padding: '12px',
                        background: 'rgba(0,0,0,0.05)',
                        borderRadius: '8px',
                        fontSize: '13px'
                      }}>
                        <strong>Supporting Data:</strong>
                        <pre style={{ 
                          margin: '8px 0 0', 
                          fontSize: '12px',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}>
                          {JSON.stringify(message.supportingData, null, 2)}
                        </pre>
                      </div>
                    )}
                    <div style={{
                      marginTop: '8px',
                      fontSize: '11px',
                      opacity: 0.7
                    }}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: '#f3f4f6',
                    color: '#6b7280'
                  }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <div className="typing-dot" />
                      <div className="typing-dot" style={{ animationDelay: '0.2s' }} />
                      <div className="typing-dot" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAskQuestion(inputValue);
              }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything about your AI sustainability metrics..."
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
                      opacity: isLoading || !inputValue.trim() ? 0.5 : 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    {isLoading ? 'Thinking...' : 'Ask'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Quick Questions */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                margin: '0 0 16px', 
                fontSize: '16px', 
                fontWeight: 600,
                color: '#1f2937'
              }}>
                💡 Quick Questions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recommendedQuestions.slice(0, 5).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    disabled={isLoading}
                    style={{
                      padding: '10px 12px',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '13px',
                      textAlign: 'left',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      color: '#374151'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.background = '#f3f4f6';
                        e.currentTarget.style.borderColor = '#10b981';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Trends */}
            {trends && (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ 
                  margin: '0 0 16px', 
                  fontSize: '16px', 
                  fontWeight: 600,
                  color: '#1f2937'
                }}>
                  📊 Current Trends
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    borderLeft: '3px solid #10b981'
                  }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                      Trend Direction
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>
                      {trends.trend_direction === 'increasing' ? '📈 Increasing' : 
                       trends.trend_direction === 'decreasing' ? '📉 Decreasing' : '➡️ Stable'}
                    </div>
                  </div>

                  <div style={{
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    borderLeft: '3px solid #f59e0b'
                  }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                      Change (7 days)
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>
                      {trends.change_percentage > 0 ? '+' : ''}{trends.change_percentage?.toFixed(1)}%
                    </div>
                  </div>

                  <div style={{
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    borderLeft: '3px solid #ef4444'
                  }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                      Total Emissions
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>
                      {trends.total_emissions_kg?.toFixed(2)} kg CO₂
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Help */}
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white'
            }}>
              <h3 style={{ 
                margin: '0 0 12px', 
                fontSize: '16px', 
                fontWeight: 600
              }}>
                ℹ️ How to Use
              </h3>
              <ul style={{ 
                margin: 0, 
                paddingLeft: '20px',
                fontSize: '13px',
                lineHeight: 1.6
              }}>
                <li>Ask questions in natural language</li>
                <li>Get instant explanations with data</li>
                <li>Use quick questions for common queries</li>
                <li>View supporting data for transparency</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6b7280;
          animation: typing 1.4s infinite;
        }
      `}</style>
    </div>
  );
}
