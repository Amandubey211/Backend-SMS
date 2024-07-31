import React, { useEffect, useState } from "react";
import ImageUpload from "../../../Addmission/Components/ImageUpload";
import FormInput from "../../../Accounting/subClass/component/FormInput";
import FormSelect from "../../../Accounting/subClass/component/FormSelect";
import { useSelector } from "react-redux";
import useGetAllClasses from "../../../../../Hooks/AuthHooks/Staff/Admin/Class/useGetAllClasses";
import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";
import Library from "../../MainSection/Libary";
const EditBook = ({ data ,onupdate}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const { classList } = useSelector((store) => store.Class);
  const [bookData, setBookData] = useState({
    bookName: '',
    authorName: '',
    class: '',
    category: '',
    copies: 0,
    bookImage: null,
  });

  useEffect(() => {
    setBookData({
      bookName: data?.title || '',
      authorName: data?.author || '',
      class: data?.classLevel || '',
      category: data?.category || '',
      copies: data?.copies || 0,
      bookImage: null,
    });
  }, [data]);

  const classOptions = classList.map((item) => ({
    value: item.className,
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
  const role = useSelector((store) => store.Auth.role);
  const token   = localStorage.getItem(`${role}:token`);
  const { fetchClasses } = useGetAllClasses();

  useEffect(() => {
    fetchClasses();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      try {
        const response = await fetch(`${baseUrl}/admin/update/book/${data.id}`, {
          method: "PUT",
          headers: {
            Authentication: `${token}`,
          },
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error("Failed to edit book");
        }
  
        const result = await response.json();
        toast.success('Book edit successfully');
        onupdate()
   
        
      } catch (error) {
        console.error("Error edit book:", error);
        toast.error(error.message || "Failed edit book. Please try again.");
      }
     
  };

  return (
    <div className="p-4 bg-gray-50 border rounded-lg overflow-auto" style={{ maxHeight: "90vh" }}>
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
          name="bookName"
          value={bookData.bookName}
          onChange={handleInputChange}
        />
        <FormInput
          id="authorName"
          label="Author Name"
          name="authorName"
          value={bookData.authorName}
          onChange={handleInputChange}
        />
        <FormSelect
          id="class"
          label="Select Class"
          name="class"
          options={classOptions}
          value={bookData.class}
          onChange={handleInputChange}
        />
        <FormInput
          id="category"
          label="Category"
          name="category"
          value={bookData.category}
          onChange={handleInputChange}
        />
        <FormInput
          id="copies"
          label="Copies"
          name="copies"
          type="number"
          value={bookData.copies}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="w-full mt-4 p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          Edit Book
        </button>
      </form>
    </div>
  );
};

export default EditBook;
