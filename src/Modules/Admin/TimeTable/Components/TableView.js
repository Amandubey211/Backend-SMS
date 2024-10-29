import React, { useEffect, useMemo, useState } from "react";
import { Table, Button, Input, message, Row, Col } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaTrashAlt } from "react-icons/fa";

const TableView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const timetable = location.state?.timetable;

  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    if (!timetable) {
      message.error("No timetable data available.");
      navigate("/noticeboard/timetable"); // Redirect if data is missing
    }
  }, [timetable, navigate]);

  const getColumns = (type) => {
    const commonColumns = [
      {
        title: "Start Time",
        dataIndex: "startTime",
        key: "startTime",
        sorter: (a, b) => a.startTime.localeCompare(b.startTime),
      },
      {
        title: "End Time",
        dataIndex: "endTime",
        key: "endTime",
        sorter: (a, b) => a.endTime.localeCompare(b.endTime),
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        sorter: (a, b) => a.description.localeCompare(b.description),
      },
    ];

    switch (type) {
      case "weekly":
        return [
          {
            title: "Day",
            dataIndex: "day",
            key: "day",
            sorter: (a, b) => a.day.localeCompare(b.day),
          },
          {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            sorter: (a, b) => a.subject.localeCompare(b.subject),
          },
          ...commonColumns,
        ];
      case "exam":
        return [
          {
            title: "Date",
            dataIndex: "date",
            key: "date",
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
          },
          {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            sorter: (a, b) => a.subject.localeCompare(b.subject),
          },
          ...commonColumns,
        ];
      case "event":
        return [
          {
            title: "Event Name",
            dataIndex: "eventName",
            key: "eventName",
            sorter: (a, b) => a.eventName.localeCompare(b.eventName),
          },
          {
            title: "Date",
            dataIndex: "date",
            key: "date",
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
          },
          ...commonColumns,
        ];
      default:
        return [
          {
            title: "Other Title",
            dataIndex: "otherTitle",
            key: "otherTitle",
            sorter: (a, b) => a.otherTitle.localeCompare(b.otherTitle),
          },
          ...commonColumns,
        ];
    }
  };

  const tableData = useMemo(() => {
    if (!timetable) return [];
    return timetable.days?.flatMap((day) =>
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
    ) || [];
  }, [timetable]);

  useEffect(() => {
    // Filter based on search text
    const filtered = tableData.filter((row) =>
      Object.values(row).some(
        (value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [searchText, tableData]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  return (
    <div className="p-6">
      <Button onClick={() => navigate(-1)} icon={<FaArrowLeft />} className="mb-4">
        Back to Timetables
      </Button>
      <h1 className="text-3xl font-bold mb-6">{timetable?.name || "Timetable Details"}</h1>
      
      {/* Top Right Controls */}
      <Row justify="end" align="middle" className="mb-4">
        <Input.Search
          placeholder="Search timetable..."
          value={searchText}
          onChange={handleSearch}
          allowClear
          style={{ width: 200, marginRight: 10 }}
        />
        <Button icon={<FaEdit />} type="primary" style={{ marginRight: 5 }}>
          Edit
        </Button>
        <Button icon={<FaTrashAlt />} type="danger">
          Delete
        </Button>
      </Row>

      <Table
        columns={getColumns(timetable?.type)}
        dataSource={filteredData}
        pagination={{
          ...pagination,
          total: filteredData.length,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
        bordered
      />
    </div>
  );
};

export default TableView;
