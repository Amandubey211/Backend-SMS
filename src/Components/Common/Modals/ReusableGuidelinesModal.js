import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "antd";
import { FiInfo } from "react-icons/fi";

/**
 * A reusable modal component for displaying guidelines or any content.
 * Props:
 *  - visible (boolean): Controls modal visibility
 *  - onClose (function): Callback to close the modal
 *  - title (string): Title text displayed at the top
 *  - icon (React component): Icon to display in the header (defaults to FiInfo)
 *  - children (React node): Content to be displayed inside the modal
 *  - footer (React node): Optional custom footer content
 */
const ReusableGuidelinesModal = ({
  visible,
  onClose,
  title = "Guidelines",
  icon: IconComponent = FiInfo,
  children,
  footer,
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          onClick={onClose} // Close when clicking on the backdrop
        >
          {/* Stop click event propagation on the content container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-8 rounded-md shadow-md w-full max-w-xl"
          >
            {/* Header */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <IconComponent className="text-purple-600 text-4xl" />
              </div>
              <h2 className="text-purple-800 text-xl font-semibold">{title}</h2>
            </div>

            {/* Scrollable Content Area */}
            <div className="overflow-auto max-h-80 pr-2">{children}</div>

            {/* Footer */}
            <div className="flex justify-end mt-6 space-x-2">
              {footer ? (
                footer
              ) : (
                <Button
                  onClick={onClose}
                  className="border border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-all"
                >
                  Close
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReusableGuidelinesModal;
