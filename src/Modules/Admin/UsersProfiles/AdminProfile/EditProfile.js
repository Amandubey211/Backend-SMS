import React, { useState } from "react";
import ImageUpload from "../../Addmission/Components/ImageUpload";
import FormInput from "../../Accounting/subClass/component/FormInput";
import FormSelect from "../../Accounting/subClass/component/FormSelect";
import useEditAdmin from "../../../../Hooks/AuthHooks/Staff/Admin/staff/useEditAdmin";
import useGetUserDetail from "../../../../Hooks/AuthHooks/Staff/useGetUserDetail";

const EditAdmin = ({data}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [adminData, setAdminData] = useState({
    adminName: data.adminName,
    contactNumber: data.contactNumber,
    email: data.email,
    profile: null,
  });

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
  const  {userDetail} = useGetUserDetail();
const {EditAdmin} = useEditAdmin()
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("admin data to submit:", adminData);
  await  EditAdmin(adminData);
  userDetail()
  };
  return (
    <>
      <div className="p-4 bg-gray-50 h-full border rounded-lg">
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
              <FormInput id="email"  label="Email" type="email" value={adminData.email} onChange={handleInputChange} />
              <FormInput id="contactNumber" label="Contact" type="number" value={adminData.contactNumber} onChange={handleInputChange} />
            </div>
          </div>
        </div>
        <button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-10 rounded-md hover:from-pink-600 hover:to-purple-600">
          Update Profile
        </button>
      </form>
    </div>
    </>
  
  );
};

export default EditAdmin;
