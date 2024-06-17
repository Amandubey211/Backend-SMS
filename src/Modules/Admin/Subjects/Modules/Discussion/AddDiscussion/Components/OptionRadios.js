import React from "react";

const OptionRadios = ({ option, handleChange }) => {
  return (
    <div className="flex flex-col">
      <label className="text-black font-semibold my-2">Option</label>
      <div className="py-2 border-b">
        <div className="flex items-center mb-3">
          <input
            type="radio"
            id="threadedReplies"
            name="option"
            value="threadedReplies"
            checked={option === "threadedReplies"}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="threadedReplies" className="text-gray-700">
            Allow threaded replies
          </label>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="radio"
            id="postBeforeReplies"
            name="option"
            value="postBeforeReplies"
            checked={option === "postBeforeReplies"}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="postBeforeReplies" className="text-gray-700">
            Users must post before seeing replies
          </label>
        </div>
      </div>
    </div>
  );
};

export default OptionRadios;
