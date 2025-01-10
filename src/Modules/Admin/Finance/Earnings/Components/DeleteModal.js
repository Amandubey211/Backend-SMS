import React, { useState } from "react";
import PropTypes from "prop-types";
import { Input, Button, Typography, Spin } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { deleteExpense } from "../../../../../Store/Slices/Finance/Expenses/expensesThunks";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const { Text } = Typography;

const DeleteModal = ({ visible, onClose, type, expense }) => {
  const { loading } = useSelector((state) => state.admin.expenses);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = async () => {
    if (!expense) {
      toast.error("No expense selected for deletion.");
      return;
    }

    try {
      const { _id, category } = expense;
      const categoryName = category?.categoryName || category;

      await dispatch(
        deleteExpense({ category: categoryName, id: _id })
      ).unwrap();
      toast.success(`${type} deleted successfully!`);
    } catch (error) {
      toast.error(`Failed to delete ${type}. Please try again.`);
    } finally {
      setInputValue(""); // Clear input after deletion
      onClose();
    }
  };

  const handleClose = () => {
    setInputValue(""); // Clear input when modal is closed
    onClose();
  };

  const categoryName =
    expense?.category?.categoryName || expense?.category || "";

  // Prevent clicks inside the modal from closing it
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return visible ? (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-30"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()} // Prevent modal click from closing
      >
        <div className="flex flex-col">
          <div className="mb-4 flex items-center">
            <ExclamationCircleOutlined
              style={{ fontSize: "2rem", color: "#FF4D4F", marginRight: 12 }}
            />
            <h2 className="text-xl font-bold text-gray-700">
              Confirm Deletion
            </h2>
          </div>
          <Text type="secondary" className="block text-left">
            To confirm, type the category name{" "}
            <strong className="text-red-500 font-semibold">
              {categoryName}
            </strong>{" "}
            below.
          </Text>

          <Input
            placeholder="Type category name here"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="mt-4"
            size="large"
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={handleClose}
              size="large"
              className="hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              danger
              size="large"
              onClick={handleConfirm}
              disabled={
                loading ||
                inputValue.trim().toLowerCase() !== categoryName.toLowerCase()
              }
              className="bg-gradient-to-r from-red-500 to-red-600 text-white border-none hover:from-red-600 hover:to-red-700 transition-all flex items-center"
            >
              {loading ? <Spin size="small" className="mr-2" /> : "Delete"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  ) : null;
};

DeleteModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  expense: PropTypes.object, // Expense to delete
};

export default DeleteModal;
