import React from "react";
import { useTranslation } from "react-i18next";
import { BsBook, BsPencil } from "react-icons/bs";
import { FiPlus, FiMinus } from "react-icons/fi";
import { motion } from "framer-motion";

const BookFoundView = ({
  book,
  copies,
  onEdit,
  onIncrement,
  onDecrement,
  onSubmit,
  loading,
  onClose,
}) => {
  const { t } = useTranslation("admLibrary");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full p-6"
    >
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-[#C83B62]/10 to-[#7F35CD]/10 rounded-xl p-6 mb-6">
          <div className="flex items-start">
            {book.image && (
              <div className="mr-4">
                <img
                  src={book.image}
                  alt={book.name}
                  className="w-24 h-32 object-cover rounded-lg shadow"
                />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{book.name}</h2>
              <p className="text-gray-600">{book.author}</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>
                  {t("ISBN")}: {book.barcodeValue}
                </p>
                {book.classId && (
                  <p>
                    {t("Class")}: {book.classId.className}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-medium text-gray-700 mb-4">
            {t("Update Copies")}
          </h3>

          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500">{t("Current Copies")}</p>
              <p className="text-2xl font-bold">{book.copies || 0}</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">{t("Adding")}</p>
              <div className="flex items-center justify-center mt-1">
                <button
                  onClick={onDecrement}
                  disabled={parseInt(copies) <= 1}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                >
                  <FiMinus />
                </button>
                <span className="mx-4 text-xl font-bold">{copies}</span>
                <button
                  onClick={onIncrement}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">{t("New Total")}</p>
              <p className="text-2xl font-bold text-[#C83B62]">
                {(parseInt(book.copies || 0) + parseInt(copies)).toString()}
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-end"> 
            <button
              type="button"
              onClick={onSubmit}
              disabled={loading}
              className="flex-1 py-2 bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-70"
            >
              {loading ? t("Updating...") : t("Update Copies")}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookFoundView;
