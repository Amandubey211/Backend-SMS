import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input, Button } from "antd";
import { useTranslation } from "react-i18next";
import { BsQrCodeScan } from "react-icons/bs";
import { FiArrowRight, FiX } from "react-icons/fi";
import { motion, AnimatePresence, useCycle } from "framer-motion";

const ScanModeView = ({
  onManualBarcodeEntry,
  isbnLoading,
  onContinueWithoutBarcode,
}) => {
  const { t } = useTranslation("admLibrary");

  /* ------------------------------------------------------------------ */
  /*  Local state                                                       */
  /* ------------------------------------------------------------------ */
  const [manualBarcode, setManualBarcode] = useState("");

  /* ------------------------------------------------------------------ */
  /*  Focus helpers                                                     */
  /* ------------------------------------------------------------------ */
  const inputRef = useRef(null);
  const setFocus = useCallback(() => {
    inputRef.current?.focus({ cursor: "end" });
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(setFocus);
    return () => cancelAnimationFrame(id);
  }, [setFocus]);

  /* ------------------------------------------------------------------ */
  /*  Keyboard: submit on Enter                                         */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === "Enter" && manualBarcode) submitBarcode();
    };
    window.addEventListener("keypress", handleEnter);
    return () => window.removeEventListener("keypress", handleEnter);
  }, [manualBarcode]);

  /* ------------------------------------------------------------------ */
  /*  Barcode helpers                                                   */
  /* ------------------------------------------------------------------ */
  const isValidISBN = (v) => /^(\d{10}|\d{13})$/.test(v.replace(/\D/g, ""));

  const submitBarcode = () => onManualBarcodeEntry(manualBarcode);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setManualBarcode(value);

    // Auto-submit when scanner finishes
    if (isValidISBN(value)) onManualBarcodeEntry(value);
  };

  const clearInput = () => {
    setManualBarcode("");
    setFocus();
  };

  /* ------------------------------------------------------------------ */
  /*  Icon micro-animation                                              */
  /* ------------------------------------------------------------------ */
  const [hoverCycle, cycleHover] = useCycle(
    { scale: 1, rotate: 0 },
    { scale: 1.12, rotate: 8 }
  );

  /* ------------------------------------------------------------------ */
  /*  Motion variants                                                   */
  /* ------------------------------------------------------------------ */
  const cardVariants = {
    hidden: { opacity: 0, y: -16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 16 },
    },
    exit: { opacity: 0, y: 16 },
  };

  const pulseTransition = {
    yoyo: Infinity,
    ease: "easeInOut",
    duration: 0.8,
  };

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-6 h-full"
    >
      <div className="text-center max-w-md w-full">
        <AnimatePresence>
          <motion.div
            key="card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gradient-to-r from-[#C83B62]/10 to-[#7F35CD]/10 p-8 rounded-2xl mb-6 border border-gray-100 shadow-sm"
          >
            {/* Barcode icon with subtle breathing & hover wiggle */}
            <div className="flex items-center justify-center mb-4">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={pulseTransition}
                whileHover={() => cycleHover()}
                className="inline-block"
              >
                <motion.span animate={hoverCycle}>
                  <BsQrCodeScan className="text-5xl text-[#C83B62]" />
                </motion.span>
              </motion.div>
            </div>

            <h3 className="text-xl font-bold mb-2">{t("Scan Book Barcode")}</h3>
            <p className="text-gray-600 mb-6">
              {t("Scan the barcode using your scanner or enter manually")}
            </p>

            {/* ISBN input ------------------------------------------------ */}
            <div className="relative mb-4">
              <Input
                ref={inputRef}
                placeholder={t("Enter 10 or 13 digit ISBN")}
                value={manualBarcode}
                onChange={handleChange}
                size="large"
                className="pr-10 text-center font-mono"
                maxLength={13}
              />
              <AnimatePresence>
                {manualBarcode && (
                  <motion.button
                    key="clear"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    onClick={clearInput}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C83B62]"
                    title={t("Clear")}
                  >
                    <FiX />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {manualBarcode && !isValidISBN(manualBarcode) && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="text-red-500 text-sm mb-2"
              >
                {t("ISBN must be 10 or 13 digits")}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Buttons ------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-4"
        >
          <Button
            type="default"
            size="large"
            className="flex-1"
            onClick={onContinueWithoutBarcode}
          >
            {t("Add Manually")}
          </Button>

          <Button
            type="primary"
            size="large"
            className="flex-1 bg-gradient-to-r from-[#C83B62] to-[#7F35CD] border-none"
            loading={isbnLoading}
            disabled={!isValidISBN(manualBarcode)}
            onClick={submitBarcode}
            icon={<FiArrowRight />}
          >
            {t("Continue")}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8 text-sm text-gray-500"
        >
          <p>{t("Tip: Scan the ISBN barcode on the back of the book")}</p>
          <p className="mt-1">{t("Most scanners will automatically submit")}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ScanModeView;
