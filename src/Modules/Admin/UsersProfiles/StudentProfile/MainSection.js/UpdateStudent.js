import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ImageUpload from "../../../Addmission/Components/ImageUpload";
import FormInput from "../../../Accounting/subClass/component/FormInput";
import FormSelect from "../../../Accounting/subClass/component/FormSelect";
import { updateStudents } from "../../../../../Store/Slices/Admin/Users/Students/student.action";

const UpdateStudent = ({ data, handleUpdateSidebarClose }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    profile: null,
    dateOfBirth: '',
    admissionNumber: '',
    Q_Id: '',
    transportRequirement: '',
    permanentAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    residentialAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    active: true,
  });

  useEffect(() => {
    if (data) {
      setStudentData({
        id: data._id,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        contactNumber: data.contactNumber || '',
        email: data.email || '',
        profile: data.profile || null,
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth?.slice(0, 10) : '',
        admissionNumber: data.admissionNumber || '',
        Q_Id: data.Q_Id || '',
        transportRequirement: data.transportRequirement || '',
        permanentAddress: { ...data.permanentAddress },
        residentialAddress: { ...data.residentialAddress },
        active: true,
      });
    }
  }, [data]);

  const handleAddressChange = (e, addressType) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [name]: value,
      },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({
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
      setStudentData((prev) => ({
        ...prev,
        profile: file,
      }));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();

    Object.keys(studentData).forEach((key) => {
        if (typeof studentData[key] === 'object' && studentData[key] !== null) {
            // Serialize objects into JSON strings
            formData.append(key, JSON.stringify(studentData[key]));
        } else {
            // Append other values directly
            formData.append(key, studentData[key]);
        }
    });
        await dispatch(updateStudents({ data: formData }));
        setLoading(false);
        handleUpdateSidebarClose();
   
};

  

  return (<></>
    // <div className="p-4 bg-gray-50 h-full border rounded-lg overflow-auto" style={{ maxHeight: "90vh" }}>
    //   <form className="space-y-4" onSubmit={handleSubmit}>
    //     <div className="flex flex-col justify-around gap-5">
    //       {/* Profile and Basic Info */}
    //       <div className="flex flex-row justify-between p-1 border-b border-gray-200 gap-4">
    //         <div className="mt-10">
    //           <ImageUpload imagePreview={imagePreview} handleImageChange={handleImageChange} handleRemoveImage={handleRemoveImage} />
    //         </div>
    //         <div className="flex flex-col gap-5">
    //           {/* Contact Info */}
    //           <div className="flex gap-5">
    //             <FormInput id="contactNumber" label="Mobile Number" value={studentData.contactNumber} onChange={handleInputChange} required />
    //             <FormInput id="email" label="Email" value={studentData.email} onChange={handleInputChange} required />
    //           </div>
    //           {/* Name Info */}
    //           <div className="flex gap-5">
    //             <FormInput id="firstName" label="First Name" value={studentData.firstName} onChange={handleInputChange} required />
    //             <FormInput id="lastName" label="Last Name" value={studentData.lastName} onChange={handleInputChange} required />
    //           </div>
    //           {/* Admission Info */}
    //           <div className="flex gap-5">
    //             <FormInput id="admissionNumber" label="Admission Number" name="admissionNumber" value={studentData.admissionNumber} onChange={handleInputChange} required />
    //             <FormInput id="Q_Id" label="QID" name="Q_Id" value={studentData.Q_Id} onChange={handleInputChange} required />
    //           </div>
    //           {/* Transport and DOB */}
    //           <div className="flex gap-5">
    //             <FormSelect id="transportRequirement" label="Transport" name="transportRequirement" value={studentData.transportRequirement} onChange={handleInputChange} options={[{ value: true, label: "Yes" }, { value: false, label: "No" }]} required />
    //             <FormInput id="dateOfBirth" type="date" label="Date Of Birth" name="dateOfBirth" value={studentData.dateOfBirth} onChange={handleInputChange} required />
    //           </div>
    //         </div>
    //       </div>

    //       {/* Address Inputs */}
    //       {/* Permanent Address */}
    //       <div>
    //         <h2 className="font-medium underline">Permanent Address</h2>
    //         <div className="grid grid-cols-2 gap-4">
    //           <FormInput id="street"  label="Street" value={studentData.permanentAddress.street} name="street" onChange={(e) => handleAddressChange(e, "permanentAddress")} />
    //           <FormInput id="city"  label="City" value={studentData.permanentAddress.city} name="city" onChange={(e) => handleAddressChange(e, "permanentAddress")} />
    //           <FormInput id="state"  label="State" value={studentData.permanentAddress.state} name="state" onChange={(e) => handleAddressChange(e, "permanentAddress")} />
    //           <FormInput id="postalCode"  label="Postal Code" value={studentData.permanentAddress.postalCode} name="postalCode" onChange={(e) => handleAddressChange(e, "permanentAddress")} />
    //           <FormInput id="country" label="Country" value={studentData.permanentAddress.country} name="country" onChange={(e) => handleAddressChange(e, "permanentAddress")} />
    //         </div>
    //       </div>

    //       {/* Residential Address */}
    //       <div>
    //         <h2 className="font-medium underline">Residential Address</h2>
    //         <div className="grid grid-cols-2 gap-4">
    //           <FormInput id="street"  label="Street" value={studentData.residentialAddress.street} name="street" onChange={(e) => handleAddressChange(e, "residentialAddress")} />
    //           <FormInput id="city"  label="City" value={studentData.residentialAddress.city} name="city" onChange={(e) => handleAddressChange(e, "residentialAddress")} />
    //           <FormInput id="state"  label="State" value={studentData.residentialAddress.state} name="state" onChange={(e) => handleAddressChange(e, "residentialAddress")} />
    //           <FormInput id="postalCode"  label="Postal Code" value={studentData.residentialAddress.postalCode} name="postalCode" onChange={(e) => handleAddressChange(e, "residentialAddress")} />
    //           <FormInput id="country"  label="Country" value={studentData.residentialAddress.country} name="country" onChange={(e) => handleAddressChange(e, "residentialAddress")} />
    //         </div>
    //       </div>
    //     </div>

    //     {/* Submit Button */}
    //     <div className="flex justify-center">
    //       <button type="submit" className="bg-purple-400 text-white px-4 py-2 rounded">
    //         {loading ? "Updating..." : "Update"}
    //       </button>
    //     </div>
    //   </form>
    // </div>
  );
};

export default UpdateStudent;
