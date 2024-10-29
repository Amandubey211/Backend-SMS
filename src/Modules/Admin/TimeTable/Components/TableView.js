// TableView.js

import React from "react";
import { Table, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom"; // Use useLocation to access passed state
import { FaArrowLeft } from "react-icons/fa";

const TableView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const timetable = location.state?.timetable; // Retrieve timetable from state

  // Define dynamic columns based on timetable type
  const getColumns = (type) => {
    switch (type) {
      case "weekly":
        return [
          { title: "Day", dataIndex: "day", key: "day" },
          { title: "Subject", dataIndex: "subject", key: "subject" },
          { title: "Start Time", dataIndex: "startTime", key: "startTime" },
          { title: "End Time", dataIndex: "endTime", key: "endTime" },
          { title: "Description", dataIndex: "description", key: "description" },
        ];
      case "exam":
        return [
          { title: "Date", dataIndex: "date", key: "date" },
          { title: "Subject", dataIndex: "subject", key: "subject" },
          { title: "Start Time", dataIndex: "startTime", key: "startTime" },
          { title: "End Time", dataIndex: "endTime", key: "endTime" },
          { title: "Description", dataIndex: "description", key: "description" },
        ];
      case "event":
        return [
          { title: "Event Name", dataIndex: "eventName", key: "eventName" },
          { title: "Date", dataIndex: "date", key: "date" },
          { title: "Start Time", dataIndex: "startTime", key: "startTime" },
          { title: "End Time", dataIndex: "endTime", key: "endTime" },
          { title: "Description", dataIndex: "description", key: "description" },
        ];
      default:
        return [
          { title: "Other Title", dataIndex: "otherTitle", key: "otherTitle" },
          { title: "Subject", dataIndex: "subject", key: "subject" },
          { title: "Start Time", dataIndex: "startTime", key: "startTime" },
          { title: "End Time", dataIndex: "endTime", key: "endTime" },
          { title: "Description", dataIndex: "description", key: "description" },
        ];
    }
  };

  const tableData = timetable?.days?.flatMap((day) =>
    day.slots.map((slot) => ({
      key: slot._id,
      day: day.day || "N/A",
      date: day.date ? new Date(day.date).toLocaleDateString() : "N/A",
      eventName: slot.eventName || "N/A",
      subject: slot.subjectId?.name || "N/A",
      startTime: slot.startTime || "N/A",
      endTime: slot.endTime || "N/A",
      description: slot.description || "N/A",
    }))
  );

  return (
    <div className="p-6">
      <Button onClick={() => navigate(-1)} icon={<FaArrowLeft />} className="mb-4">
        Back to Timetables
      </Button>
      <h1 className="text-3xl font-bold mb-6">{timetable?.name || "Timetable Details"}</h1>
      <Table columns={getColumns(timetable?.type)} dataSource={tableData} pagination={{ pageSize: 5 }} bordered />
    </div>
  );
};

export default TableView;
