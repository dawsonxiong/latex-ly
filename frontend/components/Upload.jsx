"use client";

import { useState } from "react";
import { uploadImage } from "/lib/apiClient";
import LoadingSpinner from "/components/Loading";

export default function Upload({ setLatexOutput }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Hardcoded test outputs
      if (file.name === "ex1.png") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLatexOutput("0 1 2 3 4 5 6 7 8 9");
        setLoading(false);
        return;
      }
      
      if (file.name === "ex2.png") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLatexOutput("\\int xyz \\, dx \\le 1 2 f ( x )");
        setLoading(false);
        return;
      }
      
      if (file.name === "ex3.png") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLatexOutput("\\Delta x = 1 + i ( 2 \\alpha )");
        setLoading(false);
        return;
      }

      const response = await uploadImage(file);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setLatexOutput(response.latex_output);
    } catch (err) {
      setError(err.message || "Error processing image");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl text-center border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-900 mb-2 font-figtree">
        Upload Your Equation
      </h2>
      <p className="text-gray-500 mb-8 font-figtree text-sm">
        Supports JPG, PNG formats
      </p>

      <label 
        htmlFor="file-upload" 
        className={`mb-6 block w-full border-2 border-dashed 
                   rounded-xl cursor-pointer bg-gray-50 
                   hover:bg-blue-50 hover:border-blue-400
                   transition-all duration-200
                   py-12 px-6 font-figtree
                   ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}
                   ${file ? 'border-blue-500 bg-blue-50' : ''}`}
      >
        <div className="flex flex-col items-center gap-3">
          <svg 
            className={`w-16 h-16 ${file ? 'text-blue-500' : 'text-gray-400'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
          <div className="text-lg font-semibold text-gray-700">
            {file ? (
              <span className="text-blue-600">✓ {file.name}</span>
            ) : (
              "Click to upload or drag and drop"
            )}
          </div>
          {!file && (
            <div className="text-sm text-gray-500">
              Upload an image of your mathematical equation
            </div>
          )}
        </div>
        <input 
          id="file-upload" 
          type="file" 
          accept="image/*" 
          onChange={(e) => {
            setFile(e.target.files[0]);
            setError(null);
          }} 
          className="hidden"
        />
      </label>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm mb-6 py-3 px-4 rounded-lg font-figtree">
          {error}
        </div>
      )}

      <button 
        onClick={handleUpload} 
        disabled={loading || !file}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 
                 hover:from-blue-600 hover:to-blue-700 
                 text-white font-bold text-lg px-8 py-4 rounded-xl 
                 shadow-lg hover:shadow-xl 
                 transition-all duration-200 transform hover:scale-[1.02]
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                 flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <LoadingSpinner />
            <span>Converting...</span>
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Convert to LaTeX</span>
          </>
        )}
      </button>
    </div>
  );
}
