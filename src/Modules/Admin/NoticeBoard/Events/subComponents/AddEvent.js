import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import FormInput from "../../../Accounting/subClass/component/FormInput";
import ImageUpload from "../../../Addmission/Components/ImageUpload";
import { createEventThunk } from "../../../../../Store/Slices/Admin/Events/eventThunks";
import { FiLoader } from "react-icons/fi";

const AddEvent = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !eventData.title ||
      !eventData.date ||
      !eventData.time ||
      !eventData.image
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    await dispatch(createEventThunk(eventData));
    toast.success("Event created successfully!");
  };

  return (
    <div
      className="p-4 rounded-lg overflow-auto no-scrollbar"
      style={{ maxHeight: "90vh" }}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <ImageUpload
          imagePreview={eventData.imagePreview}
          handleImageChange={handleImageChange}
          handleRemoveImage={handleRemoveImage} // Pass handleRemoveImage to ImageUpload component
        />
        <FormInput
          id="title"
          name="title"
          label="Event Name"
          value={eventData.title}
          onChange={handleInputChange}
          required
        />
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
        <FormInput
          id="location"
          name="location"
          label="Location"
          value={eventData.location}
          onChange={handleInputChange}
        />
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
        <FormInput
          id="description"
          name="description"
          label="Description"
          type="textarea"
          value={eventData.description}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="w-full flex justify-center items-center mt-4 h-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md"
        >
          {Loading ? <FiLoader className="animate-spin mr-2" /> : "Add Event"}
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
