import React, { useEffect, useState } from "react";
import ImageUpload from "../../Addmission/Components/ImageUpload";
import FormInput from "../../Accounting/subClass/component/FormInput";
import FormSelect from "../../Accounting/subClass/component/FormSelect";
import { FiLoader } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addUser ,editUser} from "../../../../Store/Slices/Admin/Users/Staff/staff.action";

const AddUser = ({ role ,data}) => {
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
    role: role,
    active:true
  });
  useEffect(()=>{
   if(data){
    setTeacherData({
      firstName:  data?.firstName ,
      lastName:  data?.lastName ,
      dob:  data?.dob ,
      religion:  data?.religion ,
      gender:  data?.gender,
      position:  data?.position ,
      monthlySalary:  data?.monthlySalary ,
      bloodGroup:  data?.bloodGroup ,
      mobileNumber: data?.mobileNumber ,
      email: data?.email ,
      profile:null,
      teacherCV:null,
      employeeID: data?.employeeID ,
      role: role
    });
    setAddress(data?.address)
   }
   return () => {
    setTeacherData({
      firstName: "",
      lastName: "",
      dob: "",
      religion: "",
      gender: "",
      position: "",
      monthlySalary: "",
      bloodGroup: "",
      mobileNumber:"",
      email:"",
      profile:null,
      teacherCV:null,
      employeeID:'',
      role: role
    })
    setAddress({
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    })
  };
  },[data])
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

  const {loading,error}  = useSelector((store)=>store.admin.all_staff)
   const dispatch = useDispatch()
  const handleSubmit = (e) => {
    e.preventDefault();
    teacherData.role = role
     dispatch(addUser({userData:teacherData,address}));

  };
  const editUserHandel = ()=>{
   dispatch(editUser({userData:teacherData,address,id:data?._id}))
  }

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
                required={true}
              />
              <FormInput
                id="lastName"
                label="Last Name"
                name="lastName"
                value={teacherData.lastName}
                onChange={handleInputChange}
                required={true}
              />
              <FormInput
                id="dob"
                label="Date of Birth"
                type="date"
                name="dob"
                value={teacherData.dob}
                onChange={handleInputChange}
                required={true}
              />
              <FormSelect
                id="religion"
                label="Religion"
                options={religionOptions}
                name="religion"
                value={teacherData.religion}
                onChange={handleInputChange}
                required={true}
              />
              <FormSelect
                id="gender"
                label="Gender"
                options={genderOptions}
                name="gender"
                value={teacherData.gender}
                onChange={handleInputChange}
                required={true}
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
                required={true}
              />
              <FormInput
                id="employeeID"
                label="Employee ID"
                name="employeeID"
                value={teacherData.employeeID}
                onChange={handleInputChange}
                required={true}
              />
              <FormSelect
                id="bloodGroup"
                label="Blood Group"
                options={bloodGroupOptions}
                name="bloodGroup"
                value={teacherData.bloodGroup}
                onChange={handleInputChange}
                required={true}
              />
              <FormInput
                id="position"
                label="Position"
                name="position"
                value={teacherData.position}
                onChange={handleInputChange}
                required={true}
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
                required={true}
              />
              <FormInput
                id="email"
                label="Email"
                name="email"
                value={teacherData.email}
                onChange={handleInputChange}
                required={true}
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
                  required={true}
                />
                <FormInput
                  id="state"
                  label="State"
                  name="state"
                  value={address.state}
                  onChange={handleAddressInputChange}
                  required={true}
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
                  required={true}
                />
                <FormInput
                  id="postalCode"
                  label="Postal Code"
                  name="postalCode"
                  value={address.postalCode}
                  onChange={handleAddressInputChange}
                  required={true}
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
                required={true}
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
       {data? <div
          disabled={loading}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-10 rounded-md hover:from-pink-600 hover:to-purple-600 cursor-pointer w-[11rem]"
          onClick={editUserHandel}
        >
          {loading?<FiLoader className="animate-spin  w-[1rem] h-[1rem] ml-10 " />  :'Update User'}
        </div>:
        <button
        disabled={loading}
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-10 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
        {loading? <FiLoader className="animate-spin  w-[1rem] h-[1rem] ml-10 " />  :'Add New User'}
        </button>}
      </form>
    </div>
  );
};

export default AddUser;
