// components/ScanModeView.jsx
import React from "react";
import { Input, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { BsQrCodeScan } from "react-icons/bs";
import { FiCopy, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";

const ScanModeView = ({
  onShowScannerModal,
  scannedBarcode,
  onScannedBarcodeChange,
  onCopyToClipboard,
  copied,
  onManualBarcodeEntry,
  isbnLoading,
  onContinueWithoutBarcode,
}) => {
  const { t } = useTranslation("admLibrary");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-6 h-full"
    >
      <div className="text-center max-w-md w-full">
        {/* Gradient card --------------------------------------------------- */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-[#C83B62]/10 to-[#7F35CD]/10 p-8 rounded-2xl mb-6 border border-gray-100 shadow-sm"
        >
          <BsQrCodeScan className="text-5xl mx-auto text-[#C83B62] mb-4" />
          <h3 className="text-xl font-bold mb-2">{t("Scan Book Barcode")}</h3>
          <p className="text-gray-600 mb-6">
            {t("Scan the barcode or enter barcode manually")}
          </p>

          {/* Scan button ------------------------------------------------ */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onShowScannerModal}
            className="w-full py-3 bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white rounded-lg font-medium mb-4 hover:opacity-90 transition"
          >
            {t("Scan Barcode")}
          </motion.button>

          {/* Manual barcode input ------------------------------------- */}
          <div className="relative mb-4">
            <Input
              placeholder={t("Enter 10 or 13 digit barcode")}
              value={scannedBarcode}
              onChange={onScannedBarcodeChange}
              size="large"
              className="pr-10"
              maxLength={13}
            />
            {scannedBarcode && (
              <button
                onClick={onCopyToClipboard}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C83B62]"
                title={t("Copy to clipboard")}
              >
                {copied ? <FiCheck className="text-green-600" /> : <FiCopy />}
              </button>
            )}
          </div>

          {/* Validation message ---------------------------------------- */}
          {scannedBarcode && !/^(\d{10}|\d{13})$/.test(scannedBarcode) && (
            <p className="text-red-500 text-sm mb-2">
              {t("Barcode must be 10 or 13 digits")}
            </p>
          )}
        </motion.div>

        {/* Action buttons ------------------------------------------------ */}
        <div className="flex gap-4">
          {/* Continue without barcode */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onContinueWithoutBarcode}
            className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            {t("Continue Without Barcode")}
          </motion.button>

          {/* Continue with barcode */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onManualBarcodeEntry}
            disabled={
              !scannedBarcode ||
              isbnLoading ||
              !/^(\d{10}|\d{13})$/.test(scannedBarcode)
            }
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              !scannedBarcode ||
              isbnLoading ||
              !/^(\d{10}|\d{13})$/.test(scannedBarcode)
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white hover:opacity-90"
            }`}
          >
            {isbnLoading ? <Spin size="small" /> : t("Continue")}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ScanModeView;
