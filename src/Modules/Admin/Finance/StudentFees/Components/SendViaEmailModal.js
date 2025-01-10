import React, { useState } from "react";
import PropTypes from "prop-types";

const SendViaEmailModal = ({ visible, onClose, onSend }) => {
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Modal Title */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-800">Send via email</h2>
        </div>

        {/* Modal Content */}
        <div className="p-4 space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Student Mail ID
            </label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* File Attachment */}
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium">
              <span>Invoice 009824612.pdf</span>
            </div>
            <span className="text-sm text-gray-500">Attached through this mail</span>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              placeholder="Write something here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-gray-200 flex justify-between space-x-4">
          <button
            onClick={onClose}
            className="w-full py-2 border border-pink-500 text-pink-500 rounded-md hover:bg-pink-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onSend(email, description)}
            className="w-full py-2 bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white font-medium rounded-md hover:opacity-90"
          >
            Send Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

SendViaEmailModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
};

export default SendViaEmailModal;
