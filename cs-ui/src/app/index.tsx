import { useState } from 'react';
import Head from 'next/head';

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, subject }),
      });

      const data = await res.json();
      setAnswer(data.answer || 'No answer returned.');
    } catch (err) {
      setAnswer('⚠️ Error fetching answer');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>CS Study Assistant</title>
      </Head>

      <main className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 shadow-xl rounded-xl p-6 w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-4 text-center">🧠 Ask a CS Question</h1>

          <div className="mb-4">
            <label className="font-semibold block mb-1">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white"
            >
              <option value="CN">Computer Networks (CN)</option>
              <option value="OS">Operating Systems (OS)</option>
              <option value="DBMS">Database Management (DBMS)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="font-semibold block mb-1">Your Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white"
              placeholder="e.g., What is TCP 3-way handshake?"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full transition disabled:opacity-50"
          >
            {loading ? 'Thinking...' : 'Get Answer'}
          </button>

          {answer && (
            <div className="mt-6 border-t border-gray-700 pt-4">
              <h2 className="font-bold text-lg mb-2">Answer:</h2>
              <p className="whitespace-pre-wrap">{answer}</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
