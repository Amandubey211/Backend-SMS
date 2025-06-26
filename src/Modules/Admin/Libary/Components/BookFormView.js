import React from "react";
import { Select, Input } from "antd";
import { useTranslation } from "react-i18next";
import { BsBook } from "react-icons/bs";
import { FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import ImageUpload from "./ImageUpload";
import FormInput from "../../Accounting/subClass/component/FormInput";

const { Option } = Select;

const BookFormView = ({
  scannedBarcode,
  googleBookData,
  onToggleScanMode,
  onHideGoogleData,
  imageKey,
  imagePreview,
  onImageChange,
  onRemoveImage,
  bookData,
  onInputChange,
  onClassChange,
  onCategoriesChange,
  errors,
  classList,
  categoriesList,
  onSubmit,
  loading,
  book,
}) => {
  const { t } = useTranslation("admLibrary");

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full"
      onSubmit={onSubmit}
      style={{ maxHeight: "97vh" }}
    >
      <div className="flex-1 overflow-auto mb-8 no-scrollbar">
        {scannedBarcode && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-blue-50 p-3 mb-4 rounded-lg flex justify-between items-center"
          >
            <div className="flex items-center">
              <BsBook className="text-blue-600 mr-2" />
              <div>
                <span className="text-sm text-blue-700 font-medium">
                  {t("Barcode")}:
                </span>
                <span className="ml-2 font-mono">{scannedBarcode}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleScanMode}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <FiX className="mr-1" /> {t("Change")}
            </button>
          </motion.div>
        )}

        {googleBookData && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-green-50 p-3 mb-4 rounded-lg border border-green-100"
          >
            <div className="flex items-start">
              <div className="flex-1">
                <h4 className="text-green-800 font-medium mb-1">
                  {t("Data from Google Books")}
                </h4>
                <p className="text-sm text-green-700">
                  {t(
                    "We found this book in Google Books. Please verify the details."
                  )}
                </p>
              </div>
              <button
                onClick={onHideGoogleData}
                className="text-green-600 hover:text-green-800"
                title={t("Hide Google Books data")}
              >
                <FiX />
              </button>
            </div>
          </motion.div>
        )}

        <ImageUpload
          key={imageKey}
          imagePreview={imagePreview}
          handleImageChange={onImageChange}
          handleRemoveImage={onRemoveImage}
        />

        <div className="px-5 mb-4">
          <FormInput
            id="bookName"
            label={t("Book Name")}
            name="bookName"
            value={bookData.bookName}
            onChange={onInputChange}
            error={errors.bookName}
            required
            inputClassName="h-12 text-base"
          />
          <FormInput
            id="authorName"
            label={t("Author Name")}
            name="authorName"
            value={bookData.authorName}
            onChange={onInputChange}
            error={errors.authorName}
            required
            inputClassName="h-12 text-base"
          />

          <div className="flex gap-4 my-4 items-center">
            <div className="flex-1">
              <label
                htmlFor="classSelect"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("Class")} ({t("Optional")})
              </label>
              <Select
                id="classSelect"
                placeholder={t("Select Class")}
                value={bookData.class || ""}
                onChange={onClassChange}
                style={{ width: "100%" }}
                size="large"
                allowClear
              >
                {classList?.map((cls) => (
                  <Option key={cls._id} value={cls._id}>
                    {cls.className}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="flex-1">
              <label
                htmlFor="copiesInput"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("Copies")} <span className="text-red-500">*</span>
              </label>
              <Input
                id="copiesInput"
                type="number"
                min="1"
                placeholder={t("Copies")}
                value={bookData.copies}
                onChange={(e) =>
                  onInputChange({
                    target: {
                      name: "copies",
                      value: Math.max(
                        1,
                        parseInt(e.target.value) || 1
                      ).toString(),
                    },
                  })
                }
                size="large"
                className="text-base w-full"
              />
              {errors.copies && (
                <p className="text-red-500 text-xs">{errors.copies}</p>
              )}
            </div>
          </div>

          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("Category")} <span className="text-red-500">*</span>
            </label>
            <Select
              mode="multiple"
              placeholder={t("Select categories")}
              value={bookData.categories}
              onChange={onCategoriesChange}
              style={{ width: "100%" }}
              allowClear
              size="large"
            >
              {categoriesList?.map((cat) => (
                <Option key={cat?._id} value={cat?._id}>
                  {cat?.name}
                </Option>
              ))}
            </Select>
            {errors.categories && (
              <p className="text-red-500 text-xs">{errors.categories}</p>
            )}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 w-full bg-white pb-3">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          className="w-full p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-base font-medium hover:shadow-lg transition-all"
          disabled={loading}
        >
          {book ? t("Update Book") : loading ? t("Adding...") : t("Add Book")}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default BookFormView;
