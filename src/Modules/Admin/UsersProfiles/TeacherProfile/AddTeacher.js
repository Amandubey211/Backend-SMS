import React, { useState } from "react";
import ImageUpload from "../../Addmission/Components/ImageUpload";
import FormInput from "../../Accounting/subClass/component/FormInput";
import FormSelect from "../../Accounting/subClass/component/FormSelect";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";

const AddTeacher = ({role}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  })
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
    profile:null,
    teacherCV: null,
    employeeID:'',
    address:null,
    role:''
  });
 

  // firstName, lastName, email, mobileNumber, address, role, position,
  // department, subjects, dob, gender, employeeID, emergencyContact,
  // dateOfJoining, qualifications, previousExperience, classIds, monthlymonthlySalary
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
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
  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name,value);
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
const {addUser,error,loading} = useAddUser()
  const handleSubmit = async(e) => {
    e.preventDefault();
   teacherData.address=address;
   teacherData.role = role
    console.log("Teacher data to submit:", teacherData);
  //  await addUser(teacherData);
  

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
                id="firstName"
                label="Fisrt Name"
                value={teacherData.fisrtName}
                onChange={handleInputChange}
              />
              <FormInput
                id="lastName"
                label="Last Name"
                value={teacherData.lastName}
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
                id="position"
                label="Teacher Category"
                options={categoryOptions}
                value={teacherData.position}
                onChange={handleInputChange}
              />
            </div>
            <div className="  flex flex-col gap-3">
              <FormInput
                id="monthlySalary"
                label="Monthly Salary"
                type="number"
                name='monthlySalary'
                value={teacherData.monthlySalary}
                onChange={handleInputChange}
              />
              <FormInput
                id="employeeID"
                label="employeeID"
                name="employeeID"
                value={teacherData.employeeID}
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
                id="mobileNumber"
                label="Mobile Number"
                value={teacherData.mobileNumber}
                onChange={handleInputChange}
              />
              <FormInput
                id="email"
                label="Email"
                value={teacherData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col gap-5"  >
            <div className="flex  gap-5">
                  <FormInput
                id="country"
                label="Country"
                value={address.country}
                onChange={handleAddressInputChange}
              />
                  <FormInput
                id="state"
                label="State"
                value={address.state}
                onChange={handleAddressInputChange}
              />
            </div>
          
            </div>
            <div className="flex flex-col gap-5"  >
            <div className="flex  gap-5">
                  <FormInput
                id="city"
                label="City"
                value={address.city}
                onChange={handleAddressInputChange}
              />
                  <FormInput
                id="postalCode"
                label="Postal Code"
                value={address.postalCode}
                onChange={handleAddressInputChange}
              />
            </div>
          
            </div>
            <div className="w-[50%]"  >
           
                  <FormInput
                id="street"
                label="Street"
                value={address.street}
                onChange={handleAddressInputChange}
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
