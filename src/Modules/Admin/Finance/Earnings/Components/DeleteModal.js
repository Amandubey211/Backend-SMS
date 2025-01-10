// src/Components/Admin/Finance/Earnings/Components/DeleteModal.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Input, Button, Typography, Spin } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
// ↓ IMPORTANT: import the deleteIncome thunk for Earnings
import { deleteEarnings } from "../../../../../Store/Slices/Finance/Earnings/earningsThunks";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { deleteExpense } from "../../../../../Store/Slices/Finance/Expenses/expensesThunks";

const { Text } = Typography;

/**
 * @param {boolean} visible - Whether the modal is shown
 * @param {function} onClose - Function to close the modal
 * @param {string} type - "Expense" or "Earnings"
 * @param {object} expense - Expense item to delete (if type="Expense")
 * @param {object} income - Income item to delete (if type="Earnings")
 */
const DeleteModal = ({ visible, onClose, type, expense, income }) => {
  // Use loading flags from both slices to handle spinner correctly
  const { loading: loadingExpenses } = useSelector(
    (state) => state.admin.expenses
  );
  const { loading: loadingEarnings } = useSelector(
    (state) => state.admin.earnings
  );

  // Decide which loading flag to use based on `type`
  const isLoading = type === "Expense" ? loadingExpenses : loadingEarnings;

  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");

  // Determine the item to delete based on the type
  const itemToDelete = type === "Expense" ? expense : income;

  const handleConfirm = async () => {
    if (!itemToDelete) {
      toast.error(`No ${type.toLowerCase()} selected for deletion.`);
      return;
    }

    try {
      const { _id, category } = itemToDelete;
      const categoryName = category?.categoryName || category;

      if (type === "Expense") {
        // Dispatch deleteExpense thunk
        await dispatch(
          deleteExpense({ category: categoryName, id: _id })
        ).unwrap();
      } else if (type === "Earnings") {
        // Dispatch deleteIncome thunk
        await dispatch(
          deleteEarnings({ category: categoryName, id: _id })
        ).unwrap();
      }

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
    itemToDelete?.category?.categoryName || itemToDelete?.category || "";

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
                isLoading ||
                inputValue.trim().toLowerCase() !== categoryName.toLowerCase()
              }
              className="bg-gradient-to-r from-red-500 to-red-600 text-white border-none hover:from-red-600 hover:to-red-700 transition-all flex items-center"
            >
              {isLoading ? <Spin size="small" className="mr-2" /> : "Delete"}
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
  expense: PropTypes.object, // Expense to delete if type = "Expense"
  income: PropTypes.object, // Income to delete if type = "Earnings"
};

export default DeleteModal;
