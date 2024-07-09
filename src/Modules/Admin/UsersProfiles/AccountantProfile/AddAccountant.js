import React, { useState } from "react";
import ImageUpload from "../../Addmission/Components/ImageUpload";
import FormInput from "../../Accounting/subClass/component/FormInput";
import FormSelect from "../../Accounting/subClass/component/FormSelect";

const AddAccountant = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [accountantData, setAccountantData] = useState({
    name: "",
    dob: "",
    gender: "",
    salary: "",
    phone: "",
    email: "",
    address: "",
    accountantImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountantData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setAccountantData((prev) => ({
        ...prev,
        accountantImage: file,
      }));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Accountant data to submit:", accountantData);
    // Implement submission logic here
  };

  return (
    <>
      <div className="p-4 bg-gray-50 h-full border rounded-lg overflow-auto">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-around gap-5">
          <div className="flex flex-row justify-around p-2 border-b border-gray-200">
            <div>
              <ImageUpload
                imagePreview={imagePreview}
                handleImageChange={handleImageChange}
                handleRemoveImage={handleRemoveImage}
              />
            </div>
            <div className="flex flex-col gap-3">
              <FormInput id="name" label="Name" value={accountantData.name} onChange={handleInputChange} />
              <FormInput id="dob" label="Date of Birth" type="date" value={accountantData.dob} onChange={handleInputChange} />
              <FormSelect id="gender" label="Gender" options={genderOptions} value={accountantData.gender} onChange={handleInputChange} />
              <FormInput id="salary" label="Salary" type="number" value={accountantData.salary} onChange={handleInputChange} />
            </div>
          </div>
          <h1 className="font-medium underline">Contact Information</h1>
          <div className="flex flex-col gap-5">
            <FormInput id="phone" label="Phone" value={accountantData.phone} onChange={handleInputChange} />
            <FormInput id="email" label="Email" value={accountantData.email} onChange={handleInputChange} />
            <FormInput id="address" label="Address" value={accountantData.address} onChange={handleInputChange} />
          </div>
        </div>
        <button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-10 rounded-md hover:from-pink-600 hover:to-purple-600">
          Add New Staff
        </button>
      </form>
    </div>
    </>
  
  );
};

export default AddAccountant;
