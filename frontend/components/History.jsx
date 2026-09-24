"use client";

import { useState } from "react";

export default function History({ entries, onSelect, onDelete, onClear }) {
  const [copiedId, setCopiedId] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleCopy = async (entry) => {
    try {
      await navigator.clipboard.writeText(entry.latex);
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId((id) => (id === entry.id ? null : id)), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClear = () => {
    if (confirmClear) {
      onClear();
      setConfirmClear(false);
      return;
    }
    setConfirmClear(true);
    setTimeout(() => setConfirmClear(false), 3000);
  };

  if (!entries.length) return null;

  return (
    <div id="history" className="bg-white p-8 mt-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold font-figtree text-gray-900">
          History
        </h2>
        <button
          onClick={handleClear}
          className={`text-sm font-semibold font-figtree px-3 py-1.5 rounded-lg transition-colors duration-200
                     ${confirmClear ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
        >
          {confirmClear ? 'Click again to clear' : 'Clear all'}
        </button>
      </div>

      <ul className="divide-y divide-gray-100">
        {entries.map((entry) => {
          const date = new Date(entry.createdAt);
          return (
            <li key={entry.id} className="flex items-center gap-4 py-4">
              {/* Thumbnail */}
              <div className="w-28 h-14 flex-shrink-0 flex items-center justify-center bg-white rounded-lg border border-gray-200 overflow-hidden">
                {entry.thumbnail ? (
                  <img src={entry.thumbnail} alt="Uploaded equation" className="max-w-full max-h-full object-contain" />
                ) : (
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>

              {/* LaTeX, time and actions */}
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm text-gray-800 truncate" title={entry.latex}>
                  {entry.latex}
                </p>
                <time dateTime={date.toISOString()} className="block text-xs text-gray-500 font-figtree mt-1">
                  {date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                </time>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm font-semibold font-figtree">
                  <button onClick={() => onSelect(entry)} className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                    Show
                  </button>
                  <button onClick={() => handleCopy(entry)} className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                    {copiedId === entry.id ? 'Copied!' : 'Copy'}
                  </button>
                  <button onClick={() => onDelete(entry.id)} className="text-gray-500 hover:text-red-600 transition-colors duration-200">
                    Delete
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
