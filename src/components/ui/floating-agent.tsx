"use client";

import { useState, useRef, useEffect } from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

// Types for the agent configuration
export interface FloatingAgent {
  id: string;
  label: string;
  icon: string;
  prompt: string;
  description?: string;
}

// Modal Component
function Modal({
  open,
  onClose,
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
      <div className={`bg-white border border-literary-sepia/20 rounded-2xl shadow-lg p-0 max-w-5xl w-full mx-4 relative ${className}`}>
        <button
          className="absolute top-4 right-4 text-literary-charcoal/70 hover:text-literary-charcoal text-xl z-10 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-literary-parchment transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-literary-sepia"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

// Chatbot Modal Component
function AgentChatModal({
  open,
  onClose,
  agent,
  contextData,
}: {
  open: boolean;
  onClose: () => void;
  agent: FloatingAgent;
  contextData?: any;
}) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! I'm here to help you explore the data and insights on this page. What would you like to discuss?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, open]);

  // Reset to agent's welcome message when opening or agent changes
  useEffect(() => {
    if (open) {
      setMessages([
        { from: "bot", text: `Hello! I'm here to guide you through ${agent.label.toLowerCase()}. Let's explore this together.` }
      ]);
    }
  }, [agent, open]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input;
    setInput("");
    setMessages((msgs) => [...msgs, { from: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      console.log('🚀 Sending message to agent:', agent.id);
      console.log('📨 Message:', userMessage);
      
      // Create enhanced prompt with context
      const enhancedPrompt = `${agent.prompt}

${contextData ? `\n\nCurrent page context: ${JSON.stringify(contextData, null, 2)}` : ''}

Please respond conversationally and helpfully about the current page content and data.`;

      // Try streaming first, fall back to regular if needed
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          agentId: agent.id,
          systemPrompt: enhancedPrompt,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response not OK:', response.status, errorText);
        throw new Error(`Failed to get response: ${response.status} ${errorText}`);
      }

      // Always check for streaming response
      const isStreaming = response.headers.get('content-type')?.includes('text/event-stream') || 
                         response.headers.get('content-type')?.includes('text/plain');

      if (isStreaming) {
        console.log('🌊 Processing streaming response');
        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let currentMessage = '';

        // Add initial empty message that we'll update
        const messageIndex = messages.length + 1;
        setMessages((msgs) => [
          ...msgs,
          { from: "bot", text: "" }
        ]);

        if (reader) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                console.log('✅ Streaming complete');
                break;
              }

              const chunk = decoder.decode(value, { stream: true });
              console.log('📦 Received chunk:', chunk.slice(0, 100) + '...');
              
              // Handle different streaming formats
              if (chunk.includes('data: ')) {
                // Server-sent events format
                const lines = chunk.split('\n');
                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const dataString = line.slice(6);
                    if (dataString === '[DONE]') continue;
                    
                    try {
                      const data = JSON.parse(dataString);
                      
                      if (data.type === 'text_delta' && data.content) {
                        currentMessage += data.content;
                        setMessages((msgs) => {
                          const newMsgs = [...msgs];
                          if (newMsgs[messageIndex]) {
                            newMsgs[messageIndex] = { from: "bot", text: currentMessage };
                          }
                          return newMsgs;
                        });
                      } else if (data.type === 'text_complete' && data.content) {
                        currentMessage += data.content;
                        setMessages((msgs) => {
                          const newMsgs = [...msgs];
                          if (newMsgs[messageIndex]) {
                            newMsgs[messageIndex] = { from: "bot", text: currentMessage };
                          }
                          return newMsgs;
                        });
                      } else if (data.type === 'done') {
                        break;
                      }
                    } catch (e) {
                      console.warn('⚠️ Failed to parse JSON:', dataString, e);
                    }
                  }
                }
              } else {
                // Direct text streaming
                currentMessage += chunk;
                setMessages((msgs) => {
                  const newMsgs = [...msgs];
                  if (newMsgs[messageIndex]) {
                    newMsgs[messageIndex] = { from: "bot", text: currentMessage };
                  }
                  return newMsgs;
                });
              }
            }
          } catch (streamError) {
            console.error('🌊 Streaming error:', streamError);
            // Fall through to regular response handling
          }
        }
      } else {
        // Handle regular JSON response as fallback
        console.log('📄 Processing regular JSON response');
        const data = await response.json();
        setMessages((msgs) => [
          ...msgs,
          {
            from: "bot",
            text: data.response || "I'm here to help you understand this page better.",
          },
        ]);
      }
    } catch (error) {
      console.error('💥 Chat error:', error);
      
      // Fall back to regular API
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            agentId: agent.id,
            systemPrompt: agent.prompt,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setMessages((msgs) => [
            ...msgs,
            {
              from: "bot",
              text: data.response || "I'm here to help you understand this page better.",
            },
          ]);
        } else {
          throw new Error('Both APIs failed');
        }
      } catch (fallbackError) {
        setMessages((msgs) => [
          ...msgs,
          {
            from: "bot",
            text: "I'm having trouble connecting right now, but I'm here to help. Could you try asking again?",
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} className="p-0">
      <div className="flex flex-col h-[600px] w-full">
        <div className="flex-shrink-0 px-6 py-4 border-b border-literary-sepia/20 flex items-center gap-3 bg-literary-parchment/30">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-literary-sepia/10 border-2 border-literary-sepia/30">
            <img src={agent.icon} alt={agent.label} className="w-8 h-8 object-contain" />
          </div>
          <span className="font-bold text-lg text-literary-sepia font-['Inter']">{agent.label}</span>
          <span className="ml-2 text-sm text-literary-charcoal/70 font-['Inter']">AI Assistant</span>
        </div>
        <div
          ref={chatWindowRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-white"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-xl px-4 py-3 max-w-[75%] text-literary font-['Inter'] ${
                  msg.from === "bot"
                    ? "bg-literary-parchment/40 text-literary-charcoal border border-literary-sepia/20"
                    : "bg-literary-sepia text-white"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-literary-parchment/40 border border-literary-sepia/20 text-literary-charcoal rounded-xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-literary-sepia rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-literary-sepia rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-literary-sepia rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <form
          className="flex gap-3 p-6 border-t border-literary-sepia/20 bg-literary-parchment/20"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            className="flex-1 rounded-lg px-4 py-3 bg-white border border-literary-sepia/30 text-literary-charcoal placeholder:text-literary-charcoal/60 focus:outline-none focus:ring-2 focus:ring-literary-sepia focus:border-literary-sepia disabled:opacity-50 font-['Inter']"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask me about ${agent.label.toLowerCase()}...`}
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-literary-sepia rounded-lg px-6 py-3 text-white font-semibold hover:bg-literary-charcoal transition disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-literary-sepia focus-visible:ring-offset-2 focus-visible:ring-offset-white font-['Inter']"
          >
            {isLoading ? 'Thinking...' : 'Send'}
          </button>
        </form>
      </div>
    </Modal>
  );
}

// Floating Agent Icon Component
function FloatingAgentIcon({
  onOpen,
  agent,
}: {
  onOpen: () => void;
  agent: FloatingAgent;
}) {
  return (
    <div className="relative">
      <button
        aria-label={`Open ${agent.label}`}
        onClick={onOpen}
        className="relative bg-white hover:bg-literary-parchment shadow-2xl rounded-full w-20 h-20 flex items-center justify-center group transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-literary-sepia focus-visible:ring-offset-2 border-4 border-literary-sepia/30"
        style={{
          boxShadow: "0 8px 64px 0 rgba(139, 69, 19, 0.20)",
        }}
      >
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          variant="purple"
          blur={0}
          borderWidth={2}
        />
        <img
          src={agent.icon}
          alt={agent.label}
          className="relative z-10 w-16 h-16 object-contain rounded-full"
          width={64}
          height={64}
        />
        <span className="absolute bottom-[-32px] left-1/2 -translate-x-1/2 bg-literary-charcoal text-white px-4 py-2 text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all font-['Inter'] font-medium whitespace-nowrap shadow-lg">
          {agent.label}
        </span>
      </button>
    </div>
  );
}

// Main Floating Agent Component
export default function FloatingAgent({
  agent,
  contextData,
  position = "bottom-right",
}: {
  agent: FloatingAgent;
  contextData?: any;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}) {
  const [chatOpen, setChatOpen] = useState(false);

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  return (
    <>
      {/* Floating Agent Icon */}
      <div className={`fixed ${positionClasses[position]} z-40`}>
        <FloatingAgentIcon 
          agent={agent}
          onOpen={() => setChatOpen(true)}
        />
      </div>

      {/* Chat Modal */}
      <AgentChatModal 
        open={chatOpen} 
        onClose={() => setChatOpen(false)} 
        agent={agent}
        contextData={contextData}
      />
    </>
  );
}
