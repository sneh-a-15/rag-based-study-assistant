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
    { value: 'CN', label: 'Computer Networks', icon: Network, color: 'from-blue-500 to-cyan-500' },
    { value: 'OS', label: 'Operating Systems', icon: Monitor, color: 'from-blue-600 to-indigo-600' },
    { value: 'DBMS', label: 'Database Management', icon: Database, color: 'from-indigo-500 to-purple-500' }
  ];

  const selectedSubject = subjects.find(s => s.value === subject);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-indigo-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-cyan-400/5 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-blue-400/5 rounded-full blur-xl animate-float delay-500"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative p-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-2xl shadow-blue-500/25">
                  <Brain className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent mb-4 tracking-tight">
              CS Study Assistant
            </h1>
            <p className="text-blue-200/80 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              Get instant, comprehensive answers to your computer science questions with AI-powered assistance
            </p>
          </div>

          {/* Main Interface */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Input Panel */}
            <div className="group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/20 shadow-2xl shadow-blue-500/10">
                  <div className="flex items-center mb-8">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 mr-4">
                      <BookOpen className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Ask Your Question</h2>
                  </div>

                  <div className="space-y-8">
                    {/* Subject Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-200 mb-4 tracking-wide uppercase">
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
                                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-400/50 shadow-lg shadow-blue-500/20 scale-[1.02]'
                                  : 'bg-slate-800/50 border-slate-600/30 hover:border-blue-400/30 hover:bg-slate-800/70 hover:scale-[1.01]'
                              }`}
                            >
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${subj.color} mr-4 shadow-lg`}>
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-white font-semibold text-left flex-1">{subj.label}</span>
                              {subject === subj.value && (
                                <div className="flex items-center space-x-2">
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
                      <label className="block text-sm font-semibold text-blue-200 mb-4 tracking-wide uppercase">
                        Your Question
                      </label>
                      <div className="relative">
                        <textarea
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          rows={6}
                          placeholder="e.g., What is virtual memory and how does it work in operating systems?"
                          className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl px-5 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300 resize-none text-sm leading-relaxed"
                        />
                        <div className="absolute bottom-4 right-4 opacity-30">
                          <Sparkles className="w-5 h-5 text-blue-400" />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !question.trim()}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] flex items-center justify-center group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          <span className="font-semibold">Analyzing Question...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
                          <span className="font-semibold">Get Answer</span>
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
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-indigo-500/20 h-full flex flex-col min-h-[600px] shadow-2xl shadow-indigo-500/10">
                  <div className="flex items-center mb-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-lg mr-4 flex items-center justify-center">
                      {selectedSubject && <selectedSubject.icon className="w-4 h-4 text-white" />}
                    </div>
                    <h2 className="text-2xl font-bold text-white">Answer</h2>
                    {subject && (
                      <span className="ml-auto text-sm text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">
                        {selectedSubject?.label}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 relative">
                    <div className="h-full bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6 overflow-y-auto max-h-[500px] lg:max-h-[600px] custom-scrollbar">
                      {loading ? (
                        <div className="flex items-center justify-center h-full min-h-[300px]">
                          <div className="text-center">
                            <div className="relative mb-6">
                              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                              <div className="absolute inset-0 rounded-full border-2 border-blue-400/20"></div>
                            </div>
                            <p className="text-blue-200 text-lg font-medium animate-pulse">Generating your answer...</p>
                            <p className="text-blue-300/60 text-sm mt-2">This may take a few moments</p>
                          </div>
                        </div>
                      ) : answer ? (
                        <div className="prose prose-invert max-w-none">
                          <div className="text-slate-100 leading-relaxed whitespace-pre-wrap break-words text-sm">
                            {answer}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full min-h-[300px]">
                          <div className="text-center">
                            <div className="relative mb-6">
                              <div className="w-20 h-20 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
                                <Brain className="w-10 h-10 text-blue-400/60" />
                              </div>
                              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-full blur-xl"></div>
                            </div>
                            <p className="text-slate-300 text-xl font-semibold mb-2">Ready to Help</p>
                            <p className="text-slate-400 text-sm">Ask a question to get started with your CS studies</p>
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
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </main>
  );
}