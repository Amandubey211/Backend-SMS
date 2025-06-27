import React from "react";
import { useTranslation } from "react-i18next";
import { FiPlus, FiMinus } from "react-icons/fi";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const BookFoundView = ({
  book,
  copies,
  onIncrement,
  onDecrement,
  onSubmit,
  onCancel,
  loading,
}) => {
  const { t } = useTranslation("admLibrary");
  const classes = useSelector((s) => s.admin.class.classes);

  /* ── class name lookup (backend isn’t populated) ── */
  const className =
    classes.find((c) => c._id === (book.classId?._id || book.classId))
      ?.className || t("N/A");

  /* ── motion variants ── */
  const btnTap = { scale: 0.9 };
  const cardFade = {
    hidden: { opacity: 0, y: 12 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full p-6"
    >
      <div className="flex-1 overflow-auto">
        {/* ───────── Book card ───────── */}
        <motion.div
          variants={cardFade}
          initial="hidden"
          animate="shown"
          className="relative mb-6 rounded-2xl p-6 backdrop-blur-sm bg-white/60 border border-white/30 shadow-lg"
        >
          {/* soft glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#ff8181]/40 via-transparent to-[#b48bff]/40 pointer-events-none" />

          <div className="relative flex items-start">
            {book.image && (
              <img
                src={book.image}
                alt={book.name}
                className="w-24 h-32 object-cover rounded-xl shadow-lg mr-5"
              />
            )}

            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-800">
                {book.name}
              </h2>
              <p className="text-gray-600 mb-1">{book.author}</p>

              <div className="mt-2 text-sm space-y-1">
                <p className="text-gray-500">
                  <span className="font-medium">{t("ISBN")}:</span>{" "}
                  {book.barcodeValue}
                </p>
                <p className="text-gray-500">
                  <span className="font-medium">{t("Class")}:</span> {className}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ───────── Copies updater ───────── */}
        <motion.div
          variants={cardFade}
          initial="hidden"
          animate="shown"
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
        >
          <h3 className="font-medium text-gray-700 mb-6 text-lg flex items-center gap-2">
            {t("Update Copies")}
            <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-[#C83B62] to-[#7F35CD]" />
          </h3>

          <div className="flex items-center justify-between mb-8">
            {/* current */}
            <div className="text-center">
              <p className="text-xs text-gray-500 tracking-wide">
                {t("Current")}
              </p>
              <p className="text-3xl font-bold">{book.copies || 0}</p>
            </div>

            {/* counter */}
            <div className="text-center">
              <p className="text-xs text-gray-500 tracking-wide">
                {t("Adding")}
              </p>
              <div className="flex items-center mt-1">
                <motion.button
                  whileTap={btnTap}
                  onClick={onDecrement}
                  disabled={parseInt(copies) <= 1}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
                >
                  <FiMinus />
                </motion.button>

                <span className="mx-5 text-2xl font-bold">{copies}</span>

                <motion.button
                  whileTap={btnTap}
                  onClick={onIncrement}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <FiPlus />
                </motion.button>
              </div>
            </div>

            {/* new total */}
            <div className="text-center">
              <p className="text-xs text-gray-500 tracking-wide">
                {t("New Total")}
              </p>
              <p className="text-3xl font-bold text-gradient-to-r bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-transparent bg-clip-text">
                {parseInt(book.copies || 0) + parseInt(copies)}
              </p>
            </div>
          </div>

          {/* ───────── Action buttons ───────── */}
          <div className="flex gap-4">
            {/* Cancel */}
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 min-w-[110px] rounded-lg relative overflow-hidden
                         text-gray-700 border border-transparent
                         before:absolute before:inset-0 before:rounded-lg
                         before:bg-gradient-to-r before:from-transparent before:to-transparent
                         hover:before:from-[#C83B62]/30 hover:before:to-[#7F35CD]/30
                         before:opacity-0 hover:before:opacity-100 before:transition-opacity"
            >
              {t("cancel")}
            </button>

            {/* Update */}
            <motion.button
              whileTap={btnTap}
              type="button"
              onClick={onSubmit}
              disabled={loading}
              className="flex-1 py-2 rounded-lg font-medium text-white shadow-lg
                         bg-gradient-to-r from-[#C83B62] to-[#7F35CD]
                         hover:brightness-105 disabled:opacity-70"
            >
              {loading ? t("Updating…") : t("Update Copies")}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookFoundView;
