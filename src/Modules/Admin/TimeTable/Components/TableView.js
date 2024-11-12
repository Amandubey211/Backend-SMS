// TableView.jsx

import React, { useEffect, useMemo, useState } from "react";
import { Table, Button, Input, message, Row } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaArrowLeft, FaEdit, FaTrashAlt } from "react-icons/fa";
import { deleteTimetable } from "../../../../Store/Slices/Admin/TimeTable/timetable.action"; // Import the delete action
import DeleteConfirmatiomModal from "../../../../Components/Common/DeleteConfirmationModal"; // Correct import path
import { useSelector } from "react-redux";

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

  const dispatch = useDispatch();

  const role = useSelector((store) => store.common.auth.role);


  // State for Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!timetable) {
      message.error("No timetable data available.");
      navigate("/timetable"); // Redirect if data is missing
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
      case "others":
        return [
          {
            title: "Other Title",
            dataIndex: "otherTitle",
            key: "otherTitle",
            sorter: (a, b) => a.otherTitle.localeCompare(b.otherTitle),
          },
          ...commonColumns,
        ];
      default:
        return commonColumns;
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
        otherTitle: slot.heading || "N/A", // Map 'heading' to 'otherTitle' for 'others' type
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

  // **Handle Delete Function**
  const handleDelete = () => {
    if (timetable) {
      setDeleteLoading(true);
      dispatch(deleteTimetable(timetable._id))
        .then(() => {
          setDeleteLoading(false);
          message.success(`${timetable.name} deleted successfully`);
          navigate("/timetable");
        })
        .catch((err) => {
          setDeleteLoading(false);
          message.error(`Failed to delete ${timetable.name}: ${err.message}`);
        });
    }
  };

  // **Handle Edit Function**
  const handleEdit = () => {
    if (timetable && timetable._id) {
      navigate(`/timetable/edit/${timetable._id}`);
    } else {
      message.error("Timetable ID is missing.");
    }
  };

  // **Modal Control Functions**
  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
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
        {(role !== "parent" && role !== "student") && (
          <>
            <Button
              icon={<FaEdit />}
              type="primary"
              onClick={handleEdit}
              style={{ marginRight: 5 }}
            >
              Edit
            </Button>
            <Button
              icon={<FaTrashAlt />}
              type="primary"
              danger
              onClick={openDeleteModal}
            >
              Delete
            </Button>
          </>
        )}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmatiomModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        loading={deleteLoading}
        text="Delete this timetable"
      />
    </div>
  );
};

export default TableView;
