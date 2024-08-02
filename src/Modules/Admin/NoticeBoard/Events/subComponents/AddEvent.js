import React, { useState } from "react";
import ImageUpload from "../../../Addmission/Components/ImageUpload";
import FormInput from "../../../Accounting/subClass/component/FormInput";
import useCreateEvent from "../../../../../Hooks/AuthHooks/Staff/Admin/Events/useCreateEvent";
import toast from "react-hot-toast";

const AddEvent = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [eventData, setEventData] = useState({
    eventName: "",
    location: "",
    startDate: "",
    endDate: "",
    time: "",
    eventDirector: "",
    eventType: "",
    description: "",
    eventImage: null,
  });

  const { loading, error, createEvent } = useCreateEvent();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
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
      setEventData((prev) => ({
        ...prev,
        eventImage: file,
      }));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setEventData((prev) => ({
      ...prev,
      eventImage: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check required fields
    if (!eventData.eventName || !eventData.startDate || !eventData.endDate || !eventData.time || !eventData.eventImage) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Create a FormData object to handle file upload
    const formData = new FormData();
    formData.append("eventName", eventData.eventName);
    formData.append("location", eventData.location);
    formData.append("startDate", eventData.startDate);
    formData.append("endDate", eventData.endDate);
    formData.append("time", eventData.time);
    formData.append("eventDirector", eventData.eventDirector);
    formData.append("eventType", eventData.eventType);
    formData.append("description", eventData.description);
    formData.append("eventImage", eventData.eventImage);

    console.log("Submitting event data:", eventData);

    // Submit event data
    try {
      await createEvent(formData);
      toast.success("Event created successfully.");
    } catch (error) {
      console.error("Error during event creation:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-50 border rounded-lg overflow-auto" style={{ maxHeight: "90vh" }}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="image-upload-container">
          <ImageUpload
            imagePreview={imagePreview}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleRemoveImage}
          />
        </div>
        <FormInput
          id="eventName"
          name="eventName"
          label="Event Name"
          value={eventData.eventName}
          onChange={handleInputChange}
          required
        />
        <div className="flex justify-between">
          <FormInput
            id="startDate"
            name="startDate"
            label="Start Date"
            type="date"
            value={eventData.startDate}
            onChange={handleInputChange}
            required
          />
          <FormInput
            id="endDate"
            name="endDate"
            label="End Date"
            type="date"
            value={eventData.endDate}
            onChange={handleInputChange}
            required
          />
          <FormInput
            id="time"
            name="time"
            label="Event Time"
            type="time"
            value={eventData.time}
            onChange={handleInputChange}
            required
          />
        </div>
        <FormInput
          id="location"
          name="location"
          label="Location"
          value={eventData.location}
          onChange={handleInputChange}
        />
        <div className="flex justify-between">
          <FormInput
            id="eventDirector"
            name="eventDirector"
            label="Event Director"
            value={eventData.eventDirector}
            onChange={handleInputChange}
          />
          <FormInput
            id="eventType"
            name="eventType"
            label="Event Type"
            value={eventData.eventType}
            onChange={handleInputChange}
          />
        </div>
        <FormInput
          id="description"
          name="description"
          label="Description"
          type="textarea"
          value={eventData.description}
          onChange={handleInputChange}
          multiline
        />
        <button
          type="submit"
          className="w-full mt-4 p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
          disabled={loading}
        >
          {loading ? "Adding Event..." : "Add Event"}
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default AddEvent;
