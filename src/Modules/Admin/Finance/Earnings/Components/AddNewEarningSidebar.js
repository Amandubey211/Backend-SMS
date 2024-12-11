import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Input, DatePicker } from "antd";

const AddNewEarningSidebar = ({ visible, onClose }) => {
  useEffect(() => {
    const handleOutsideClick = (event) => {
      const sidebarContent = document.querySelector(".sidebar-content");
      if (visible && sidebarContent && !sidebarContent.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [visible, onClose]);

  return (
    <div
      className={`fixed -top-6 bottom-0 left-0 right-0 bg-black bg-opacity-50 transition-opacity ${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } z-50`}
    >
      <div
        className={`fixed right-0 top-0 h-full w-[400px] bg-white shadow-lg p-6 transition-transform transform ${visible ? "translate-x-0" : "translate-x-full"
          } sidebar-content`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-800">Add New Earning</h2>
          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <Input
              placeholder="Type name"
              className="hover:border-purple-300 focus:border-purple-300 focus:ring-purple-300"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <Input
              placeholder="3,215 QR"
              className="hover:border-purple-300 focus:border-purple-300 focus:ring-purple-300"
            />
          </div>

          {/* Earning Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Earning Date
            </label>
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Select Date"
              className="hover:border-purple-300 focus:border-purple-300 focus:ring-purple-300"
              onOpenChange={(open) => {
                // Prevent sidebar from closing when date picker is clicked
                if (!open) onClose();
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Input.TextArea
              placeholder="Donation For school.."
              maxLength={100}
              rows={4}
              className="hover:border-purple-300 focus:border-purple-300 focus:ring-purple-300"
            />
            <p className="text-xs text-gray-500">You can write 100 characters</p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-medium py-2 rounded-lg transition-all duration-300 max-w-[300px] w-full"
          onClick={() => console.log("Earning Added")}
        >
          Add New Earning
        </button>

      </div>
    </div>
  );
};

AddNewEarningSidebar.propTypes = {
  visible: PropTypes.bool.isRequired, // Sidebar visibility
  onClose: PropTypes.func.isRequired, // Close function
};

export default AddNewEarningSidebar;
