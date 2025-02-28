import React, { useState, useRef } from "react";
import { FileText, Lock, Hash, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import PrintingInterface from "./Printlayout";

const LatestPdfViewer = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  // Reference for the printable content
  const printableRef = useRef();

  // Handle print functionality
  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
    documentTitle: "Printed Document",
    onAfterPrint: () => alert("Print successful!"),
  });

  const fetchPdf = async () => {
    if (!number || !password) {
      setError("Please enter both serial number and password.");
      setPdfUrl("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `http://localhost:5000/getpdf/${number}/${password}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

      setPdfUrl(data.pdfUrl);
      setError("");
    } catch (err) {
      console.error("Error fetching PDF:", err);
      setError(err.message || "Failed to fetch PDF. Please try again.");
      setPdfUrl("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className=" mx-auto space-y-6">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Latest PDF Viewer
          </h1>

          <div className="space-y-4">
            {/* Serial Number Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serial Number
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  className="pl-10 w-full rounded-lg border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter serial number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  aria-label="Serial Number"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  className="pl-10 w-full rounded-lg border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label="Password"
                />
              </div>
            </div>

            {/* View PDF Button */}
            <button
              onClick={fetchPdf}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="View PDF"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                "View PDF"
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div
                className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
                role="alert"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* PDF Preview and Print Interface */}
        {pdfUrl && (
          <div className="bg-white rounded-lg shadow-sm">
            {/* Printable Content */}
            <div ref={printableRef}>
              <PrintingInterface pdfUrl={pdfUrl} />
            </div>

            
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestPdfViewer;