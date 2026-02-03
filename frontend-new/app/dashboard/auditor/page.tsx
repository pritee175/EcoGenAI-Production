"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  Bot,
  User
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isAnimating?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "Summarize Q4 carbon emissions by region",
  "Why did emissions increase this week?",
  "Which model has the highest emissions?",
  "What is our current CSRD compliance status?",
  "List pending governance actions"
];

export default function AuditorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your ESG Auditor Assistant. I can help you with compliance queries, audit trails, regulatory documentation, and sustainability reporting. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (question?: string) => {
    const messageText = question || input.trim();
    if (!messageText || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call API
      const response = await fetch(`${API_URL}/api/auditor/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: messageText })
      });

      const data = await response.json();

      // Add bot response with animation
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.answer,
        timestamp: new Date(),
        isAnimating: true
      };

      setMessages(prev => [...prev, botMessage]);

      // Remove animation flag after animation completes
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessage.id ? { ...msg, isAnimating: false } : msg
          )
        );
      }, 600);

    } catch (error) {
      console.error('Error asking question:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I apologize, but I'm having trouble connecting to the backend. Please ensure the server is running and try again.",
        timestamp: new Date(),
        isAnimating: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageContent = (content: string) => {
    // Check if content contains code blocks
    if (content.includes('```')) {
      const parts = content.split('```');
      return parts.map((part, index) => {
        if (index % 2 === 1) {
          // This is a code block
          return (
            <div key={index} className="my-3 rounded-lg overflow-hidden">
              <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-xs font-mono whitespace-pre max-w-full custom-scrollbar">
                <code className="block">{part.trim()}</code>
              </pre>
            </div>
          );
        } else {
          // Regular text
          return (
            <div key={index} className="whitespace-pre-wrap break-words">
              {part.split('\n').map((line, i) => {
                // Format bold text
                if (line.startsWith('**') && line.endsWith('**')) {
                  return (
                    <p key={i} className="font-semibold text-[#003781] mt-3 mb-2 break-words">
                      {line.replace(/\*\*/g, '')}
                    </p>
                  );
                }
                // Format list items
                if (line.trim().startsWith('-')) {
                  return (
                    <li key={i} className="ml-4 mb-1 break-words">
                      {line.trim().substring(1).trim()}
                    </li>
                  );
                }
                return line ? <p key={i} className="mb-2 break-words">{line}</p> : <br key={i} />;
              })}
            </div>
          );
        }
      });
    }

    // Regular text formatting
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={i} className="font-semibold text-[#003781] mt-3 mb-2 break-words">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      if (line.trim().startsWith('-')) {
        return (
          <li key={i} className="ml-4 mb-1 break-words">
            {line.trim().substring(1).trim()}
          </li>
        );
      }
      return line ? <p key={i} className="mb-2 break-words">{line}</p> : <br key={i} />;
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-[#003781] to-[#0066b3] rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ESG Auditor Assistant</h1>
            <p className="text-gray-600">AI-powered compliance and sustainability insights</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="flex flex-col h-[calc(100vh-250px)] bg-white shadow-lg overflow-hidden">
        {/* Messages Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 custom-chat-scrollbar"
          style={{ scrollBehavior: 'smooth' }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'} ${
                message.isAnimating ? 'animate-slideDown' : ''
              }`}
            >
              {message.type === 'bot' && (
                <div className="w-8 h-8 bg-gradient-to-br from-[#003781] to-[#0066b3] rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 break-words overflow-hidden ${
                  message.type === 'user'
                    ? 'bg-[#003781] text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm break-words overflow-x-auto">
                  {formatMessageContent(message.content)}
                </div>
                <div className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start animate-slideDown">
              <div className="w-8 h-8 bg-gradient-to-br from-[#003781] to-[#0066b3] rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#003781]" />
                  <span className="text-sm text-gray-600">Analyzing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 2 && (
          <div className="px-6 py-3 border-t bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendMessage(question)}
                  className="text-xs hover:bg-[#003781] hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about compliance, audits, or ESG metrics..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-[#003781] hover:bg-[#002557] text-white"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </Card>

      {/* Add custom CSS for slide-down animation and scrollbar */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }

        .custom-chat-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-chat-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }

        .custom-chat-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }

        .custom-chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}
