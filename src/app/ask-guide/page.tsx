'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type DepthMode = 'plain' | 'technical' | null;

// Lightweight markdown renderer — handles bold, italic, bullets, line breaks
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let keyCounter = 0;

  const renderInline = (line: string): React.ReactNode[] => {
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  let inList = false;
  const listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={keyCounter++} className="my-2 space-y-1">
          {listItems.splice(0)}
        </ul>
      );
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isBullet = /^[-•]\s/.test(line);
    const headerMatch = /^(#{1,4})\s+(.*)$/.exec(line);

    if (headerMatch) {
      if (inList) flushList();
      const level = headerMatch[1].length;
      const text = headerMatch[2];
      const sizeClass =
        level <= 2 ? 'text-base font-semibold' : 'text-sm font-semibold';
      elements.push(
        <p key={keyCounter++} className={`${sizeClass} mt-3 mb-1 text-ink`}>
          {renderInline(text)}
        </p>
      );
    } else if (isBullet) {
      inList = true;
      listItems.push(
        <li key={keyCounter++} className="flex gap-2">
          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-500 flex-shrink-0" />
          <span>{renderInline(line.replace(/^[-•]\s/, ''))}</span>
        </li>
      );
    } else {
      if (inList) flushList();
      if (line.trim() === '') {
        elements.push(<div key={keyCounter++} className="h-2" />);
      } else {
        elements.push(
          <p key={keyCounter++} className="leading-relaxed">
            {renderInline(line)}
          </p>
        );
      }
    }
  }

  if (inList) flushList();
  return <div className="space-y-1">{elements}</div>;
}

