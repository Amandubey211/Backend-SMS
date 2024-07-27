import React, { useState } from "react";
import axios from "axios"; // Ensure Axios is installed
import ImageUpload from "../../../Addmission/Components/ImageUpload";
import FormInput from "../../../Accounting/subClass/component/FormInput";
import { baseUrl } from "../../../../../config/Common";
import { useSelector } from "react-redux";

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
    setEventData(prev => ({
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
      setEventData(prev => ({
        ...prev,
        eventImage: file,
      }));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setEventData(prev => ({
      ...prev,
      eventImage: null,
    }));
  };
  const role = useSelector((store) => store.Auth.role);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', eventData.eventName);
    formData.append('date', eventData.startDate);
    formData.append('time', '10:00 AM'); // Assuming fixed time, modify as necessary
    formData.append('type', eventData.eventType);
    formData.append('location', eventData.location);
    formData.append('director', eventData.eventDirector);
    formData.append('description', eventData.description);
    if (eventData.eventImage) {
      formData.append('image', eventData.eventImage);
    }

    // Retrieve JWT from localStorage
    const token = localStorage.getItem(`${role}:token`);

    try {
      const response = await axios.post(`${baseUrl}/admin/create_event`, formData, {
        headers: {
          'Authentication': `${token}`, // Use Bearer authentication scheme
          'Content-Type': 'multipart/form-data'
        },
      });
      console.log('Event created successfully:', response.data);
      // Clear the form or show success message
    } catch (error) {
      console.error('Failed to create event:', error);
      // Handle errors, such as displaying an error message
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
        </div>
        <FormInput
          id="location"
          name="location"
          label="Location"
          value={eventData.location}
          onChange={handleInputChange}
        />
        <div className='flex justify-between'>
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
        >
          Add Event
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
