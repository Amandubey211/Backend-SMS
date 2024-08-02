import React, { useState } from "react";
import ImageUpload from "../../../Addmission/Components/ImageUpload";
import FormInput from "../../../Accounting/subClass/component/FormInput";
import useCreateEvent from "../../../../../Hooks/AuthHooks/Staff/Admin/Events/useCreateEvent";
import toast from "react-hot-toast";

const AddEvent = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [eventData, setEventData] = useState({
    title: "",  // Changed from eventName
    location: "",
    date: "",
    time: "",
    director: "",  // Changed from eventDirector
    type: "",  // Changed from eventType
    description: "",
    image: null,  // Changed from eventImage
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
        image: file,
      }));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setEventData((prev) => ({
      ...prev,
      image: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check required fields
    if (!eventData.title || !eventData.date || !eventData.time || !eventData.image) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await createEvent(eventData); // Pass the eventData directly
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
          id="title"
          name="title"
          label="Event Name"
          value={eventData.title}
          onChange={handleInputChange}
          required
        />
        <div className="flex justify-between">
          <FormInput
            id="date"
            name="date"
            label="Date"
            type="date"
            value={eventData.date}
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
            id="director"
            name="director"
            label="Event Director"
            value={eventData.director}
            onChange={handleInputChange}
          />
          <FormInput
            id="type"
            name="type"
            label="Event Type"
            value={eventData.type}
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
