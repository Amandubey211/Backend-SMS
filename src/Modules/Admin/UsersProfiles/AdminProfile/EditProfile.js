import React, { useEffect, useState } from "react";
import ImageUpload from "../../Addmission/Components/ImageUpload";
import FormInput from "../../Accounting/subClass/component/FormInput";
import FormSelect from "../../Accounting/subClass/component/FormSelect";
import useEditAdmin from "../../../../Hooks/AuthHooks/Staff/Admin/staff/useEditAdmin";
// import useGetUserDetail from "../../../../Hooks/AuthHooks/Staff/useGetUserDetail";
import { useDispatch } from "react-redux";
import { fetchUserData, updateAdminProfile } from "../../../../Store/Slices/Common/User/actions/userActions";

const EditAdmin = ({data}) => {
  const [imagePreview, setImagePreview] = useState(data?.profile||null);
  const [loading,setLoading] = useState(false)
  const dispatch = useDispatch()
  const [adminData, setAdminData] = useState({
    _id:data?._id,
    adminName: data?.fullName,
    contactNumber: data?.mobileNumber,
    email: data?.email,
    profile: null,
  });
  useEffect(()=>{
    setImagePreview(data?.profile);
  },[])
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
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
      setAdminData((prev) => ({
        ...prev,
        profile: file,
      }));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };
  

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true)
      // Create FormData object
      const formData = new FormData();
      formData.append("_id", adminData._id);
      formData.append("adminName", adminData.adminName);
      formData.append("contactNumber", adminData.contactNumber);
      formData.append("email", adminData.email);
      if (adminData.profile) {
        formData.append("profile", adminData.profile); // Add the profile file
      }
    
      // Dispatch the action
    await   dispatch(updateAdminProfile({ data: formData }));
    setLoading(false)
    };

  return (
    <>
      <div className="p-4 h-full border rounded-lg">
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
              <FormInput id="adminName" label="Full Name" value={adminData.adminName} onChange={handleInputChange} />
              <FormInput id="email"  label="Email" type="email"   value={adminData.email} readOnly />
              <FormInput id="contactNumber" label="Contact" type="text" value={adminData.contactNumber} onChange={handleInputChange} />
            </div>
          </div>
          <button type="submit" disabled={loading}  className="bg-gradient-to-r w-[15rem] mx-10 from-pink-500 to-purple-500 text-white py-2 px-10 rounded-md hover:from-pink-600 hover:to-purple-600">
          {loading?'loading...':'Update Profile'}
        </button>
        </div>
       
      </form>
    </div>
    </>
  
  );
};

export default EditAdmin;
