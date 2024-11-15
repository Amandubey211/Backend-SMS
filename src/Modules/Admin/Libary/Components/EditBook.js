import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBookThunk } from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import FormInput from "../../Accounting/subClass/component/FormInput";
import FormSelect from "../../Accounting/subClass/component/FormSelect";
import ImageUpload from "./ImageUpload";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const EditBook = ({ book, onClose }) => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();
  const classList = useSelector((state) => state.admin.class.classes);

  const [imagePreview, setImagePreview] = useState(null);
  const [bookData, setBookData] = useState({
    bookName: "",
    authorName: "",
    class: "",
    category: "",
    copies: 0,
    bookImage: null,
  });
  const [errors, setErrors] = useState({});

  // Preload book data when the component mounts
  useEffect(() => {
    if (book) {
      setBookData({
        bookName: book?.name || "",
        authorName: book?.author || "",
        class: book?.classId?._id || "", // Preselect the class from bookId.classId
        category: book?.category || "",
        copies: book?.copies || 0,
        bookImage: null,
      });

      if (book?.image) {
        setImagePreview(book.image);
      }
    }
  }, [book]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setBookData((prev) => ({
        ...prev,
        bookImage: file,
      }));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setBookData((prev) => ({
      ...prev,
      bookImage: null,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!bookData.bookName) newErrors.bookName = t("Book name is required.");
    if (!bookData.authorName) newErrors.authorName = t("Author name is required.");
    if (!bookData.class) newErrors.class = t("Class selection is required.");
    if (!bookData.category) newErrors.category = t("Category is required.");
    if (bookData.copies < 1) newErrors.copies = t("Copies must be at least 1.");
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
    formData.append("category", bookData.category);
    formData.append("copies", bookData.copies);
    if (bookData.bookImage) {
      formData.append("image", bookData.bookImage);
    }

    dispatch(updateBookThunk({ bookId: book._id, formData })).then(() => {
      onClose();
    });
  };

  return (
    <form
      className="flex flex-col h-full"
      onSubmit={handleSubmit}
      style={{ maxHeight: "97vh" }}
    >
      <div className="flex-1 overflow-auto mb-8 no-scrollbar">
        <ImageUpload
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
          handleRemoveImage={handleRemoveImage}
        />
        <div className="px-5">
          <FormInput
            id="bookName"
            label={t("Book Name")}
            name="bookName"
            value={bookData.bookName}
            onChange={handleInputChange}
            error={errors.bookName}
          />
          <FormInput
            id="authorName"
            label={t("Author Name")}
            name="authorName"
            value={bookData.authorName}
            onChange={handleInputChange}
            error={errors.authorName}
          />
          <FormSelect
            id="class"
            label={t("Select Class")}
            name="class"
            options={classList.map((cls) => ({
              value: cls._id,
              label: cls.className,
            }))}
            value={bookData.class} // Prefill with the selected class
            onChange={handleInputChange}
            error={errors.class}
          />
          <FormInput
            id="category"
            label={t("Category")}
            name="category"
            value={bookData.category}
            onChange={handleInputChange}
            error={errors.category}
          />
          <FormInput
            id="copies"
            label={t("Copies")}
            name="copies"
            type="number"
            value={bookData.copies}
            onChange={handleInputChange}
            error={errors.copies}
          />
        </div>
      </div>
      <div className="sticky bottom-0 w-full bg-white pb-3">
        <button
          type="submit"
          className="w-full p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md"
        >
          {t("Edit Book")}
        </button>
      </div>
    </form>
  );
};

export default EditBook;
