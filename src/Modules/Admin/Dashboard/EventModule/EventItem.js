import React, { useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { Modal, Button, Form, Input, DatePicker, TimePicker } from "antd";
import moment from "moment";

const priorityClasses = {
  "High priority": "bg-pink-100 text-pink-700",
  "Low priority": "bg-gray-100 text-black",
};

const EventItem = ({ event, onUpdate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedEvent, setEditedEvent] = useState(event);

  const handleEditClick = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    onUpdate(editedEvent);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent({ ...editedEvent, [name]: value });
  };

  const handleDateChange = (date, dateString) => {
    setEditedEvent({ ...editedEvent, date: dateString });
  };

  const handleTimeChange = (time, timeString) => {
    setEditedEvent({ ...editedEvent, time: timeString });
  };
  console.log(event)
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center">
        <img
          className="w-10 h-10 rounded-full mr-4"
          src={
            event.eventImage ||
            "https://via.placeholder.com/50"
          }
          alt={event.eventName}
        />
        <p className="text-md text-gray-900 truncate" title={event.eventName}>
          {event.eventName}
        </p>
      </div>
      <p className="text-sm text-gray-500">{event.eventType}</p>
      <p className="text-sm text-gray-500">{event.startDate}</p>
    </div>
  );
};

export default EventItem;
