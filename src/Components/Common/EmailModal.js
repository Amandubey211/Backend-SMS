import React from 'react';

const EmailModal = ({ isOpen, onClose, sendButtonText, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white flex flex-col w-[28.1875rem] p-[2rem] gap-[1.5rem] rounded-[0.75rem] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-black">Send via email</h2>

        {/* Email Input */}
        <div className="flex flex-col gap-[0.5rem]">
          <label htmlFor="email" className="text-lg font-medium text-black">
            Student Mail ID
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            className="w-full border border-gray-300 p-[0.75rem] rounded-md outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Message Input */}
        <div className="flex flex-col gap-[0.5rem]">
          <label htmlFor="message" className="text-lg font-medium text-black">
            Message
          </label>
          <textarea
            id="message"
            placeholder="Write something here"
            rows="4"
            className="border border-gray-300 p-[0.75rem] rounded-md outline-none focus:ring-1 focus:ring-black resize-none"
          />
        </div>

        {/* Buttons */}
<div className="flex justify-between mt-[1.5rem]">
  {/* Cancel Button */}
  <button
    className="flex items-center justify-center w-[11.25rem] h-[2.5rem] px-[1rem] py-[0.75rem] rounded-[0.5rem] border border-[#C83B62] text-[#C83B62] text-[1rem] font-medium hover:bg-[#C83B62] hover:text-white transition-all"
    onClick={onClose}
  >
    Cancel
  </button>

  {/* Send Button */}
  <button
    className="flex items-center justify-center w-[11.25rem] h-[2.5rem] px-[1rem] py-[0.75rem] rounded-[0.5rem] text-white text-[1rem] font-medium bg-gradient-to-r from-[#C83B62] to-[#7F35CD] hover:opacity-90 transition-all"
    onClick={onSubmit}
  >
    {sendButtonText || 'Send Remainder'}
  </button>
</div>

      </div>
    </div>
  );
};

export default EmailModal;
