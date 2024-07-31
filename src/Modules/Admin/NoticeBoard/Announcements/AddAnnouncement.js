import React, { useState } from "react";
import FormInput from "../../Accounting/subClass/component/FormInput";
import { baseUrl } from "../../../../config/Common";
import { useSelector } from "react-redux";

const AddAnnouncement = ({ onSuccess, onClose }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [noticeData, setNoticeData] = useState({
    noticeTitle: "",
    startDate: "",
    endDate: "",
    noticeDetails: "",
    noticePriority: "High priority",
    notice: null,
  });
  const role = useSelector((store) => store.Auth.role);
  const [selectedStatus, setSelectedStatus] = useState("High priority");
  const token = localStorage.getItem(`${role}:token`);

  // Handle input changes for all fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNoticeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setNoticeData((prev) => ({
      ...prev,
      notice: null,
    }));
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setNoticeData((prev) => ({
      ...prev,
      noticePriority: status,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      title: noticeData.noticeTitle,
      startDate: noticeData.startDate,
      endDate: noticeData.endDate,
      description: noticeData.noticeDetails,
      priority: noticeData.noticePriority,
    };

    try {
      const response = await fetch(`${baseUrl}/admin/create_notice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: `${token}`,
        },
        body: JSON.stringify(postData),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("Event data submitted successfully:", responseData);
        onSuccess(); // Trigger success action
        onClose(); // Close the sidebar
      } else {
        console.error("Failed to submit event data:", responseData);
      }
    } catch (error) {
      console.error("Error submitting event data:", error);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-50 border rounded-lg">
      <form
        className="space-y-4 h-[90%] flex flex-col justify-between"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <FormInput
              id="noticeTitle"
              label="Event Name"
              value={noticeData.noticeTitle}
              onChange={handleInputChange}
            />
            <div className="flex justify-between">
              <FormInput
                id="startDate"
                label="Start Date"
                type="date"
                value={noticeData.startDate}
                onChange={handleInputChange}
                required
              />
              <FormInput
                id="endDate"
                label="End Date"
                type="date"
                value={noticeData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <FormInput
              id="noticeDetails"
              label="Notice Details"
              value={noticeData.noticeDetails}
              onChange={handleInputChange}
            />
            <div className="flex items-center space-x-4">
              {["High priority", "Low priority"].map((status) => (
                <label key={status} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="noticePriority"
                    value={status}
                    checked={noticeData.noticePriority === status}
                    onChange={() => handleStatusChange(status)}
                    className="hidden"
                  />
                  <div
                    className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center border-2 ${
                      selectedStatus === status
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedStatus === status && (
                      <div className="h-3 w-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span
                    className={`transition-colors duration-200 ${
                      selectedStatus === status
                        ? "text-red-700"
                        : "text-gray-700"
                    }`}
                  >
                    {status}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full mt-4 p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
          >
            Add Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAnnouncement;
