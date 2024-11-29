// src/Modules/Admin/Libary/Components/AddBook.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBookThunk } from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import ImageUpload from "./ImageUpload";
import FormInput from "../../Accounting/subClass/component/FormInput";
import FormSelect from "../../Accounting/subClass/component/FormSelect";

const AddBook = () => {
  const dispatch = useDispatch();
  const classList = useSelector((state) => state.admin.class.classes);
  const addbookLoading = useSelector(
    (state) => state.admin.library.addbookloading
  );

  const [bookData, setBookData] = useState({
    bookName: "",
    authorName: "",
    class: "",
    category: "",
    copies: "",
    bookImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setBookData((prev) => ({ ...prev, bookImage: file }));
    }
  };

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

    const formData = new FormData();
    formData.append("name", bookData.bookName);
    formData.append("author", bookData.authorName);
    formData.append("classId", bookData.class);
    formData.append("category", bookData.category);
    formData.append("copies", bookData.copies);
    if (bookData.bookImage) {
      formData.append("image", bookData.bookImage);
    }

    dispatch(addBookThunk(formData));
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
        />
        <div className="px-5">
          <FormInput
            id="bookName"
            label="Book Name"
            name="bookName"
            value={bookData.bookName}
            onChange={handleInputChange}
            error={errors.bookName}
            required
          />
          <FormInput
            id="authorName"
            label="Author Name"
            name="authorName"
            value={bookData.authorName}
            onChange={handleInputChange}
            error={errors.authorName}
            required
          />
          <FormSelect
            id="class"
            label="Class"
            name="class"
            options={classList?.map((cls) => ({
              value: cls._id,
              label: cls.className,
            }))}
            value={bookData.class}
            onChange={handleInputChange}
            required
          />
          <FormInput
            id="category"
            label="Category"
            name="category"
            value={bookData.category}
            onChange={handleInputChange}
            error={errors.category}
            required
          />
          <FormInput
            id="copies"
            label="Copies"
            type="number"
            name="copies"
            value={bookData.copies}
            onChange={handleInputChange}
            error={errors.copies}
            required
          />
        </div>
      </div>
      <div className="sticky bottom-0 w-full bg-white pb-3">
        <button
          type="submit"
          className="w-full p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md"
        >
          {addbookLoading ? "Adding..." : "Add Book"}
        </button>
      </div>
    </form>
  );
};

export default AddBook;
