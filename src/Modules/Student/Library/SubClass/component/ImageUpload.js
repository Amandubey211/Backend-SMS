import React from "react";
import { FaTimes } from "react-icons/fa"; // Importing the Font Awesome remove icon

const ImageUpload = ({
  imagePreview,
  handleBrowseClick,
  handleImageChange,
  handleRemoveImage,
}) => {
  const fileInputRef = React.useRef(null);

  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-1 rounded-lg relative w-21 h-30">
      {imagePreview ? (
        <div className="relative w-full h-full">
          <img
            src={imagePreview}
            alt="Student"
            className="object-cover rounded-lg w-full h-full"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2  text-purple-500 bg-purple-300 transition transform hover:scale-110 hover:bg-purple-500 hover:text-purple-700"
            style={{
              borderRadius: "50%",
              padding: "0.25rem",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2_203153)">
              <path
                d="M37.5 20H37.52"
                stroke="#7F7F7F"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M31.25 52.5H15C13.0109 52.5 11.1032 51.7098 9.6967 50.3033C8.29018 48.8968 7.5 46.9891 7.5 45V15C7.5 13.0109 8.29018 11.1032 9.6967 9.6967C11.1032 8.29018 13.0109 7.5 15 7.5H45C46.9891 7.5 48.8968 8.29018 50.3033 9.6967C51.7098 11.1032 52.5 13.0109 52.5 15V31.25"
                stroke="#7F7F7F"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 40.0005L20 27.5005C22.32 25.268 25.18 25.268 27.5 27.5005L37.5 37.5005"
                stroke="#7F7F7F"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M35 35.0001L37.5 32.5001C39.175 30.8901 41.125 30.4401 42.955 31.1501"
                stroke="#7F7F7F"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M40 47.5H55"
                stroke="#7F7F7F"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M47.5 40V55"
                stroke="#7F7F7F"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_2_203153">
                <rect width="60" height="60" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p className="mt-2 text-sm text-gray-600">Drop Your Image here</p>
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="mt-2 text-purple-500 underline"
          >
            Click to browse
          </button>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
