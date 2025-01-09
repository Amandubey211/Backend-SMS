import React from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { deleteEarnings } from "../../../../../Store/Slices/Finance/Earnings/earningsThunks";

const DeleteModal = ({ visible, onClose, type,income }) => {
  const dispatch = useDispatch()
  if (!visible) return null;

  return (
    <div className="fixed -top-6 bottom-0 left-0 right-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md text-center space-y-4">
        <h2 className="text-lg font-medium">
          Are you sure you want to delete this {type}?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-pink-500 text-pink-500 rounded-md hover:bg-pink-100"
          >
            No
          </button>
          <button
            onClick={()=>{dispatch(deleteEarnings({id:income._id,category:income.category.categoryName
            }));onClose()}}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeleteModal;
