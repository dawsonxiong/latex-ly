"use client";

import { useState } from "react";

export default function Output({ latex }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(latex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white p-8 mt-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-figtree text-gray-900">
          Generated LaTeX
        </h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* LaTeX Code */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 mb-6">
        <pre className="text-gray-800 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-words">
          {latex}
        </pre>
      </div>

      {/* Rendered Preview */}
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-2xl font-bold font-figtree text-gray-900 mb-4">
          Rendered Preview
        </h2>
        <div className="bg-white p-8 rounded-xl border-2 border-blue-100 flex items-center justify-center min-h-[100px]">
          <img 
            src={`https://latex.codecogs.com/png.latex?\\dpi{150}\\bg_white ${encodeURIComponent(latex)}`}
            alt="Rendered LaTeX"
            className="max-w-full"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="text-gray-500 text-sm hidden">
            Unable to render preview
          </div>
        </div>
      </div>
    </div>
  );
}
  