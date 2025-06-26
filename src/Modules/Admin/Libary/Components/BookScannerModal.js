// components/BookScannerModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { BsQrCodeScan } from "react-icons/bs";
import { generateValid13DigitISBN } from "../../../../Utils/isbnUtils";
import { fetchBookByISBNThunk } from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const BookScannerModal = ({ visible, onClose, onScanComplete }) => {
  const { t } = useTranslation("admLibrary");
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const dispatch = useDispatch();
  /* ------------------------------------------------------------------ */
  /* Handle keyboard input from physical scanner                         */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!visible) {
      setScannedData("");
      return;
    }

    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        if (scannedData) {
          onScanComplete(scannedData);
          setScannedData("");
        }
      } else {
        setScannedData((prev) => prev + e.key);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [visible, scannedData, onScanComplete]);

  /* ------------------------------------------------------------------ */
  /* Demo / QA helper: simulate a scan                                   */
  /* ------------------------------------------------------------------ */
  const handleSimulateScan = async () => {
    setScanning(true);
    try {
      const fakeISBN = generateValid13DigitISBN();
      // Dispatch the thunk to actually test the full flow
      await dispatch(fetchBookByISBNThunk(fakeISBN));
      setScanning(false);
    } catch (error) {
      toast.error("Failed to simulate scan");
      setScanning(false);
    }
  };
  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */
  return (
    <Modal
      title={<span className="font-semibold">{t("Scan Book Barcode")}</span>}
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={420}
      destroyOnClose
    >
      <div className="text-center p-4">
        {/* Gradient card with QR icon ---------------------------------- */}
        <div className="rounded-xl overflow-hidden mb-6 shadow">
          <div className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] p-8">
            <BsQrCodeScan
              size={48}
              className={`mx-auto text-white ${
                scanning ? "animate-pulse" : ""
              }`}
            />
            <div className="h-10 flex items-center justify-center mt-4">
              {scanning ? (
                <Spin tip={t("Scanning...")} />
              ) : (
                <p className="text-white/90">{t("Ready to scan")}</p>
              )}
            </div>
          </div>
        </div>

        {/* Live scanner input ----------------------------------------- */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-1">
            {t("Scanner input will appear here")}
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono h-12 overflow-x-auto">
            {scannedData || t("[Waiting for input]")}
          </div>
        </div>

        {/* Simulate button -------------------------------------------- */}
        <button
          type="button"
          onClick={handleSimulateScan}
          disabled={scanning}
          className="w-full py-2 rounded-lg text-white font-medium bg-gradient-to-r from-[#C83B62] to-[#7F35CD] hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-[#C83B62]/40"
        >
          {scanning ? t("Scanning...") : t("Simulate Scan")}
        </button>
      </div>
    </Modal>
  );
};

export default BookScannerModal;
