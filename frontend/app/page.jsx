"use client";

import Image from 'next/image';
import { useState } from "react";
import Upload from "/components/Upload";
import Output from "/components/Output";
import History from "/components/History";
import { useHistory } from "/lib/history";

export default function Home() {
  const [latexOutput, setLatexOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { entries, addEntry, removeEntry, clearEntries } = useHistory();

  const handleLatexOutput = async (output, file) => {
    try {
      setLatexOutput(output);
      setError(null);
      if (output?.trim()) await addEntry(output, file);
    } catch (err) {
      setError(err.message);
      console.error('Error handling LaTeX output:', err);
    }
  };

  // Bring a past conversion back into the output view
  const handleSelectHistory = (entry) => {
    setLatexOutput(entry.latex);
    setError(null);
    setTimeout(() => {
      document.getElementById("latex-output")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-6 mb-12 mt-8 max-w-5xl">
        <div className="text-5xl md:text-6xl lg:text-7xl text-center font-figtree font-bold text-gray-900 leading-tight">
          Math-to-LaTeX conversion,
        </div>
        <div className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-5xl md:text-6xl lg:text-7xl font-bold font-figtree text-center rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
          in a snap 👇
        </div>
      </div>

      {/* Upload Section */}
      <Upload setLatexOutput={handleLatexOutput} />
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mt-6 font-figtree max-w-lg w-full text-center">
          {error}
        </div>
      )}
      
      {/* Output Display */}
      {latexOutput && (
        <div id="latex-output" className="w-full max-w-2xl scroll-mt-16">
          <Output key={latexOutput} latex={latexOutput} />
        </div>
      )}

      {/* Conversion History */}
      <History
        entries={entries}
        onSelect={handleSelectHistory}
        onDelete={removeEntry}
        onClear={clearEntries}
      />

      {/* How It Works Section */}
      <div className="mt-48 mb-12 w-full max-w-7xl px-4">
        <h2 className="text-4xl font-bold text-center font-figtree text-gray-900">
          How It Works
        </h2>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-4">
          {/* Step 1 */}
          <div className="flex flex-col items-center group">
            <div className="flex items-center justify-center w-[425px] h-[180px]">
              <Image 
                src="/example.png"
                alt="Example Equation"
                width={350}
                height={180}
                className="rounded-lg shadow-md object-contain"
                priority
              />
            </div>
            <div className="bg-blue-500 text-white px-6 py-2.5 rounded-full font-montserrat text-sm">
              1. Original Equation
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center mb-8">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center group">
            <div className="flex items-center justify-center w-[425px] h-[180px]">
              <Image 
                src="/contour.png"
                alt="Contours + OCR"
                width={350}
                height={180}
                className="rounded-lg shadow-md object-contain"
                priority
              />
            </div>
            <div className="bg-blue-500 text-white px-6 py-2.5 rounded-full font-montserrat text-sm">
              2. Processing
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center mb-8">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center group">
            <div className="flex items-center justify-center w-[425px] h-[180px]">
              <Image 
                src="/latex.png"
                alt="LaTeX Code"
                width={500}
                height={180}
                className="rounded-lg shadow-md object-contain"
                priority
              />
            </div>
            <div className="bg-blue-500 text-white px-6 py-2.5 rounded-full font-montserrat text-sm">
              3. LaTeX Output
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
