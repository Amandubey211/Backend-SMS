import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, Space, Typography } from "antd";
import {
  FaTrashAlt,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteShift,
  getAllShifts,
  toggleShiftStatus,
} from "../../Store/Slices/Transportation/Shift/shift.action";

const { Title } = Typography;

const ShiftList = ({ onEdit }) => {
  const { shifts, loading } = useSelector(
    (store) => store?.transportation?.transportShift
  );
  const dispatch = useDispatch();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);

  useEffect(() => {
    dispatch(getAllShifts());
  }, [dispatch]);

  const handleDeleteShift = (shift) => {
    setSelectedShift(shift);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedShift) return;
    dispatch(deleteShift(selectedShift._id));
    setDeleteModalOpen(false);
  };

  const handleToggleStatus = (shiftId, currentStatus) => {
    dispatch(toggleShiftStatus({ shiftId, deactivate: !currentStatus }));
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Shift Name",
      dataIndex: "shiftName",
      key: "shiftName",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "From Time",
      dataIndex: "fromTime",
      key: "fromTime",
    },
    {
      title: "To Time",
      dataIndex: "toTime",
      key: "toTime",
    },
    {
      title: "Shift",
      dataIndex: "shift",
      key: "shift",
    },
    {
      title: "Status",
      dataIndex: "deactivateShift",
      key: "deactivateShift",
      render: (deactivateShift) => (
        <Tag color={deactivateShift ? "red" : "green"}>
          {deactivateShift ? "Inactive" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, shift) => (
        <Space size="10">
          <Button
            type="link"
            onClick={() => onEdit(shift)}
            icon={<FaEdit />}
            title="Edit Shift"
          />

          <Button
            type="link"
            onClick={() =>
              handleToggleStatus(shift._id, shift.deactivateShift)
            }
            icon={
              shift.deactivateShift ? <FaToggleOn /> : <FaToggleOff />
            }
            title={shift.deactivateShift ? "Activate Shift" : "Deactivate Shift"}
          />

          <Button
            type="link"
            danger
            onClick={() => handleDeleteShift(shift)}
            icon={<FaTrashAlt />}
            title="Delete Shift"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
   

      <Table
        loading={loading}
        columns={columns}
        dataSource={shifts}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "No shifts available." }}
      />

      {/* Delete Modal */}
      <Modal
        visible={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={handleConfirmDelete}
        title={`Delete Shift: ${selectedShift?.shiftName || "Shift"}`}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        Are you sure you want to delete this shift?
      </Modal>
    </div>
  );
};

export default ShiftList;