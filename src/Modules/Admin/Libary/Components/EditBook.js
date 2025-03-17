// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { updateBookThunk } from "../../../../Store/Slices/Admin/Library/LibraryThunks";
// import FormInput from "../../Accounting/subClass/component/FormInput";
// import FormSelect from "../../Accounting/subClass/component/FormSelect";
// import ImageUpload from "./ImageUpload";
// import { Select } from "antd";
// import { useTranslation } from "react-i18next";
// const { Option } = Select;

// const EditBook = ({ book, onClose }) => {
//   const { t } = useTranslation("admLibrary");
//   const dispatch = useDispatch();
//   const classList = useSelector((state) => state.admin.class.classes);
//   const categoriesList = useSelector((state) => state.admin.library.categories);

//   const [imagePreview, setImagePreview] = useState(null);
//   const [bookData, setBookData] = useState({
//     bookName: "",
//     authorName: "",
//     class: "",
//     categories: [],
//     copies: 0,
//     bookImage: null,
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (book) {
//       let selectedClassId = book?.classId?._id || "";
//       if (!selectedClassId && book.className && classList?.length > 0) {
//         const foundClass = classList.find(
//           (cls) => cls.className === book.className
//         );
//         selectedClassId = foundClass ? foundClass._id : "";
//       }
//       setBookData({
//         bookName: book?.name || "",
//         authorName: book?.author || "",
//         class: selectedClassId,
//         categories: book?.categories || [],
//         copies: book?.copies || 0,
//         bookImage: null,
//       });
//       if (book?.image) {
//         setImagePreview(book.image);
//       }
//     }
//   }, [book, classList]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setBookData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//       setBookData((prev) => ({ ...prev, bookImage: file }));
//     }
//   };

//   const handleRemoveImage = () => {
//     setImagePreview(null);
//     setBookData((prev) => ({ ...prev, bookImage: null }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!bookData.bookName) newErrors.bookName = t("Book name is required.");
//     if (!bookData.authorName)
//       newErrors.authorName = t("Author name is required.");
//     if (!bookData.class) newErrors.class = t("Class selection is required.");
//     if (!bookData.categories || bookData.categories.length === 0)
//       newErrors.categories = t("Category is required.");
//     if (bookData.copies < 1) newErrors.copies = t("Copies must be at least 1.");
//     return newErrors;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     const formData = new FormData();
//     formData.append("name", bookData.bookName);
//     formData.append("author", bookData.authorName);
//     formData.append("classId", bookData.class);
//     bookData.categories.forEach((catId) => {
//       formData.append("categories", catId);
//     });
//     formData.append("copies", bookData.copies);
//     if (bookData.bookImage) {
//       formData.append("image", bookData.bookImage);
//     }
//     dispatch(updateBookThunk({ bookId: book._id, formData })).then(() => {
//       onClose();
//     });
//   };

//   return (
//     <form
//       className="flex flex-col h-full"
//       onSubmit={handleSubmit}
//       style={{ maxHeight: "97vh" }}
//     >
//       <div className="flex-1 overflow-auto mb-8 no-scrollbar">
//         <ImageUpload
//           imagePreview={imagePreview}
//           handleImageChange={handleImageChange}
//           handleRemoveImage={handleRemoveImage}
//         />
//         <div className="px-5">
//           <FormInput
//             id="bookName"
//             label={t("Book Name")}
//             name="bookName"
//             value={bookData.bookName}
//             onChange={handleInputChange}
//             error={errors.bookName}
//           />
//           <FormInput
//             id="authorName"
//             label={t("Author Name")}
//             name="authorName"
//             value={bookData.authorName}
//             onChange={handleInputChange}
//             error={errors.authorName}
//           />
//           <FormSelect
//             id="class"
//             label={t("Select Class")}
//             name="class"
//             options={classList?.map((cls) => ({
//               value: cls._id,
//               label: cls.className,
//             }))}
//             value={bookData.class || ""}
//             onChange={(value) =>
//               setBookData((prev) => ({ ...prev, class: value }))
//             }
//             error={errors.class}
//           />
//           <div className="my-4">
//             <label className="block text-sm font-medium text-gray-700">
//               {t("Category")}
//             </label>
//             <Select
//               mode="multiple"
//               placeholder={t("Select categories")}
//               value={bookData.categories}
//               onChange={(value) =>
//                 setBookData((prev) => ({ ...prev, categories: value }))
//               }
//               style={{ width: "100%" }}
//               allowClear
//             >
//               {categoriesList?.map((cat) => (
//                 <Option key={cat._id} value={cat._id}>
//                   {cat.name}
//                 </Option>
//               ))}
//             </Select>
//             {errors.categories && (
//               <p className="text-red-500 text-xs">{errors.categories}</p>
//             )}
//           </div>
//           <FormInput
//             id="copies"
//             label={t("Copies")}
//             name="copies"
//             type="number"
//             value={bookData.copies}
//             onChange={handleInputChange}
//             error={errors.copies}
//           />
//         </div>
//       </div>
//       <div className="sticky bottom-0 w-full bg-white pb-3">
//         <button
//           type="submit"
//           className="w-full p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md"
//         >
//           {t("Edit Book")}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default EditBook;
