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
  const [manualBarcode, setManualBarcode] = useState("");
  const inputRef = useRef(null);

  /* ───────────────── focus helper ───────────────── */
  const focusInput = useCallback(
    () => inputRef.current?.focus({ cursor: "end" }),
    []
  );

  /* focus once component appears */
  useEffect(() => {
    const id = requestAnimationFrame(focusInput);
    return () => cancelAnimationFrame(id);
  }, [focusInput]);

  /* ───────────────── keyboard submit on Enter ───────────────── */
  const isValidISBN = (v) => /^(\d{10}|\d{13})$/.test(v.replace(/\D/g, ""));

  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === "Enter" && isValidISBN(manualBarcode)) submitBarcode();
    };
    window.addEventListener("keypress", handleEnter);
    return () => window.removeEventListener("keypress", handleEnter);
  }, [manualBarcode]);

  /* ───────────────── local handlers ───────────────── */
  const submitBarcode = () => onManualBarcodeEntry(manualBarcode);

  const handleChange = (e) => {
    const v = e.target.value.replace(/\D/g, "");
    setManualBarcode(v);
  };

  const clearInput = () => {
    setManualBarcode("");
    focusInput();
  };

  /* ───────────────── professional animations ───────────────── */
  const [hoverCycle, cycleHover] = useCycle(
    { scale: 1, rotate: 0 },
    { scale: 1.05, rotate: 3 }
  );

  const cardVariants = {
    hidden: { opacity: 0, y: -16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 14,
        staggerChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      y: 16,
      transition: { ease: "easeInOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  const iconFloat = {
    y: [0, -4, 0],
    transition: {
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  /* ───────────────── render ───────────────── */
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
            className="bg-white p-8 rounded-xl mb-6 border border-gray-100 shadow-sm"
          >
            {/* icon with subtle animation */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-center mb-5">
                <motion.div
                  animate={iconFloat}
                  whileHover={() => cycleHover()}
                  className="inline-block p-3 rounded-lg bg-gradient-to-br from-[#C83B62]/10 to-[#7F35CD]/10 border border-[#C83B62]/20"
                >
                  <motion.span animate={hoverCycle}>
                    <BsQrCodeScan className="text-4xl text-[#7F35CD]" />
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>

            {/* gradient text for heading */}
            <motion.h3
              variants={itemVariants}
              className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#C83B62] to-[#7F35CD]"
            >
              {t("Scan Book Barcode")}
            </motion.h3>

            <motion.p variants={itemVariants} className="text-gray-600 mb-6">
              {t("Scan the barcode using your scanner or enter manually")}
            </motion.p>

            {/* ISBN input */}
            <motion.div variants={itemVariants} className="relative mb-4">
              <Input
                ref={inputRef}
                autoFocus
                placeholder={t("Enter 10 or 13 digit ISBN")}
                value={manualBarcode}
                onChange={handleChange}
                size="large"
                className="pr-10 text-center font-mono hover:border-[#C83B62]/50 focus:border-[#7F35CD]"
                maxLength={13}
              />
              <AnimatePresence>
                {manualBarcode && (
                  <motion.button
                    key="clear"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    onClick={clearInput}
                    className="absolute right-3 top-0 h-full flex items-center justify-center text-gray-500 hover:text-[#C83B62]"
                    title={t("Clear")}
                  >
                    <FiX className="text-base" />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
            {manualBarcode && !isValidISBN(manualBarcode) && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="text-[#C83B62] text-sm mb-2"
              >
                {t("ISBN must be 10 or 13 digits")}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Buttons with refined gradient */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-4"
        >
          <Button
            type="default"
            size="large"
            className="flex-1 border-gray-300 hover:border-[#7F35CD]/50 hover:text-[#7F35CD]"
            onClick={onContinueWithoutBarcode}
          >
            {t("Continue Without ISBN")}
          </Button>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1"
          >
            <Button
              type="primary"
              size="large"
              className="w-full bg-gradient-to-r from-[#C83B62] to-[#7F35CD] border-none hover:from-[#C83B62]/90 hover:to-[#7F35CD]/90"
              loading={isbnLoading}
              disabled={!isValidISBN(manualBarcode)}
              onClick={submitBarcode}
              icon={<FiArrowRight />}
            >
              {t("Continue")}
            </Button>
          </motion.div>
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
