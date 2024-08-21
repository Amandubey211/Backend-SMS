import React, { useEffect, useState } from "react";
import useGetUserDetail from "../../Hooks/AuthHooks/Staff/useGetUserDetail";
import FormInput from "../../Modules/Admin/Accounting/subClass/component/FormInput";
import ImageUpload from "../../Modules/Admin/Addmission/Components/ImageUpload";

const EditParentProfile = ({ data }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [parentData, setParentData] = useState({
    fatherName: data.fatherName || "",
    motherName: data.motherName || "",
    guardianName: data.guardianName || "",
    email: data.guardianEmail || "",
    profile: null,
  });

  useEffect(() => {
    if (data) {
      setParentData({
        fatherName: data.fatherName || "",
        motherName: data.motherName || "",
        guardianName: data.guardianName || "",
        email: data.guardianEmail || "",
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParentData((prev) => ({
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
      setParentData((prev) => ({
        ...prev,
        profile: file,
      }));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  const { userDetail } = useGetUserDetail();
 // const { editParentProfile } = useEditParentProfile();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Parent data to submit:", parentData);
    // await editParentProfile(parentData);
    // userDetail(); // Refresh user details after updating profile
  };

  return (
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
              <FormInput id="fatherName" label="Father's Name" value={parentData.fatherName} onChange={handleInputChange} />
              <FormInput id="motherName" label="Mother's Name" value={parentData.motherName} onChange={handleInputChange} />
              <FormInput id="guardianName" label="Guardian's Name" value={parentData.guardianName} onChange={handleInputChange} />
              <FormInput id="email" label="Email" type="email" value={parentData.email} readOnly />
            </div>
          </div>
        </div>
        <button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-10 rounded-md hover:from-pink-600 hover:to-purple-600">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditParentProfile;
