import React from "react";
import ReactDOM from "react-dom";

const BookPreviewPortal = ({ visible, position, children }) => {
  if (!visible) return null;
  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        // Shift the popover further up to accommodate the arrow pointer
        transform: "translate(-50%, -110%)",
        zIndex: 9999,
      }}
      className="relative"
    >
      <div className="bg-white border border-gray-300 shadow-2xl rounded-lg  transform transition duration-200 hover:scale-105">
        {children}
      </div>
      {/* Pointer Arrow: a triangle made with borders */}
      <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-white" />
    </div>,
    document.body
  );
};

export default BookPreviewPortal;
