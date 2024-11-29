import React, { useEffect, useState } from "react";
import ImageUpload from "../../Addmission/Components/ImageUpload";
import FormInput from "../../Accounting/subClass/component/FormInput";
import { useDispatch } from "react-redux";
import { updateParent } from "../../../../Store/Slices/Admin/Users/Parents/parent.action";

const UpdateParent = ({data,handleUpdateSidebarClose}) => {
    
  const [imagePreview, setImagePreview] = useState(null);
const [loading,setLoading] =useState(false)
  const [parentData, setParentData] = useState({
    id:'',
    fatherName:'',
    motherName:"",
    guardianContactNumber:'',
    guardianEmail: "",
    profile:null,
    guardianRelationToStudent:'',
    guardianName:'',
    active:true
  });
  useEffect(()=>{
    // console.log(data);
    
setParentData({
    id:data?._id,
    fatherName:data?.fatherName,
    motherName:data?.motherName,
    guardianContactNumber: data?.phone,
    guardianEmail:data?.email,
    profile:data?.fatherImageUrl,
    guardianRelationToStudent:data?.guardianRelationToStudent,
    guardianName:data?.guardianName,
    active:true})
  },[data]);
 
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
const dispatch = useDispatch();
  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData();
    Object.keys(parentData).forEach((key) => formData.append(key, parentData[key]));
  
    await dispatch(updateParent({ data: formData }));
    setLoading(false)
    handleUpdateSidebarClose();
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
           
          </div>
          <h1   className="font-medium underline">Information</h1>
          <div className="flex flex-col gap-5">
            <div className="flex  gap-5">
              <FormInput
                id="guardianContactNumber"
                label="Mobile Number"
                value={parentData.guardianContactNumber}
                onChange={handleInputChange}
                required
              />
              <FormInput
                id="guardianEmail"
                label="Email"
                value={parentData.guardianEmail}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className=" flex  gap-5  ">
              <FormInput
                id="fatherName"
                label="Father Name"
                value={parentData.fatherName}
                onChange={handleInputChange}
                required
              />
                <FormInput
                id="motherName"
                label="Mother Name"
                value={parentData.motherName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex  gap-5  ">
              <FormInput
                id="guardianRelationToStudent"
                label="Relation To Student"
                name="guardianRelationToStudent"
                value={parentData.guardianRelationToStudent}
                onChange={handleInputChange}
                required
              />
              <FormInput
                id="guardianName"
                label="Guardian Name"
                name="guardianName"
                value={parentData.guardianName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <button
        disabled={loading}
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-10 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          {loading?'Loading...':'Update'}
        </button>
      </form>
    </div>
   
  );
};

export default UpdateParent;
