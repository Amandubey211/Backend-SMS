import React, { useState } from "react";
import ImageUpload from "../../Addmission/Components/ImageUpload";
// import ImageUpload from "../../Addmission/Components/ImageUpload";
import FormInput from "../../Accounting/subClass/component/FormInput";
import FormSelect from "../../Accounting/subClass/component/FormSelect";
import Layout from '../../../../Components/Common/Layout';
import DashLayout from '../../../../Components/Admin/AdminDashLayout';


const AddLibraian = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [teacherData, setTeacherData] = useState({
    name: "",
    dob: "",
    gender: "",
    salary: "",
    phone: "",
    email: "",
    address: "",
    teacherImage: null,
  });

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
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

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Librian data to submit:", teacherData);
    // Implement submission logic here
  };

  return (
    
    <div
    className="p-4 bg-gray-50 h-full  border rounded-lg overflow-auto"
    style={{ maxHeight: "90vh" }}
  >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col  justify-around gap-5 ">
          <div className="flex flex-row justify-around p-2 border-b  border-gray-200  ">
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
                id="gender"
                label="Gender"
                options={genderOptions}
                value={teacherData.gender}
                onChange={handleInputChange}
              />
              <FormInput
                id="salary"
                label="Salary"
                type="number"
                value={teacherData.salary}
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

            <div className=""  >
              <FormInput
                id="address"
                label="Address"
                value={teacherData.address}
                onChange={handleInputChange}
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

export default AddLibraian;
