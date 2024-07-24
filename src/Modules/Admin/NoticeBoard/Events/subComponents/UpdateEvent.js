

import React, { useState, useEffect } from 'react';

const UpdateEvent = ({ event, onSave }) => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    // Add other fields if necessary
  });

  // Initialize form state with the selected event details
  useEffect(() => {
    if (event) {
      setEventData({
        title: event.title || '',
        description: event.description || '',
        date: event.startDate ? formatDateForInput(event.startDate) : '',
        // Set other fields if necessary
      });
    }
  }, [event]);

  // Function to format Date object to the format used in datetime-local input
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(eventData);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Update Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700">Description</label>
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
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700">Date and Time</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEvent;
