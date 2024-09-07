import React, { useState } from "react";
import ImageUpload from "../../../Addmission/Components/ImageUpload";
import FormInput from "../../../Accounting/subClass/component/FormInput";
import useCreateEvent from "../../../../../Hooks/AuthHooks/Staff/Admin/Events/useCreateEvent";
import toast from "react-hot-toast";

const AddEvent = ({ onSave }) => {
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

  const { loading, createEvent } = useCreateEvent();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleImageRemove = () => {
    setEventData({ ...eventData, image: null, imagePreview: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true); // Set submission state immediately

    // Check if all required fields are filled
    if (!eventData.title || !eventData.date || !eventData.time || !eventData.image) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await createEvent(eventData);
      if (result?.success) {
        toast.success(result.msg || "Event created successfully!");

        // Reset form fields
        setEventData({
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

        // onSave(eventData, result); // Pass eventData to onSave to notify parent component
      } else {
        toast.error("Failed to create event.");
      }
    } catch (error) {
      console.error("Error during event creation:", error);
      toast.error("Error creating event.");
    } finally {
      setIsSubmitting(false); // Reset submission state after processing
    }
  };



  return (
    <div className="p-4 bg-gray-50 border rounded-lg overflow-auto" style={{ maxHeight: "90vh" }}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="image-upload-container">
          <ImageUpload
            imagePreview={eventData.imagePreview}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleImageRemove}
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
          disabled={loading || isSubmitting} // Ensure button is disabled on submit
        >
          {loading ? "Adding Event..." : "Add Event"}
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
