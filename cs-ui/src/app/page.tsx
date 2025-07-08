'use client';

import { useState } from 'react';
import { BookOpen, Brain, Sparkles, Send, Loader2, Network, Database, Monitor } from 'lucide-react';

export default function Home() {
  const [subject, setSubject] = useState('CN');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer('');

    try {
      const res = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, subject }),
      });

      const data = await res.json();
      setAnswer(data.answer || 'No answer returned.');
    } catch (err) {
      setAnswer('Error fetching answer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const subjects = [
    { value: 'CN', label: 'Computer Networks', icon: Network, color: 'from-blue-600 to-indigo-700' },
    { value: 'OS', label: 'Operating Systems', icon: Monitor, color: 'from-indigo-600 to-purple-700' },
    { value: 'DBMS', label: 'Database Management', icon: Database, color: 'from-purple-600 to-blue-700' }
  ];

  const selectedSubject = subjects.find(s => s.value === subject);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Enhanced Light Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary glow orbs */}
        <div className="absolute -top-1/3 -left-1/3 w-96 h-96 bg-gradient-radial from-blue-400/8 via-blue-500/4 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-1/3 -right-1/3 w-96 h-96 bg-gradient-radial from-indigo-400/8 via-purple-500/4 to-transparent rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        
        {/* Floating light particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-float-particle"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-indigo-400 rounded-full opacity-40 animate-float-particle delay-500"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-50 animate-float-particle delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-cyan-400 rounded-full opacity-30 animate-float-particle delay-1500"></div>
        
        {/* Scanning light beams */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-scan-vertical"></div>
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent animate-scan-horizontal"></div>
        
        {/* Grid with light traces */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
        
        {/* Subtle glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 via-transparent to-indigo-950/30"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse-glow"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full blur-md animate-pulse-glow delay-500"></div>
                <div className="relative p-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 shadow-2xl shadow-blue-500/30 border border-blue-400/20">
                  <Brain className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-light bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent mb-4 tracking-wider">
              Querion
            </h1>
            <p className="text-blue-200/70 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-light">
              Ask. Understand. Master Core CS.
            </p>
          </div>

          {/* Main Interface */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Input Panel */}
            <div className="group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-3xl blur animate-pulse-subtle"></div>
                <div className="relative bg-slate-950/80 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/10 shadow-2xl shadow-blue-500/5">
                  <div className="flex items-center mb-8">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 mr-4 border border-blue-400/20">
                      <BookOpen className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-light text-white tracking-wide">Ask Your Question</h2>
                  </div>

                  <div className="space-y-8">
                    {/* Subject Selection */}
                    <div>
                      <label className="block text-xs font-normal text-blue-200/80 mb-4 tracking-widest uppercase">
                        Choose Subject
                      </label>
                      <div className="grid gap-3">
                        {subjects.map((subj) => {
                          const IconComponent = subj.icon;
                          return (
                            <button
                              key={subj.value}
                              onClick={() => setSubject(subj.value)}
                              className={`group relative flex items-center p-4 rounded-xl border transition-all duration-300 ${
                                subject === subj.value
                                  ? 'bg-gradient-to-r from-blue-600/15 to-indigo-600/15 border-blue-400/30 shadow-lg shadow-blue-500/10 scale-[1.02]'
                                  : 'bg-slate-900/30 border-slate-700/20 hover:border-blue-400/20 hover:bg-slate-900/50 hover:scale-[1.01]'
                              }`}
                            >
                              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${subj.color} opacity-0 ${
                                subject === subj.value ? 'opacity-5' : 'group-hover:opacity-5'
                              } transition-opacity duration-300`}></div>
                              <div className={`relative p-2 rounded-lg bg-gradient-to-r ${subj.color} mr-4 shadow-lg opacity-80`}>
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                              <span className="relative text-white font-light text-left flex-1">{subj.label}</span>
                              {subject === subj.value && (
                                <div className="relative flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                  <div className="w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-100"></div>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Question Input */}
                    <div>
                      <label className="block text-xs font-normal text-blue-200/80 mb-4 tracking-widest uppercase">
                        Your Question
                      </label>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-300"></div>
                        <textarea
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          rows={6}
                          placeholder="e.g., What is virtual memory and how does it work in operating systems?"
                          className="relative w-full bg-slate-900/40 backdrop-blur-sm border border-slate-700/30 rounded-xl px-5 py-4 text-white placeholder-slate-400/70 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-400/30 transition-all duration-300 resize-none text-sm leading-relaxed font-light"
                        />
                        <div className="absolute bottom-4 right-4 opacity-20 group-focus-within:opacity-40 transition-opacity duration-300">
                          <Sparkles className="w-5 h-5 text-blue-400" />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !question.trim()}
                      className="w-full bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-700 disabled:to-slate-800 text-white font-light py-4 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] flex items-center justify-center group relative overflow-hidden border border-blue-500/20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/3 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          <span className="font-light tracking-wide">Analyzing Question...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
                          <span className="font-light tracking-wide">Get Answer</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Output Panel */}
            <div className="group">
              <div className="relative h-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400/10 to-cyan-400/10 rounded-3xl blur animate-pulse-subtle delay-500"></div>
                <div className="relative bg-slate-950/80 backdrop-blur-xl rounded-3xl p-8 border border-indigo-500/10 h-full flex flex-col min-h-[600px] shadow-2xl shadow-indigo-500/5">
                  <div className="flex items-center mb-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-lg mr-4 flex items-center justify-center shadow-lg border border-indigo-400/20">
                      {selectedSubject && <selectedSubject.icon className="w-4 h-4 text-white" />}
                    </div>
                    <h2 className="text-2xl font-light text-white tracking-wide">Answer</h2>
                    {subject && (
                      <span className="ml-auto text-xs font-normal text-blue-300/80 bg-blue-600/10 px-3 py-1 rounded-full border border-blue-500/20">
                        {selectedSubject?.label}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 relative">
                    <div className="h-full bg-slate-900/20 backdrop-blur-sm border border-slate-700/20 rounded-xl p-6 overflow-y-auto max-h-[500px] lg:max-h-[600px] custom-scrollbar">
                      {loading ? (
                        <div className="flex items-center justify-center h-full min-h-[300px]">
                          <div className="text-center">
                            <div className="relative mb-6">
                              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400/60"></div>
                              <div className="absolute inset-0 rounded-full border-2 border-blue-400/10"></div>
                              <div className="absolute inset-2 rounded-full bg-blue-400/5 animate-pulse"></div>
                            </div>
                            <p className="text-blue-200/80 text-lg font-light animate-pulse">Generating your answer...</p>
                            <p className="text-blue-300/50 text-sm mt-2 font-light">This may take a few moments</p>
                          </div>
                        </div>
                      ) : answer ? (
                        <div className="prose prose-invert max-w-none">
                          <div className="text-slate-100/90 leading-relaxed whitespace-pre-wrap break-words text-sm font-light">
                            {answer}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full min-h-[300px]">
                          <div className="text-center">
                            <div className="relative mb-6">
                              <div className="w-20 h-20 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
                                <Brain className="w-10 h-10 text-blue-400/60" />
                              </div>
                              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-full blur-xl animate-pulse-subtle"></div>
                            </div>
                            <p className="text-slate-300/90 text-xl font-light mb-2">Ready to Help</p>
                            <p className="text-slate-400/70 text-sm font-light">Ask a question to get started with your CS studies</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.6; }
          25% { transform: translateY(-20px) translateX(10px) scale(1.1); opacity: 0.8; }
          50% { transform: translateY(-10px) translateX(-5px) scale(0.9); opacity: 0.4; }
          75% { transform: translateY(-25px) translateX(15px) scale(1.2); opacity: 0.7; }
        }
        
        @keyframes scan-vertical {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100vw); opacity: 0; }
        }
        
        @keyframes scan-horizontal {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        
        @keyframes pulse-subtle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        .animate-float-particle {
          animation: float-particle 8s ease-in-out infinite;
        }
        
        .animate-scan-vertical {
          animation: scan-vertical 15s linear infinite;
        }
        
        .animate-scan-horizontal {
          animation: scan-horizontal 20s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 6s ease-in-out infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </main>
  );
}