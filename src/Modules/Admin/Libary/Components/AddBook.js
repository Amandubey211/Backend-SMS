import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormInput from "../../Accounting/subClass/component/FormInput";
import FormSelect from "../../Accounting/subClass/component/FormSelect";
import { addBookThunk } from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import ImageUpload from "./ImageUpload";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";

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

  useEffect(() => {
    if (classList.length === 0) {
      dispatch(fetchAllClasses());
    }
  }, [dispatch, classList]);

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

  const handleRemoveImage = () => {
    setImagePreview(null);
    setBookData((prev) => ({ ...prev, bookImage: null }));
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
      aria-labelledby="add-book-form"
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
            options={classList.map((c) => ({
              value: c._id,
              label: c.className,
            }))}
            value={bookData.class}
            onChange={handleInputChange}
            aria-invalid={errors.class ? "true" : "false"}
            className={errors.class ? "border-red-500" : ""}
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
            type="number"
            name="copies"
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

      <div className="sticky bottom-0 w-full bg-white pb-3">
        <button
          type="submit"
          className="w-full p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          {addbookLoading ? "Adding..." : "  Add Book"}
        </button>
      </div>
    </form>
  );
};

export default AddBook;
