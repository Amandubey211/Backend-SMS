import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { format } from "date-fns";
import FormInput from "../../../Accounting/subClass/component/FormInput";
import ImageUpload from "../../../Addmission/Components/ImageUpload";
import { updateEventThunk } from "../../../../../Store/Slices/Admin/NoticeBoard/Events/eventThunks";
import { useTranslation } from "react-i18next";

// Helper function to convert 12-hour time to 24-hour format
const convertTo24HourFormat = (time12h) => {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") {
    hours = "00";
  }
  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }
  return `${hours}:${minutes}`;
};

const UpdateEvent = () => {
  const { t } = useTranslation("admEvent");
  const dispatch = useDispatch();
  const selectedEvent = useSelector((state) => state.admin.events.selectedEvent);
  const loading = useSelector((state) => state.admin.events.loading);

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

  useEffect(() => {
    if (selectedEvent) {
      setEventData({
        title: selectedEvent.title,
        location: selectedEvent.location,
        date: format(new Date(selectedEvent.date), "yyyy-MM-dd"), // Format date to yyyy-MM-dd
        time: convertTo24HourFormat(selectedEvent.time), // Convert time to 24-hour format
        director: selectedEvent.director,
        type: selectedEvent.type,
        description: selectedEvent.description,
        image: selectedEvent.image,
        imagePreview: selectedEvent.image ? selectedEvent.image : null,
      });
    }
  }, [selectedEvent]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventData.title || !eventData.date || !eventData.time ) {
      toast.error(t("Please fill in all required fields."));
      return;
    }

    // Dispatch the update event thunk
    await dispatch(updateEventThunk({ eventId: selectedEvent._id, eventData }));
    toast.success(t("Event updated successfully!"));
  };

  return (
    
    <div className="flex flex-col h-full max-w-xl mx-auto border-t bg-white">
      {/* Scrollable content area */}
      <div className="flex-grow overflow-auto p-4 no-scrollbar">
        <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
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
              className="mt-1 block w-full rounded-md border border-gray-700  p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder={t("Enter event description")}
            />
          </div>
        </form>
      </div>

      {/* Sticky Update button */}
      <div className="p-2 bg-white border-t border-gray-200 sticky bottom-0 flex gap-4">
        <button
          type="submit"
          className="w-full flex justify-center items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md"
          onClick={handleSubmit}
        >
          {loading ? t("Updating...") : t("Update Event")}
        </button>
      </div>
    </div>
  );
};

export default UpdateEvent;
