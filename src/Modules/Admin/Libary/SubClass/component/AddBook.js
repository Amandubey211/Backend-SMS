import React, { useState } from "react";
import ImageUpload from "../../../Addmission/Components/ImageUpload";
import FormInput from "../../../Accounting/subClass/component/FormInput";
import FormSelect from "../../../Accounting/subClass/component/FormSelect";

const AddBook = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [bookData, setBookData] = useState({
    bookName: "",
    authorName: "",
    class: "",
    category: "History", 
    copies: "",
    bookImage: null,
  });
  const classOptions = [
    { value: "Ten", label: "Ten" },
    { value: "Nine", label: "Nine" },
  ];
  const categoryOptions = [
    { value: "Business Management", label: "Business Management" },
    { value: "History", label: "History" },
  ];

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
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Book data to submit:", bookData);
    // Implement submission logic here
  };

  return (
    <div
      className="p-4 bg-gray-50 border rounded-lg overflow-auto"
      style={{ maxHeight: "90vh" }}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="image-upload-container  ">
          <ImageUpload
            imagePreview={imagePreview}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleRemoveImage}
          />
        </div>
        <FormInput
          id="bookName"
          label="Book Name"
          value={bookData.bookName}
          onChange={handleInputChange}
        />
        <FormInput
          id="authorName"
          label="Author Name"
          value={bookData.authorName}
          onChange={handleInputChange}
        />
        <FormSelect
          id="class"
          label="Select Class"
          options={classOptions}
          value={bookData.class}
          onChange={handleInputChange}
        />
        <FormSelect
          id="category"
          label="Select Category"
          options={categoryOptions}
          value={bookData.category}
          onChange={handleInputChange}
        />
        <FormInput
          id="copies"
          label="Copies"
          type="number"
          value={bookData.copies}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="w-full mt-4 p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