export default function AskGuidePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [depthMode, setDepthMode] = useState<DepthMode>(null);
  const [showDepthPrompt, setShowDepthPrompt] = useState(true);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [showUploadConsent, setShowUploadConsent] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Pick up any question typed on the homepage hero
  useEffect(() => {
    const stored = sessionStorage.getItem('guide_initial_question');
    if (stored) {
      setPendingQuestion(stored);
      sessionStorage.removeItem('guide_initial_question');
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const selectDepth = async (mode: DepthMode) => {
    setDepthMode(mode);
    setShowDepthPrompt(false);

    const depthLabel =
      mode === 'plain' ? 'plain-English guidance' : 'full technical and regulatory detail';

    // If there's a pending question from the homepage, send it automatically
    if (pendingQuestion) {
      const welcomeMsg: Message = {
        role: 'assistant',
        content: `Got it — I'll give you ${depthLabel}.`,
      };
      const userMsg: Message = { role: 'user', content: pendingQuestion };
      setMessages([welcomeMsg, userMsg]);
      setPendingQuestion(null);
      setLoading(true);

      try {
        const res = await fetch('/api/guide', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              {
                role: 'user',
                content: `[Visitor depth preference: ${mode === 'plain' ? 'plain English' : 'technical/professional detail'}]\n\n${pendingQuestion}`,
              },
            ],
          }),
        });
        const data = await res.json();
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message || 'Sorry, something went wrong. Please try again.',
        };
        setMessages([welcomeMsg, userMsg, assistantMessage]);
      } catch {
        setMessages([
          welcomeMsg,
          userMsg,
          { role: 'assistant', content: 'Sorry, I ran into a problem. Please try again.' },
        ]);
      } finally {
        setLoading(false);
      }
    } else {
      // No pending question — just show the welcome and wait
      setMessages([
        {
          role: 'assistant',
          content: `Got it — I'll give you ${depthLabel}. What compliance question can I help you with today? Feel free to tell me a bit about your premises or business too — it helps me give you the most relevant answer. You can also upload a compliance document — a risk assessment, EICR, PAT report, service record, asbestos register, and more (the 📎 button) — and I’ll review it against what a good one should contain.`,
        },
      ]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (e.target) e.target.value = ''; // reset so same file can be re-picked
    if (!file) return;

    setUploadError(null);

    if (file.type !== 'application/pdf') {
      setUploadError('Please upload a PDF. Other formats aren’t supported yet.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('That file is over 15MB. Please upload a smaller PDF.');
      return;
    }

    setLoading(true);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = () => reject(new Error('read failed'));
        reader.readAsDataURL(file);
      });

      const visibleUserMsg: Message = {
        role: 'user',
        content: `📄 Uploaded "${file.name}" for review.`,
      };
      const updatedMessages = [...messages, visibleUserMsg];
      setMessages(updatedMessages);

      // Build the API payload: prior text turns + this turn with a document block
      const apiHistory = updatedMessages.slice(0, -1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const depthTag =
        depthMode === 'plain'
          ? 'plain English'
          : depthMode === 'technical'
            ? 'technical/professional detail'
            : 'plain English';

      const documentTurn = {
        role: 'user' as const,
        content: [
          {
            type: 'document',
            source: { type: 'base64', media_type: 'application/pdf', data: base64 },
          },
          {
            type: 'text',
            text: `[Visitor depth preference: ${depthTag}]\n\nI've uploaded one of my compliance documents. Please identify what type it is and confirm with me, then give me your general observations using your document review method — work through what a good one should contain (what looks present, thin, or missing), ask me the relevant currency questions, and tell me if a professional review looks worth considering. Remember this is general guidance, not a compliance verdict.`,
          },
        ],
      };

      const res = await fetch('/api/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...apiHistory, documentTurn] }),
      });
      const data = await res.json();
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: data.message || 'Sorry, I couldn’t read that document. Please try again.',
        },
      ]);
    } catch {
      setMessages([
        ...messages,
        { role: 'user', content: `📄 Uploaded "${file.name}" for review.` },
        { role: 'assistant', content: 'Sorry, I ran into a problem reading that file. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const messagesWithDepth = updatedMessages.map((m, i) => {
        if (m.role === 'user' && i === updatedMessages.length - 1) {
          return {
            ...m,
            content: `[Visitor depth preference: ${depthMode === 'plain' ? 'plain English' : 'technical/professional detail'}]\n\n${m.content}`,
          };
        }
        return m;
      });

      const res = await fetch('/api/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesWithDepth }),
      });

      const data = await res.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message || 'Sorry, something went wrong. Please try again.',
      };
      setMessages([...updatedMessages, assistantMessage]);
    } catch {
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: 'Sorry, I ran into a problem. Please try again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← ComplianceBuyer
            </a>
          </div>
          <div className="text-center">
            <span className="text-lg font-semibold text-gray-900">The Guide</span>
            <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              Compliance Buyer Assistant
            </span>
          </div>
          {depthMode && (
            <div className="text-xs text-gray-400">
              {depthMode === 'plain' ? 'Plain English' : 'Technical'}
            </div>
          )}
        </div>
      </header>

      {/* Depth selection */}
      {showDepthPrompt && (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-lg w-full text-center">
            <div className="mb-6">
              <div className="w-12 h-12 bg-ink rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Tell me what your business needs
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Compliance Buyer's compliance assistant. I can answer questions
                across fire safety, asbestos, electrical, gas, legionella, and more —
                drawing from Compliance Buyer's plain-English guidance first. Tell me about your business and I'll help you work out what you actually need.
              </p>
            </div>

            {/* Show the pending question so visitor can see it's been captured */}
            {pendingQuestion && (
              <div className="mb-5 bg-cloud border border-line rounded-xl px-4 py-3 text-sm text-ink">
                <span className="font-medium">Your question:</span> "{pendingQuestion}"
              </div>
            )}

            <p className="text-gray-700 font-medium mb-4">
              {pendingQuestion
                ? 'Before I answer — how would you like me to respond?'
                : 'To give you the most useful answer — would you prefer:'}
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={() => selectDepth('plain')}
                className="p-4 border-2 border-gray-200 rounded-xl text-left hover:border-signal hover:bg-cloud transition-colors group"
              >
                <div className="font-medium text-gray-900 mb-1 group-hover:text-ink">
                  Plain English
                </div>
                <div className="text-sm text-gray-500">
                  Clear, straightforward guidance without heavy regulatory language
                </div>
              </button>

              <button
                onClick={() => selectDepth('technical')}
                className="p-4 border-2 border-gray-200 rounded-xl text-left hover:border-signal hover:bg-cloud transition-colors group"
              >
                <div className="font-medium text-gray-900 mb-1 group-hover:text-ink">
                  Technical detail
                </div>
                <div className="text-sm text-gray-500">
                  Full regulatory framework, standards references, and enforcement context
                </div>
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-6">
              The Guide helps you understand your obligations and judge your own risk. For specific legal or safety situations,
              always consult a qualified professional.
            </p>
          </div>
        </div>
      )}

      {/* Conversation */}
      {!showDepthPrompt && (
        <>
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 bg-ink rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'user'
                        ? 'bg-ink text-white rounded-br-sm leading-relaxed'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    {msg.role === 'assistant'
                      ? renderMarkdown(msg.content)
                      : msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 bg-ink rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 bg-white">
            <div className="max-w-3xl mx-auto px-4 py-4">
              {uploadError && (
                <p className="text-xs mb-2 text-center" style={{ color: '#A32D2D' }}>{uploadError}</p>
              )}
              <div className="flex gap-3 items-end">
                <button
                  onClick={() => { setUploadError(null); setShowUploadConsent(true); }}
                  disabled={loading}
                  aria-label="Upload a risk assessment for review"
                  title="Upload a compliance document for review (FRA, EICR, LRA, PAT, service records…)"
                  className="w-10 h-10 border border-gray-300 text-gray-600 rounded-xl flex items-center justify-center hover:border-signal hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelected}
                  className="hidden"
                />
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a compliance question..."
                  rows={1}
                  className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-signal focus:border-transparent max-h-32 overflow-y-auto"
                  style={{ minHeight: '48px' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 bg-ink text-white rounded-xl flex items-center justify-center hover:bg-ink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                The Guide helps you understand your obligations and judge your own risk — your business, your risk, your decision. For specific legal or safety decisions, consult a qualified professional.
              </p>
            </div>
          </div>

          {/* Upload consent modal */}
          {showUploadConsent && (
            <div style={{ minHeight: '100vh', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute', inset: 0, background: 'rgba(15,26,46,0.55)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50,
                }}
                onClick={() => setShowUploadConsent(false)}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{ background: '#fff', borderRadius: '14px', maxWidth: '32rem', width: '100%', padding: '1.75rem' }}
                >
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 700, color: 'var(--cb-ink)', margin: '0 0 12px' }}>
                    Before you upload your document
                  </h3>
                  <ul style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.6, color: 'var(--cb-slate)', paddingLeft: '1.1rem', margin: '0 0 16px' }}>
                    <li style={{ marginBottom: '8px' }}>
                      The Guide will give you <strong style={{ color: 'var(--cb-ink)' }}>general observations</strong> on your document — what a good assessment should contain and how yours compares. This is <strong style={{ color: 'var(--cb-ink)' }}>not a compliance audit, verdict, or formal review</strong>, and an AI can miss or misread things.
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      Compliance Buyer <strong style={{ color: 'var(--cb-ink)' }}>does not store your document</strong>. It is sent to our AI provider to generate this one response and is not retained by us afterwards. It is gone once you close this chat — nothing is saved.
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      Please <strong style={{ color: 'var(--cb-ink)' }}>avoid uploading documents containing personal data</strong> you don’t need reviewed (names, contact details). Redact anything sensitive first.
                    </li>
                    <li>
                      The decision on how to act on anything raised stays with you — your business, your risk, your decision. For anything with real consequence, have your assessment reviewed by a qualified competent person.
                    </li>
                  </ul>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setShowUploadConsent(false)}
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 600, color: 'var(--cb-slate)', background: 'transparent', border: '1px solid var(--cb-line)', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { setShowUploadConsent(false); fileInputRef.current?.click(); }}
                      className="cb-btn-primary"
                      style={{ fontSize: '14px' }}
                    >
                      I understand — choose file
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
