import React, { useState } from "react";
import ImageUpload from "../../../Addmission/Components/ImageUpload";
import FormInput from "../../../Accounting/subClass/component/FormInput";

const AddEvent = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [eventData, setEventData] = useState({
    eventName: "",
    location: "",
    startDate: "",
    endDate: "",
    eventDirector: "",
    eventType: "",
    description: "",
    eventImage: null,
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event data to submit:", eventData);
    // Implement submission logic here
  };

  return (
    <div
      className="p-4 bg-gray-50 border rounded-lg overflow-auto"
      style={{ maxHeight: "90vh" }}
    >
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
          label="Event Name"
          value={eventData.eventName}
          onChange={handleInputChange}
        />
         <div className="flex justify-between">
          <FormInput
            id="startDate"
            label="Start Date"
            type="date"
            value={eventData.startDate}
            onChange={handleInputChange}
            required
          />
          <FormInput
            id="endDate"
            label="End Date"
            type="date"
            value={eventData.endDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <FormInput
          id="location"
          label="Location"
          value={eventData.location}
          onChange={handleInputChange}
        />
       
        <div className='flex justify-between '>
            <FormInput
          id="eventDirector"
          label="Event Director"
          value={eventData.eventDirector}
          onChange={handleInputChange}
        />
       <FormInput
          id="eventType"
          label="Event Type"
          value={eventData.eventType}
          onChange={handleInputChange}
        />
        </div>
        <FormInput
          id="description"
          label="Description"
          type="text"
          value={eventData.description}
          onChange={handleInputChange}
          multiline
        />
        <button
          type="submit"
          className="w-full mt-4 p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          Add Event
        </button>
      </form>
    </div>
  );
};

export default AddEvent;

