import React, { useEffect, useState } from "react";
import ImageUpload from "../../../Addmission/Components/ImageUpload";
import FormInput from "../../../Accounting/subClass/component/FormInput";
import FormSelect from "../../../Accounting/subClass/component/FormSelect";
import { baseUrl } from "../../../../../config/Common";
import { useSelector } from "react-redux";
import useGetAllClasses from "../../../../../Hooks/AuthHooks/Staff/Admin/Class/useGetAllClasses";
import toast from "react-hot-toast";
const AddBook = ({onupdate}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const {classList} = useSelector((store)=>store.Class);

  const { fetchClasses } = useGetAllClasses();
  useEffect(()=>{
    fetchClasses()
  },[])
  const [bookData, setBookData] = useState({
    bookName: "",
    authorName: "",
    class: "",
    category: "",
    copies: "",
    bookImage: null,
  });

  let  classOptions = [];
  const classData = classList.map((item)=>{
    classOptions.push( { value: item.className,
      label:item.className })

  })
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
  const role = useSelector((store) => store.Auth.role);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token   = localStorage.getItem(`${role}:token`);
  const findClass = classList.filter((item)=> item.className == bookData.class);
 
    const formData = new FormData();
    formData.append("name", bookData.bookName);
    formData.append("author", bookData.authorName);
    formData.append("classId", findClass[0]._id);
    formData.append("category", bookData.category);
    formData.append("copies", bookData.copies);
    if (bookData.bookImage) {
      formData.append("image", bookData.bookImage);
    }
    console.log(formData);
    try {
      const response = await fetch(`${baseUrl}/admin/add_book`, {
        method: "POST",
        headers: {
          Authentication: `${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add book");
      }

      const result = await response.json();
      toast.success("Book added successfully");
      onupdate()
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <div
      className="p-4 bg-gray-50 border rounded-lg overflow-auto"
      style={{ maxHeight: "90vh" }}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="image-upload-container">
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
        <FormInput
          id="category"
          label="Category"
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
