import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Set the worker for react-pdf (required for PDF rendering)
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ScoreCardView({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Update container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      const width = document.querySelector(".pdf-container")?.clientWidth - 48; // Adjust for padding
      setContainerWidth(width || 0);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Handle PDF load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="w-full p-6 bg-gray-50 rounded-lg shadow-md flex flex-col min-h-[calc(100vh-4rem)]">
      {pdfUrl ? (
        <div className="w-full flex-1 pdf-container">
          <div
            className="w-full bg-white rounded-lg shadow-lg border border-gray-200"
            style={{
              height: "calc(100vh - 4rem)",
              overflowY: "auto",
            }}
          >
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex justify-center"
            >
              {/* Render all pages */}
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={containerWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-sm mb-4"
                />
              ))}
            </Document>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-lg font-medium text-gray-700">No PDF URL provided.</p>
        </div>
      )}
    </div>
  );
}


export default ScoreCardView;
