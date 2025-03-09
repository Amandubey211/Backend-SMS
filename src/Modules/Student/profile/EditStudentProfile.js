// EditStudentProfile.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
// Import your thunk action for updating the profile
// import { updateStudentProfileThunk } from "../../../Store/Slices/Common/User/actions/userActions";

const EditStudentProfile = ({ data, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Initialize form data with existing user details
  const [formData, setFormData] = useState({
    fullName: data?.fullName || "",
    mobileNumber: data?.mobileNumber || "",
    email: data?.email || "",
    dateOfBirth: data?.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
    admissionNumber: data?.admissionNumber || "",
    Q_Id: data?.Q_Id || "",
    sectionName: data?.sectionName || "",
    className: data?.className || "",
  });

  // Sync form state if the data prop changes
  useEffect(() => {
    if (data) {
      setFormData({
        fullName: data.fullName || "",
        mobileNumber: data.mobileNumber || "",
        email: data.email || "",
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
        admissionNumber: data.admissionNumber || "",
        Q_Id: data.Q_Id || "",
        sectionName: data.sectionName || "",
        className: data.className || "",
      });
    }
  }, [data]);

  // Handle input changes for controlled fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to update profile details
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Dispatch the update profile action
    //   await dispatch(updateStudentProfileThunk(formData));
      toast.success("Profile updated successfully!");
      if (onClose) onClose();
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Cancel and close the sidebar without saving changes
  const handleCancel = () => {
    if (onClose) onClose();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Editable Fields */}
        <div className="flex flex-col">
          <label className="mb-1 text-gray-600">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Enter your full name"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-gray-600">Contact Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Enter your contact number"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Enter your email"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-gray-600">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
        </div>

        {/* Read-only Fields */}
        <div className="flex flex-col">
          <label className="mb-1 text-gray-600">Admission Number</label>
          <input
            type="text"
            name="admissionNumber"
            value={formData.admissionNumber}
            disabled
            className="border p-2 rounded bg-gray-100"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-gray-600">QID</label>
          <input
            type="text"
            name="Q_Id"
            value={formData.Q_Id}
            disabled
            className="border p-2 rounded bg-gray-100"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-gray-600">Section</label>
          <input
            type="text"
            name="sectionName"
            value={formData.sectionName}
            disabled
            className="border p-2 rounded bg-gray-100"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-gray-600">Class</label>
          <input
            type="text"
            name="className"
            value={formData.className}
            disabled
            className="border p-2 rounded bg-gray-100"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-transparent text-md font-medium shadow-sm bg-gray-200 text-black rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent text-md font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudentProfile;
