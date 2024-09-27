import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { resetEditMode } from "../../../../Store/Slices/Admin/Announcement/announcementSlice";
import {
  createAnnouncementThunk,
  updateAnnouncementThunk,
} from "../../../../Store/Slices/Admin/Announcement/announcementThunk";
import { FiLoader } from "react-icons/fi"; // Icon for the spinner

const AddAnnouncement = ({ isEditing, onClose }) => {
  const dispatch = useDispatch();
  const { selectedNotice, loading } = useSelector(
    (state) => state.admin.announcements
  );

  const [announcementData, setAnnouncementData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    description: "",
    priority: "High priority",
  });

  useEffect(() => {
    if (isEditing && selectedNotice) {
      setAnnouncementData({
        title: selectedNotice.title,
        startDate: selectedNotice.startDate.split("T")[0], // Format date to yyyy-MM-dd
        endDate: selectedNotice.endDate.split("T")[0],
        description: selectedNotice.description,
        priority: selectedNotice.priority,
      });
    } else {
      setAnnouncementData({
        title: "",
        startDate: "",
        endDate: "",
        description: "",
        priority: "High priority",
      });
    }
  }, [isEditing, selectedNotice]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnnouncementData({ ...announcementData, [name]: value });
  };

  const handlePriorityChange = (e) => {
    setAnnouncementData({ ...announcementData, priority: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !announcementData.title ||
      !announcementData.startDate ||
      !announcementData.endDate
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (isEditing) {
      await dispatch(
        updateAnnouncementThunk({
          noticeId: selectedNotice._id,
          updatedData: announcementData,
        })
      );
    } else {
      await dispatch(createAnnouncementThunk(announcementData));
    }
    onClose(); // Close the sidebar after submit
  };

  return (
    <div className="p-4 space-y-6">
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={announcementData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Start Date and End Date */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Available from
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={announcementData.startDate}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              Until
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={announcementData.endDate}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Event Details
          </label>
          <textarea
            id="description"
            name="description"
            value={announcementData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Type here"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Priority */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <div className="mt-2 space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="priority"
                value="High priority"
                checked={announcementData.priority === "High priority"}
                onChange={handlePriorityChange}
                className="form-radio text-green-500"
              />
              <span className="ml-2">High Priority</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="priority"
                value="Low priority"
                checked={announcementData.priority === "Low priority"}
                onChange={handlePriorityChange}
                className="form-radio text-gray-500"
              />
              <span className="ml-2">Low Priority</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-4 p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md flex justify-center items-center"
        >
          {loading ? (
            <FiLoader className="animate-spin mr-2" />
          ) : isEditing ? (
            "Update Notice"
          ) : (
            "Add Notice"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddAnnouncement;
