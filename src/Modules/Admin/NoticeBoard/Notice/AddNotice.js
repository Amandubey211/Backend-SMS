import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createNoticeThunk, updateNoticeThunk } from "../../../../Store/Slices/Admin/NoticeBoard/Notice/noticeThunks";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import { FiLoader } from "react-icons/fi"; // Icon for the spinner
import { fetchStudentsByClassAndSection } from "../../../../Store/Slices/Admin/Class/Students/studentThunks";
import { useTranslation } from "react-i18next";

const AddNotice = ({ isEditing, onClose }) => {
  const { t } = useTranslation("admNotice");
  const dispatch = useDispatch();

  const { selectedNotice, loading } = useSelector((state) => state.admin.notice);
  const { classes } = useSelector((state) => state.admin.class); // Assuming classes are stored here
  const role = useSelector((store) => store.common.auth.role);
  const { studentsList, loading: studentLoading } = useSelector((store) => store.admin.students);

  const [announcementData, setAnnouncementData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    description: "",
    priority: "High priority",
    classId: "",
    noticeFor: "",
  });

  // Fetch classes when the component mounts
  useEffect(() => {
    dispatch(fetchAllClasses());
  }, [dispatch]);

  // Preload notice data for editing
  useEffect(() => {
    if (isEditing && selectedNotice) {
      setAnnouncementData({
        title: selectedNotice?.title,
        startDate: selectedNotice?.startDate?.split("T")[0],
        endDate: selectedNotice?.endDate?.split("T")[0],
        description: selectedNotice?.description,
        priority: selectedNotice?.priority,
        classId: selectedNotice?.classId?._id || "",
      });
    } else {
      setAnnouncementData({
        title: "",
        startDate: "",
        endDate: "",
        description: "",
        priority: "High priority",
        classId: "",
        noticeFor: "",
      });
    }
  }, [isEditing, selectedNotice]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'classId') {
      dispatch(fetchStudentsByClassAndSection(value));
    }
    setAnnouncementData({ ...announcementData, [name]: value });
  };

  const handlePriorityChange = (e) => {
    setAnnouncementData({ ...announcementData, priority: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!announcementData.title || !announcementData.startDate || !announcementData.endDate) {
      toast.error(t("Please fill in all required fields."));
      return;
    }

    if (isEditing) {
      await dispatch(updateNoticeThunk({
        noticeId: selectedNotice._id,
        updatedData: announcementData,
      })).then(()=>toast.success('Notice Updated Successfully'));
    } else {
      await dispatch(createNoticeThunk(announcementData)).then(()=>toast.success('Notice Add Successfully'));
    }
    setAnnouncementData({
      title: "",
      startDate: "",
      endDate: "",
      description: "",
      priority: "High priority",
      classId: "",
      noticeFor: "",
    });
    onClose(); 
   
  };

  return (
    <div className="p-4 space-y-6">
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            {t("Title")}
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={announcementData?.title}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            maxlength={60}
          />
        </div>

        {/* Start Date and End Date */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              {t("Available from")}
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={announcementData?.startDate}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              {t("Until")}
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={announcementData?.endDate}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>

        {/* Class Dropdown */}
        <div className="mb-4">
          <label htmlFor="class" className="block text-sm font-medium text-gray-700">
            {t("Class")}
          </label>
          <select
            id="class"
            name="classId"
            value={announcementData?.classId}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">{t("All")}</option>
            {classes &&
              classes?.map((classItem) => (
                <option key={classItem?._id} value={classItem?._id}>
                  {classItem?.className}
                </option>
              ))}
          </select>
        </div>

        {/* Notice for (student) */}
        <div className="mb-4">
          <label htmlFor="noticeFor" className="block text-sm font-medium text-gray-700">
            {t("Notice for (student)")}
          </label>
          <select
            id="noticeFor"
            name="noticeFor"
            value={announcementData?.noticeFor}
            onChange={handleInputChange}
            disabled={studentLoading}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">{t("All")}</option>
            {studentsList &&
              studentsList?.map((s) => (
                <option key={s?._id} value={s?._id}>
                  {s?.firstName}
                </option>
              ))}
          </select>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            {t("Event Details")}
          </label>
          <textarea
            id="description"
            name="description"
            value={announcementData?.description}
            onChange={handleInputChange}
            rows={4}
            placeholder={t("Type here")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Priority */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{t("Priority")}</label>
          <div className="mt-2 space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="priority"
                value="High priority"
                checked={announcementData?.priority === "High priority"}
                onChange={handlePriorityChange}
                className="form-radio text-green-500"
              />
              <span className="ml-2">{t("High Priority")}</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="priority"
                value="Low priority"
                checked={announcementData?.priority === "Low priority"}
                onChange={handlePriorityChange}
                className="form-radio text-gray-500"
              />
              <span className="ml-2">{t("Low Priority")}</span>
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
            t("Update Notice")
          ) : (
            t("Add Notice")
          )}
        </button>
      </form>
    </div>
  );
};

export default AddNotice;
