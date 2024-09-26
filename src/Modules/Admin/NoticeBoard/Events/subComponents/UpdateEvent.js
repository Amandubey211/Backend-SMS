import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { format } from "date-fns";
import FormInput from "../../../Accounting/subClass/component/FormInput";
import ImageUpload from "../../../Addmission/Components/ImageUpload";
import { updateEventThunk } from "../../../../../Store/Slices/Admin/Events/eventThunks";

const UpdateEvent = () => {
  const dispatch = useDispatch();
  const selectedEvent = useSelector((state) => state.admin.events.selectedEvent);

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
        time: selectedEvent.time,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventData.title || !eventData.date || !eventData.time || !eventData.image) {
      toast.error("Please fill in all required fields.");
      return;
    }
    await dispatch(updateEventThunk({ eventId: selectedEvent._id, eventData }));
    toast.success("Event updated successfully!");
  };

  return (
    <div className="p-4 bg-gray-50 border rounded-lg overflow-auto" style={{ maxHeight: "90vh" }}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <ImageUpload imagePreview={eventData.imagePreview} handleImageChange={handleImageChange} />
        <FormInput id="title" name="title" label="Event Name" value={eventData.title} onChange={handleInputChange} required />
        <FormInput id="date" name="date" label="Date" type="date" value={eventData.date} onChange={handleInputChange} required />
        <FormInput id="time" name="time" label="Event Time" type="time" value={eventData.time} onChange={handleInputChange} required />
        <FormInput id="location" name="location" label="Location" value={eventData.location} onChange={handleInputChange} />
        <FormInput id="director" name="director" label="Event Director" value={eventData.director} onChange={handleInputChange} />
        <FormInput id="type" name="type" label="Event Type" value={eventData.type} onChange={handleInputChange} />
        <FormInput id="description" name="description" label="Description" type="textarea" value={eventData.description} onChange={handleInputChange} />
        <button type="submit" className="w-full mt-4 p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md">
          Update Event
        </button>
      </form>
    </div>
  );
};

export default UpdateEvent;
