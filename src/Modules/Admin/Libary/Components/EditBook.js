import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBookThunk } from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import FormInput from "../../Accounting/subClass/component/FormInput";
import FormSelect from "../../Accounting/subClass/component/FormSelect";
import ImageUpload from "./ImageUpload";
import toast from "react-hot-toast";

const EditBook = ({ book, onClose }) => {
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

  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    setBookData({
      bookName: book?.name || "",
      authorName: book?.author || "",
      class: book?.classId?._id || "", // Store the class ID, not the className
      category: book?.category || "",
      copies: book?.copies || 0,
      bookImage: null,
    });

    if (book?.image) {
      setImagePreview(book.image);
    }
  }, [book]);

  useEffect(() => {
    dispatch(fetchAllClasses());
  }, [dispatch]);

  const classOptions = classList.map((item) => ({
    value: item._id,
    label: item.className,
  }));

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

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!bookData.bookName) newErrors.bookName = "Book name is required.";
    if (!bookData.authorName) newErrors.authorName = "Author name is required.";
    if (!bookData.class) newErrors.class = "Class selection is required.";
    if (!bookData.category) newErrors.category = "Category is required.";
    if (bookData.copies < 1) newErrors.copies = "Copies must be at least 1.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const selectedClass = classList.find(
      (item) => item._id === bookData.class // Compare by class ID now
    );
    if (!selectedClass) {
      toast.error("Class not found!");
      return;
    }

    const formData = new FormData();
    formData.append("name", bookData.bookName);
    formData.append("author", bookData.authorName);
    formData.append("classId", selectedClass._id); // Pass the class ID
    formData.append("category", bookData.category);
    formData.append("copies", bookData.copies);
    if (bookData.bookImage) {
      formData.append("image", bookData.bookImage);
    }

    dispatch(updateBookThunk({ bookId: book._id, formData })).then(() => {
      toast.success("Book updated successfully!");
      onClose();
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setHasScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <form
      className="flex flex-col h-full"
      onSubmit={handleSubmit}
      style={{ maxHeight: "97vh" }}
      aria-labelledby="edit-book-form"
    >
      <div className="flex-1 overflow-auto mb-8 no-scrollbar">
        {/* Image Upload Section with Preview */}
        <ImageUpload
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
          handleRemoveImage={handleRemoveImage}
        />

        {/* Other form fields */}
        <div className="px-5">
          <FormInput
            id="bookName"
            label="Book Name"
            name="bookName"
            value={bookData.bookName}
            onChange={handleInputChange}
            aria-invalid={errors.bookName ? "true" : "false"}
            className={errors.bookName ? "border-red-500" : ""}
          />
          {errors.bookName && (
            <p className="text-red-500 text-sm mt-1">{errors.bookName}</p>
          )}
          <FormInput
            id="authorName"
            label="Author Name"
            name="authorName"
            value={bookData.authorName}
            onChange={handleInputChange}
            aria-invalid={errors.authorName ? "true" : "false"}
            className={errors.authorName ? "border-red-500" : ""}
          />
          {errors.authorName && (
            <p className="text-red-500 text-sm mt-1">{errors.authorName}</p>
          )}
          <FormSelect
            id="class"
            label="Select Class"
            name="class"
            options={classOptions}
            value={bookData.class} // Use the class ID as the value
            onChange={handleInputChange}
            aria-invalid={errors.class ? "true" : "false"}
            error={errors.class}
          />
          {errors.class && (
            <p className="text-red-500 text-sm mt-1">{errors.class}</p>
          )}
          <FormInput
            id="category"
            label="Category"
            name="category"
            value={bookData.category}
            onChange={handleInputChange}
            aria-invalid={errors.category ? "true" : "false"}
            className={errors.category ? "border-red-500" : ""}
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
          <FormInput
            id="copies"
            label="Copies"
            name="copies"
            type="number"
            value={bookData.copies}
            onChange={handleInputChange}
            aria-invalid={errors.copies ? "true" : "false"}
            className={errors.copies ? "border-red-500" : ""}
          />
          {errors.copies && (
            <p className="text-red-500 text-sm mt-1">{errors.copies}</p>
          )}
        </div>
      </div>

      {/* Submit Button with conditional shadow */}
      <div
        className={`sticky bottom-0 w-full bg-white pb-3 transition-shadow duration-300 ${
          hasScrolled ? "shadow-lg" : ""
        }`}
      >
        <button
          type="submit"
          className="w-full p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          Edit Book
        </button>
      </div>
    </form>
  );
};

export default EditBook;
