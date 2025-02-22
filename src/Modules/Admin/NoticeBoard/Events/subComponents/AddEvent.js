import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import FormInput from "../../../Accounting/subClass/component/FormInput";
import ImageUpload from "../../../Addmission/Components/ImageUpload";
import { createEventThunk } from "../../../../../Store/Slices/Admin/NoticeBoard/Events/eventThunks";
import { FiLoader } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const AddEvent = () => {
  const { t } = useTranslation("admEvent"); // Use translation hook with "events" namespace

  const dispatch = useDispatch();
  const [eventData, setEventData] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    director: "",
    type: "",
    description: "",
    image: null,
    imagePreview: null,
  });

  const Loading = useSelector((state) => state.admin.events.loading); // Get loading state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEventData({
      ...eventData,
      image: file,
      imagePreview: file ? URL.createObjectURL(file) : null,
    });
  };

  const handleRemoveImage = () => {
    setEventData({
      ...eventData,
      image: null,
      imagePreview: null,
    });
  };

  const formatTimeTo12Hour = (time) => {
    if (!time || !/^\d{2}:\d{2}$/.test(time)) {
      return ""; // Return empty string if time is invalid
    }
    const [hour, minute] = time.split(":");
    let hours = parseInt(hour, 10);
    const suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minute} ${suffix}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventData.title || !eventData.date) {
      toast.error(t("Please fill in all required fields."));
      return;
    }
    const formattedTime = eventData.time ? formatTimeTo12Hour(eventData.time) : "";
    dispatch(createEventThunk({ ...eventData, time: formattedTime }));
  };

  return (
    <div className="flex flex-col h-full border-t max-w-xl mx-auto bg-white">
      {/* Scrollable content area */}
      <div className="flex-grow overflow-auto p-4 no-scrollbar">
        <form className="space-y-4 mb-8">
          <ImageUpload
            imagePreview={eventData.imagePreview}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleRemoveImage}
          />
          <FormInput
            id="title"
            name="title"
            label={t("Event Name")}
            value={eventData.title}
            onChange={handleInputChange}
            required
            maxlength={60}
          />
          <FormInput
            id="date"
            name="date"
            label={t("Date")}
            type="date"
            value={eventData.date}
            onChange={handleInputChange}
            required
          />
          <FormInput
            id="time"
            name="time"
            label={t("Event Time")}
            type="time"
            value={eventData.time}
            onChange={handleInputChange}
            required
          />
          <FormInput
            id="location"
            name="location"
            label={t("Location")}
            value={eventData.location}
            onChange={handleInputChange}
            required
          />
          <FormInput
            id="director"
            name="director"
            label={t("Event Director")}
            value={eventData.director}
            onChange={handleInputChange}
            required
          />
          <FormInput
            id="type"
            name="type"
            label={t("Event Type")}
            value={eventData.type}
            onChange={handleInputChange}
            required
          />

          {/* Replacing FormInput for description with textarea */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              {t("Description")}
            </label>
            <textarea
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleInputChange}
              rows={5}
              className="mt-1 block w-full rounded-md border p-2 border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder={t("Enter event description")}
            />
          </div>
        </form>
      </div>

      {/* Sticky Add Event button */}
      <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0 flex gap-4">
        <button
          type="submit"
          className="w-full flex justify-center items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md"
          onClick={handleSubmit}
        >
          {Loading ? <FiLoader className="animate-spin mr-2" /> : t("Add Event")}
        </button>
      </div>
    </div>
  );
};

export default AddEvent;
