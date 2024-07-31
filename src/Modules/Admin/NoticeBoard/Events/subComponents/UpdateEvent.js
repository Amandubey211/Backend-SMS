import React, { useState, useEffect } from 'react';
import { RxCross2 } from "react-icons/rx";
import { format } from 'date-fns';

const UpdateEvent = ({ event, onSave, onClose }) => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: '',
    location: '',
    director: '',
    image: null,
    imagePreview: null,
  });

  useEffect(() => {
    if (event) {
      setEventData({
        title: event.title || '',
        description: event.description || '',
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
        time: event.time ? format(new Date(`1970-01-01T${event.time}:00`), 'HH:mm') : '',
        type: event.type || '',
        location: event.location || '',
        director: event.director || '',
        image: event.image || null,
        imagePreview: event.image || null,
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEventData({ ...eventData, image: file, imagePreview: URL.createObjectURL(file) });
  };

  const handleImageRemove = () => {
    setEventData({ ...eventData, image: null, imagePreview: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(eventData);
  };

  return (
    <div className="p-4 overflow-y-auto" style={{ maxHeight: '90vh' }}>
      <h2 className="text-lg font-semibold mb-4">Update Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700">Event Image</label>
          <div className="relative">
            {eventData.imagePreview ? (
              <div>
                <img src={eventData.imagePreview} alt="Event" className="w-full h-40 object-cover rounded" />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute top-0 right-0 p-1 bg-white rounded-full shadow"
                >
                  <RxCross2 className="text-xl" />
                </button>
              </div>
            ) : (
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="border px-3 py-2 w-full rounded"
              />
            )}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
            required
          />
        </div>
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label htmlFor="date" className="block text-gray-700">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
              required
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="time" className="block text-gray-700">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={eventData.time}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
            required
          />
        </div>
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label htmlFor="type" className="block text-gray-700">Event Type</label>
            <input
              type="text"
              id="type"
              name="type"
              value={eventData.type}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
              required
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="director" className="block text-gray-700">Event Director</label>
            <input
              type="text"
              id="director"
              name="director"
              value={eventData.director}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700">Event Details</label>
          <textarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
            rows="4"
            required
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-20 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 10px;
          border: 3px solid #f1f1f1;
        }
      `}</style>
    </div>
  );
};

export default UpdateEvent;
