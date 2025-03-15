import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBookThunk,
  updateBookThunk,
} from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import ImageUpload from "./ImageUpload";
import FormInput from "../../Accounting/subClass/component/FormInput"; // Still used for Book Name & Author
import { Select, Input } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const BookForm = ({ book, onClose }) => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();
  const classList = useSelector((state) => state.admin.class.classes);
  const categoriesList = useSelector((state) => state.admin.library.categories);
  const loading = useSelector((state) => state.admin.library.addbookloading);
  const success = useSelector((state) => state.admin.library.addBookSuccess);

  const [bookData, setBookData] = useState({
    bookName: "",
    authorName: "",
    class: "",
    categories: [],
    copies: "",
    bookImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [imageKey, setImageKey] = useState(Date.now()); // re-mount ImageUpload

  // Preload data if editing
  useEffect(() => {
    if (book) {
      const initialCategories = Array.isArray(book.categories)
        ? book.categories.map((c) => (c._id ? c._id : c))
        : [];
      setBookData({
        bookName: book.name || "",
        authorName: book.author || "",
        class: book.classId?._id || book.classId || "",
        categories: initialCategories,
        copies: book.copies || "",
        bookImage: null,
      });
      if (book.image) {
        setImagePreview(book.image);
      }
    }
  }, [book]);

  // On successful add in "add" mode
  useEffect(() => {
    if (success && !book) {
      setBookData({
        bookName: "",
        authorName: "",
        class: "",
        categories: [],
        copies: "",
        bookImage: null,
      });
      setImagePreview(null);
      setImageKey(Date.now());
      onClose();
    }
  }, [success, onClose, book]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setBookData((prev) => ({ ...prev, bookImage: file }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!bookData.bookName) newErrors.bookName = t("Book name is required.");
    if (!bookData.authorName)
      newErrors.authorName = t("Author name is required.");
    if (!bookData.class) newErrors.class = t("Class selection is required.");
    if (bookData.categories.length === 0)
      newErrors.categories = t("At least one category is required.");
    if (Number(bookData.copies) < 1)
      newErrors.copies = t("Copies must be at least 1.");
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const formData = new FormData();
    formData.append("name", bookData.bookName);
    formData.append("author", bookData.authorName);
    formData.append("classId", bookData.class);
    bookData.categories.forEach((catId) =>
      formData.append("categories", catId)
    );
    formData.append("copies", bookData.copies);
    if (bookData.bookImage) {
      formData.append("image", bookData.bookImage);
    }
    if (book) {
      // Edit mode
      dispatch(updateBookThunk({ bookId: book._id, formData })).then(() => {
        onClose();
      });
    } else {
      // Add mode
      dispatch(addBookThunk(formData));
    }
  };

  return (
    <form
      className="flex flex-col h-full"
      onSubmit={handleSubmit}
      style={{ maxHeight: "97vh" }}
    >
      <div className="flex-1 overflow-auto mb-8 no-scrollbar">
        <ImageUpload
          key={imageKey}
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
        />
        <div className="px-5 mb-4">
          <FormInput
            id="bookName"
            label={t("Book Name")}
            name="bookName"
            value={bookData.bookName}
            onChange={handleInputChange}
            error={errors.bookName}
            required
            inputClassName="h-12 text-base"
          />
          <FormInput
            id="authorName"
            label={t("Author Name")}
            name="authorName"
            value={bookData.authorName}
            onChange={handleInputChange}
            error={errors.authorName}
            required
            inputClassName="h-12 text-base"
          />
          {/* Row with Class Select and Copies side by side */}
          <div className="flex gap-4 my-4 items-center">
            {/* Class Select */}
            <div className="flex-1">
              <label
                htmlFor="classSelect"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("Class")}
              </label>
              <Select
                id="classSelect"
                placeholder={t("Select Class")}
                value={bookData.class || ""}
                onChange={(value) =>
                  setBookData((prev) => ({ ...prev, class: value }))
                }
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
              {errors.class && (
                <p className="text-red-500 text-xs">{errors.class}</p>
              )}
            </div>
            {/* Copies (Ant Design Input) */}
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
                placeholder={t("Copies")}
                value={bookData.copies}
                onChange={(e) =>
                  setBookData((prev) => ({ ...prev, copies: e.target.value }))
                }
                size="large"
                className=" text-base w-full"
              />
              {errors.copies && (
                <p className="text-red-500 text-xs">{errors.copies}</p>
              )}
            </div>
          </div>
          {/* Category multi-select */}
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("Category")}
            </label>
            <Select
              mode="multiple"
              placeholder={t("Select categories")}
              value={bookData.categories}
              onChange={(value) =>
                setBookData((prev) => ({ ...prev, categories: value }))
              }
              style={{ width: "100%" }}
              allowClear
              size="large"
            >
              {categoriesList?.map((cat) => (
                <Option key={cat._id} value={cat._id}>
                  {cat.name}
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
        <button
          type="submit"
          className="w-full p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md text-base"
        >
          {book ? t("Edit Book") : loading ? t("Adding...") : t("Add Book")}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
