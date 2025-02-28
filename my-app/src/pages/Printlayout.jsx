import React, { useState, useEffect, useRef, useCallback } from "react";
import { Printer, FileText, CreditCard } from "lucide-react";
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PrintingInterface = ({ pdfUrl }) => {
  const [copies, setCopies] = useState(1);
  const [orientation, setOrientation] = useState("portrait");
  const [selectedPages, setSelectedPages] = useState("all");
  const [customPageRange, setCustomPageRange] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [colorMode, setColorMode] = useState("bw");
  const [sidedMode, setSidedMode] = useState("single");
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [pdfDoc, setPdfDoc] = useState(null);
  const canvasRef = useRef(null);
  
  const pricePerPage = colorMode === "bw" ? 2 : 10;

  // Function to render PDF page - memoized with useCallback
  const renderPage = useCallback(async (pageNum) => {
    if (pdfDoc && canvasRef.current) {
      try {
        const page = await pdfDoc.getPage(pageNum);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Clear any previous content
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Get the viewport based on scale and rotation
        const viewport = page.getViewport({ scale, rotation: 0 });
        
        // Set canvas dimensions to match viewport
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Set CSS style to ensure no unwanted transformations
        canvas.style.transform = 'none';

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        await page.render(renderContext).promise;
      } catch (error) {
        console.error('Error rendering page:', error);
      }
    }
  }, [pdfDoc, scale]);

  // Function to load PDF
  const loadPDF = async () => {
    try {
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading PDF:", error);
      setTotalPages(0);
    }
  };

  // Load PDF when URL changes
  useEffect(() => {
    loadPDF();
  }, [pdfUrl]);

  // Render page when current page, PDF doc, or scale changes
  useEffect(() => {
    if (currentPage) {
      renderPage(currentPage);
    }
  }, [currentPage, pdfDoc, scale, renderPage]);

  // Add an effect to ensure proper initial rendering
  useEffect(() => {
    let mounted = true;
    
    const initRender = async () => {
      if (pdfDoc && mounted && currentPage) {
        // Small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        await renderPage(currentPage);
      }
    };
    
    initRender();
    
    return () => {
      mounted = false;
    };
  }, [pdfDoc, currentPage, renderPage]);

  // Add an effect to handle window resizing
  useEffect(() => {
    const handleResize = () => {
      if (currentPage) {
        renderPage(currentPage);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [currentPage, renderPage]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const calculatePageCount = () => {
    if (selectedPages === "custom") {
      try {
        const pages = new Set();
        const ranges = customPageRange.split(",");
        
        ranges.forEach((range) => {
          range = range.trim();
          if (range.includes("-")) {
            const [start, end] = range.split("-").map(Number);
            if (!isNaN(start) && !isNaN(end) && start <= end) {
              for (let i = start; i <= Math.min(end, totalPages); i++) {
                pages.add(i);
              }
            }
          } else {
            const page = Number(range);
            if (!isNaN(page) && page <= totalPages) {
              pages.add(page);
            }
          }
        });
        
        return pages.size;
      } catch (error) {
        return 0;
      }
    } else if (selectedPages === "odd") {
      return Math.ceil(totalPages / 2);
    } else if (selectedPages === "even") {
      return Math.floor(totalPages / 2);
    }
    return totalPages;
  };

  const calculateTotal = () => {
    const pageCount = calculatePageCount();
    let totalPrice = 0;

    if (colorMode === "bw") {
      if (sidedMode === "double") {
        totalPrice = pageCount * 1.5 * copies;
      } else {
        totalPrice = pageCount * 2 * copies;
      }
    } else {
      if (sidedMode === "double") {
        totalPrice = pageCount * 7 * copies;
      } else {
        totalPrice = pageCount * 10 * copies;
      }
    }

    return totalPrice;
  };

  const handlePrint = async () => {
    const printData = {
      pdfUrl,
      copies,
      orientation,
      colorMode,
      sidedMode,
      selectedPages,
      customPageRange: selectedPages === "custom" ? customPageRange : null,
    };
  
    try {
      const response = await fetch("http://localhost:5000/print", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(printData),
      });
  
      const result = await response.json();
      if (result.success) {
        alert("Printing started successfully!");
      } else {
        alert("Printing failed: " + result.error);
      }
    } catch (error) {
      console.error("Error sending print request:", error);
      alert("Printing failed. Please try again.");
    }
  };

  const handleSave = async () => {
    const printData = {
      pdfUrl,
      copies,
      orientation,
      colorMode,
      sidedMode,
      selectedPages,
      customPageRange: selectedPages === "custom" ? customPageRange : null,
    };
  
    try {
      const response = await fetch("http://localhost:5000/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(printData),
      });
  
      const result = await response.json();
      if (result.success) {
        alert("Downloading started successfully!");
      } else {
        alert("Downloading failed: " + result.error);
      }
    } catch (error) {
      console.error("Error sending print request:", error);
      alert("Downloading failed. Please try again.");
    }
  };

  return (
    <div className="p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Document Preview Section */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex items-center justify-between border-b pb-2 mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-lg">Document Preview</h3>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={prevPage}
                disabled={currentPage <= 1}
                className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage >= totalPages}
                className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg overflow-auto">
            <div className="flex justify-center min-h-[600px] p-4">
              <canvas ref={canvasRef} className="max-w-full transform-none" />
            </div>
          </div>
          
          {/* Zoom controls */}
          <div className="flex items-center justify-center mt-4 space-x-4">
            <button
              onClick={() => setScale(Math.max(0.5, scale - 0.2))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              Zoom Out
            </button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(Math.min(3, scale + 0.2))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              Zoom In
            </button>
            <button
              onClick={() => setScale(1.5)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Print Settings */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex items-center space-x-2 border-b pb-2 mb-4">
            <Printer className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-lg">Print Settings</h3>
          </div>

          {/* Copies */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Copies</label>
            <input
              type="number"
              min="1"
              value={copies}
              onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 p-2 border rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Orientation */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Layout</label>
            <div className="space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={orientation === "portrait"}
                  onChange={() => setOrientation("portrait")}
                  className="mr-2"
                />
                Portrait
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={orientation === "landscape"}
                  onChange={() => setOrientation("landscape")}
                  className="mr-2"
                />
                Landscape
              </label>
            </div>
          </div>

          {/* Color Mode */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={colorMode === "bw"}
                  onChange={() => setColorMode("bw")}
                  className="mr-2"
                />
                Black & White (₹2/page)
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={colorMode === "color"}
                  onChange={() => setColorMode("color")}
                  className="mr-2"
                />
                Color (₹10/page)
              </label>
            </div>
          </div>

          {/* Sided Mode */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Sided</label>
            <div className="space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={sidedMode === "single"}
                  onChange={() => setSidedMode("single")}
                  className="mr-2"
                />
                Single-Sided
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={sidedMode === "double"}
                  onChange={() => setSidedMode("double")}
                  className="mr-2"
                />
                Double-Sided
              </label>
            </div>
          </div>

          {/* Page Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Pages</label>
            <div className="space-y-2">
              <label className="block">
                <input
                  type="radio"
                  checked={selectedPages === "all"}
                  onChange={() => setSelectedPages("all")}
                  className="mr-2"
                />
                All pages ({totalPages} pages)
              </label>
              <label className="block">
                <input
                  type="radio"
                  checked={selectedPages === "odd"}
                  onChange={() => setSelectedPages("odd")}
                  className="mr-2"
                />
                Odd pages only
              </label>
              <label className="block">
                <input
                  type="radio"
                  checked={selectedPages === "even"}
                  onChange={() => setSelectedPages("even")}
                  className="mr-2"
                />
                Even pages only
              </label>
              <label className="block">
                <input
                  type="radio"
                  checked={selectedPages === "custom"}
                  onChange={() => setSelectedPages("custom")}
                  className="mr-2"
                />
                Custom pages:
                <input
                  type="text"
                  value={customPageRange}
                  onChange={(e) => setCustomPageRange(e.target.value)}
                  placeholder="e.g. 1,2,3"
                  className="ml-2 p-1 border rounded-md"
                  disabled={selectedPages !== "custom"}
                />
              </label>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner mt-4">
            <h4 className="font-semibold mb-2">Bill Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Price per page:</span>
                <span>₹{pricePerPage}</span>
              </div>
              <div className="flex justify-between">
                <span>Number of pages:</span>
                <span>{calculatePageCount()}</span>
              </div>
              <div className="flex justify-between">
                <span>Number of copies:</span>
                <span>{copies}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total Amount:</span>
                <span>₹{calculateTotal()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 mt-4">
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Document
            </button>
            
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay and Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintingInterface;