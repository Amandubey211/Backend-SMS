import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { saveAs } from "file-saver";
import { useDispatch } from "react-redux";
import { fetchStudentReportCard } from "../../../../../../Store/Slices/Admin/Class/Students/studentThunks";

// Set the worker for react-pdf (required for PDF rendering)
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Load pdf-lib dynamically via CDN
const loadPdfLib = async () => {
  if (typeof window !== "undefined" && !window.PDFLib) {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/pdf-lib@1.17.0/dist/pdf-lib.min.js";
    document.head.appendChild(script);
    return new Promise((resolve) => {
      script.onload = () => resolve(window.PDFLib);
    });
  }
  return window.PDFLib;
};

// Modal Component for "Report Card not available"
const ReportCardNotAvailableModal = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="p-8 rounded-lg flex flex-col items-center">
        {/* Report Card Icon (Fallback using Unicode) */}
        <span className="text-6xl mb-4">📜</span>
        {/* If using Heroicons, uncomment the following line and comment the above */}
        {/* <DocumentTextIcon className="h-16 w-16 text-gray-500 mb-4" /> */}
        <p className="text-lg font-medium text-gray-700">Report Card not available</p>
      </div>
    </div>
  );
};

function StudentReportCard({ student }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const dispatch = useDispatch();

  // Function to fetch the PDF URL
  const fetchPdf = async () => {
    if (isFetching) return; // Prevent multiple simultaneous requests
    setIsFetching(true);
    setLoading(true);
    try {
      const response = await dispatch(fetchStudentReportCard(student._id));
      if (response.error) {
        throw new Error(response.payload || "Failed to fetch report card");
      }
      setPdfUrl(response.payload.pdfUrl);
    } catch (err) {
      setPdfUrl(null); // Ensure pdfUrl is null on error
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  // Fetch the PDF on component mount or when student ID changes
  useEffect(() => {
    if (student?._id) {
      fetchPdf();
    } else {
      setPdfUrl(null);
    }
  }, [student?._id]);

  // Update container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      const width = document.querySelector(".pdf-container")?.clientWidth - 48; // Adjust for padding (p-6 = 24px on each side)
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

  // Handle Download PDF (only the first page)
  const handleDownload = async () => {
    if (!pdfUrl) return;
    setDownloadLoading(true);
    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch PDF for download");
      }
      const pdfArrayBuffer = await response.arrayBuffer();

      const { PDFDocument } = await loadPdfLib();
      const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
      const newPdfDoc = await PDFDocument.create();
      const [firstPage] = await newPdfDoc.copyPages(pdfDoc, [0]);
      newPdfDoc.addPage(firstPage);
      const pdfBytes = await newPdfDoc.save();

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, `${student.firstName}_${student.lastName}_ReportCard_FirstPage.pdf`);
    } catch (err) {
      setPdfUrl(null); // Reset pdfUrl on download error
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="w-full p-6 bg-gray-50 rounded-lg shadow-md flex flex-col min-h-[calc(100vh-4rem)]">
      {pdfUrl ? (
        <>
          {/* Buttons Container */}
          <div className="flex justify-between items-center mb-6 w-full">
            <button
              onClick={fetchPdf}
              disabled={loading || isFetching}
              className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ${loading || isFetching
                ? "bg-gradient-to-r from-pink-300 to-purple-300 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                }`}
            >
              {loading ? "Regenerating..." : "Regenerate Report Card"}
            </button>
            <button
              onClick={handleDownload}
              disabled={downloadLoading}
              className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ${downloadLoading
                ? "bg-gradient-to-r from-pink-300 to-purple-300 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                }`}
            >
              {downloadLoading ? "Downloading..." : "Download Report Card"}
            </button>
          </div>

          {/* PDF Display */}
          <div className="w-full flex-1 pdf-container">
            <div
              className="w-full bg-white rounded-lg shadow-lg border border-gray-200"
              style={{
                height: "calc(100vh - 12rem)",
                overflowY: "auto",
              }}
            >
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={() => setPdfUrl(null)} // Reset pdfUrl on load error
                className="flex justify-center"
              >
                <Page
                  pageNumber={1}
                  width={containerWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-sm"
                />
              </Document>
            </div>
          </div>
        </>
      ) : (
        <ReportCardNotAvailableModal />
      )}
    </div>
  );
}

export default StudentReportCard;