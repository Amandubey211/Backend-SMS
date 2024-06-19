import React, { useState } from "react";
import FormInput from "../../Accounting/subClass/component/FormInput";
import FormField from "../../Accounting/subClass/component/FormField";

const AddAnnouncement = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [noticeData, setNoticeData] = useState({
    noticeTitle: "",
    startDate: "",
    endDate: "",
    noticeDetails: "",
    noticePriority: "",
    notice: null,
  });
  const [selectedStatus, setSelectedStatus] = useState("High Priority");

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
      eventImage: null,
    }));
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setNoticeData((prev) => ({
      ...prev,
      noticePriority: status,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event data to submit:", noticeData);
    // Implement submission logic here
  };

  return (
    <div
      className=" flex flex-col  h-full p-4 bg-gray-50 border  rounded-lg "
     
    >
      <form className="space-y-4   h-[90%] flex flex-col justify-between   " onSubmit={handleSubmit}>
        <div className="flex flex-col    justify-between ">
            <div className="flex flex-col gap-4 ">

           
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
          <div>
            <div className="flex items-center space-x-4">
              {["High Priority", "Low Priority"].map((status) => (
                <label
                  key={status}
                  className="flex items-center cursor-pointer"
                >
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
        </div>
        <div  className=" flex justify-end" >
          <button
            onClick={handleSubmit}
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
