import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Input, Button, DatePicker } from "antd";

const EditTotalRevenueSidebar = ({ visible, onClose }) => {
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (visible && !e.target.closest(".sidebar-content")) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [visible, onClose]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-lg p-6 transition-transform transform translate-x-0 sidebar-content">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium text-gray-800">
                        Edit Total Revenue
                    </h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                        ✕
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">From</label>
                        <Input placeholder="Tuition Fees" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <Input placeholder="1500 QR" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Earning Date</label>
                        <DatePicker style={{ width: "100%" }} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <Input.TextArea rows={4} placeholder="Description" />
                    </div>
                </div>

                <Button
                    type="primary"
                    className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                    Update Earning
                </Button>
            </div>
        </div>
    );
};

EditTotalRevenueSidebar.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default EditTotalRevenueSidebar;
