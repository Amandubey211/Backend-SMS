import React from "react";
import { Alert } from "antd"; // Import Ant Design's Alert
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion components

/**
 * OfflineModal Component
 *
 * Displays an error alert with smooth animations.
 *
 * @param {Object} props - Component props.
 * @param {string} props.error - The error message to display.
 * @param {function} props.onDismiss - Callback when the alert is dismissed.
 */
const OfflineModal = ({ error, onDismiss }) => {
  console.log(error, "sdfsdfsdf");
  return (
    <AnimatePresence>
      {/* {error && ( */}
      <motion.div
        // Animation for mounting and unmounting
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        // Styling to ensure the alert overlays content
        style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10000,
          width: "90%",
          maxWidth: "500px",
        }}
      >
        {/* <Alert
          message={error  || "Something is wrong"}
          type="error"
          showIcon
          closable
          onClose={onDismiss}
          // Ant Design styling enhancements
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
        /> */}
      </motion.div>
      {/* )} */}
    </AnimatePresence>
  );
};

export default OfflineModal;
