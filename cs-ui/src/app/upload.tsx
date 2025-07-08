'use client';

import { useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subject, setSubject] = useState('CN');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setStatus('Please select a PDF file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject', subject);

    setLoading(true);
    setStatus('');

    try {
      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setStatus(data.message || 'Upload successful.');
    } catch (err) {
      console.error(err);
      setStatus('Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Upload - Querion</title>
      </Head>

      <main className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl bg-gray-900 rounded-2xl shadow-xl p-6 space-y-5">
          <h1 className="text-3xl font-bold text-center">Upload Subject Material</h1>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-white"
            >
              <option value="CN">Computer Networks</option>
              <option value="OS">Operating Systems</option>
              <option value="DBMS">Database Management Systems</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">PDF File</label>
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-white"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50 transition"
          >
            {loading ? 'Uploading...' : 'Upload & Index'}
          </button>

          {status && (
            <p className="text-sm text-center text-gray-300 mt-4">{status}</p>
          )}

          <div className="text-center mt-4">
            <Link href="/" className="text-blue-400 hover:underline text-sm">
              ← Back to Query Page
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
