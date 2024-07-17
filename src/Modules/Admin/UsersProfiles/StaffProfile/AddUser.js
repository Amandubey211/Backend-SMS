import React, { useState } from "react";
import ImageUpload from "../../Addmission/Components/ImageUpload";
import FormInput from "../../Accounting/subClass/component/FormInput";
import FormSelect from "../../Accounting/subClass/component/FormSelect";
import useAddUser from "../../../../Hooks/AuthHooks/Staff/Admin/staff/useAddUser";
import useGetAllTeachers from "../../../../Hooks/AuthHooks/Staff/Admin/Teacher/useGetAllTeacher";

const AddUser = ({ role }) => {
  console.log(role);
  const [imagePreview, setImagePreview] = useState(null);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const [teacherData, setTeacherData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    religion: "",
    gender: "",
    position: "",
    monthlySalary: "",
    bloodGroup: "",
    mobileNumber: "",
    email: "",
    profile: null,
    teacherCV: null,
    employeeID: '',
    role: role
  });

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
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

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
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
        profile: file,
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

  const { fetchTeachers } = useGetAllTeachers();
  const { addUser, error, loading } = useAddUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(teacherData).forEach(key => {
      formData.append(key, teacherData[key]);
    });
    formData.append('address', JSON.stringify(address)); // Add address as a JSON string

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    await addUser(formData);
    if (!error) {
      fetchTeachers();
    }
  };

  return (
    <div className="p-4 bg-gray-50 h-full border rounded-lg overflow-auto" style={{ maxHeight: "90vh" }}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-around gap-5">
          <div className="flex flex-row justify-between p-4 border-b border-gray-200">
            <div>
              <div className="image-upload-container">
                <ImageUpload
                  imagePreview={imagePreview}
                  handleImageChange={handleImageChange}
                  handleRemoveImage={handleRemoveImage}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <FormInput
                id="firstName"
                label="First Name"
                name="firstName"
                value={teacherData.firstName}
                onChange={handleInputChange}
              />
              <FormInput
                id="lastName"
                label="Last Name"
                name="lastName"
                value={teacherData.lastName}
                onChange={handleInputChange}
              />
              <FormInput
                id="dob"
                label="Date of Birth"
                type="date"
                name="dob"
                value={teacherData.dob}
                onChange={handleInputChange}
              />
              <FormSelect
                id="religion"
                label="Religion"
                options={religionOptions}
                name="religion"
                value={teacherData.religion}
                onChange={handleInputChange}
              />
              <FormSelect
                id="gender"
                label="Gender"
                options={genderOptions}
                name="gender"
                value={teacherData.gender}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-3">
              <FormInput
                id="monthlySalary"
                label="Monthly Salary"
                type="number"
                name="monthlySalary"
                value={teacherData.monthlySalary}
                onChange={handleInputChange}
              />
              <FormInput
                id="employeeID"
                label="Employee ID"
                name="employeeID"
                value={teacherData.employeeID}
                onChange={handleInputChange}
              />
              <FormSelect
                id="bloodGroup"
                label="Blood Group"
                options={bloodGroupOptions}
                name="bloodGroup"
                value={teacherData.bloodGroup}
                onChange={handleInputChange}
              />
              <FormInput
                id="position"
                label="Position"
                name="position"
                value={teacherData.position}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <h1 className="font-medium underline">Address</h1>
          <div className="flex flex-col gap-5">
            <div className="flex gap-5">
              <FormInput
                id="mobileNumber"
                label="Mobile Number"
                name="mobileNumber"
                value={teacherData.mobileNumber}
                onChange={handleInputChange}
              />
              <FormInput
                id="email"
                label="Email"
                name="email"
                value={teacherData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex gap-5">
                <FormInput
                  id="country"
                  label="Country"
                  name="country"
                  value={address.country}
                  onChange={handleAddressInputChange}
                />
                <FormInput
                  id="state"
                  label="State"
                  name="state"
                  value={address.state}
                  onChange={handleAddressInputChange}
                />
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex gap-5">
                <FormInput
                  id="city"
                  label="City"
                  name="city"
                  value={address.city}
                  onChange={handleAddressInputChange}
                />
                <FormInput
                  id="postalCode"
                  label="Postal Code"
                  name="postalCode"
                  value={address.postalCode}
                  onChange={handleAddressInputChange}
                />
              </div>
            </div>
            <div className="w-[50%]">
              <FormInput
                id="street"
                label="Street"
                name="street"
                value={address.street}
                onChange={handleAddressInputChange}
              />
            </div>
            <div className="w-[50%] h-25 flex items-center p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
              <input
                type="file"
                accept=".pdf"
                onChange={handleCVUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white file:text-gray-700 hover:file:bg-gray-50"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-10 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          Add New Staff
        </button>
      </form>
    </div>
  );
};

export default AddUser;
