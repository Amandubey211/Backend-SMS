import React, { useState } from "react";
import ImageUpload from "../../Addmission/Components/ImageUpload";
import FormInput from "../../Accounting/subClass/component/FormInput";
import FormSelect from "../../Accounting/subClass/component/FormSelect";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";

const AddTeacher = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [teacherData, setTeacherData] = useState({
    name: "",
    dob: "",
    religion: "",
    gender: "",
    category: "",
    salary: "",
    bloodGroup: "",
    phone: "",
    email: "",
    address: "",
    teacherImage: null,
    teacherCV: null,
  });

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const categoryOptions = [
    { value: "Science Teacher", label: "Science Teacher" },
    { value: "Mathematics Teacher", label: "Mathematics Teacher" },
  ];

  const religionOptions = [
    { value: "Islam", label: "Islam" },
    { value: "Christianity", label: "Christianity" },
    { value: "Hinduism", label: "Hinduism" },
    { value: "Other", label: "Other" },
  ];

  const bloodGroupOptions = [
    { value: "O+", label: "O+" },
    { value: "A+", label: "A+" },
    { value: "B+", label: "B+" },
    { value: "AB+", label: "AB+" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherData((prev) => ({
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
      setTeacherData((prev) => ({
        ...prev,
        teacherImage: file,
      }));
    }
  };
  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setTeacherData((prev) => ({
        ...prev,
        teacherCV: file,
      }));
    } else {
      alert("Please upload a PDF file.");
    }
  };
  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Teacher data to submit:", teacherData);
    // Implement submission logic here
  };

  return (
    
    <div
    className="p-4 bg-gray-50 h-full  border rounded-lg overflow-auto"
    style={{ maxHeight: "90vh" }}
  >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col  justify-around gap-5 ">
          <div className="flex flex-row justify-between p-4  border-b  border-gray-200  ">
            <div className="">
              <div className="image-upload-container">
                <ImageUpload
                  imagePreview={imagePreview}
                  handleImageChange={handleImageChange}
                  handleRemoveImage={handleRemoveImage}
                />
              </div>
            </div>
            <div className=" flex flex-col gap-3 ">
              <FormInput
                id="name"
                label="Name"
                value={teacherData.name}
                onChange={handleInputChange}
              />
              <FormInput
                id="dob"
                label="Date of Birth"
                type="date"
                value={teacherData.dob}
                onChange={handleInputChange}
              />
              <FormSelect
                id="religion"
                label="Religion"
                options={religionOptions}
                value={teacherData.religion}
                onChange={handleInputChange}
              />
              <FormSelect
                id="gender"
                label="Gender"
                options={genderOptions}
                value={teacherData.gender}
                onChange={handleInputChange}
              />
              <FormSelect
                id="category"
                label="Teacher Category"
                options={categoryOptions}
                value={teacherData.category}
                onChange={handleInputChange}
              />
            </div>
            <div className="  flex flex-col gap-3">
              <FormInput
                id="salary"
                label="Salary"
                type="number"
                value={teacherData.salary}
                onChange={handleInputChange}
              />
              <FormSelect
                id="bloodGroup"
                label="Blood Group"
                options={bloodGroupOptions}
                value={teacherData.bloodGroup}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <h1   className="font-medium underline">Address</h1>
          <div className="flex flex-col gap-5">
            <div className="flex  gap-5">
              <FormInput
                id="phone"
                label="Phone"
                value={teacherData.phone}
                onChange={handleInputChange}
              />
              <FormInput
                id="email"
                label="Email"
                value={teacherData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-[50%]"  >
              <FormInput
                id="address"
                label="Address"
                value={teacherData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-[50%] h-25 flex items-center p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
            <input
              type="file"
              accept=".pdf"
              onChange={handleCVUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-white file:text-gray-700
                hover:file:bg-gray-50"
            />
          </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-10 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          Add New Teacher
        </button>
      </form>
    </div>
   
  );
};

export default AddTeacher;
