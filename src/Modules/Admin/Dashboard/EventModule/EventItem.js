import React, { useState } from "react";
import { Modal, Button, Form, Input, DatePicker, TimePicker } from "antd";
import moment from "moment";

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

  const truncateText = (text, maxLength) => {
    return text?.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="grid grid-cols-3 items-center py-4 gap-4">
      <div className="flex items-center">
        <img
          className="w-10 h-10 rounded-full mr-4"
          src={
            event.eventImage ||
            "https://img.freepik.com/premium-vector/social-events-icon-vector-image-can-be-used-elderly-care_120816-241693.jpg" ||
            "https://via.placeholder.com/50"
          }
          alt={event.eventName}
        />
        <p className="text-md text-gray-900 truncate" title={event.eventName}>
          {truncateText(event.eventName, 30)}
        </p>
      </div>
      <p className="text-sm text-gray-500 truncate">{event.eventType}</p>
      <p className="text-sm text-gray-500">{event.startDate}</p>
    </div>
  );
};

export default EventItem;
