import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ImSpinner8 } from "react-icons/im";
import PropTypes from "prop-types"; // For prop type validation (optional)

const AddPageHeader = ({
  onSave,
  isUpdating,
  loadingType,
  isPublishDateSet,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-2 pe-5 bg-white border-b border-gray-300 shadow-sm">
      <div className="flex items-center">
        <IoIosArrowBack
          className="mr-2 text-gray-600 text-2xl cursor-pointer"
          onClick={() => navigate(-1)} // Navigate to the previous page
        />
        <h1 className="text-lg font-semibold text-gray-800">
          {isUpdating ? "Update Page" : "Create New Page"}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onSave(false)} // Save without publishing
          className={`flex-grow rounded-md py-2 px-6 text-center bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition ${
            loadingType === "save" || loadingType === "publish"
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={loadingType === "save" || loadingType === "publish"}
        >
          <span className="text-gradient flex items-center justify-center">
            {loadingType === "save" ? (
              <>
                <ImSpinner8 className="animate-spin mr-2" />
                {isUpdating ? "Updating..." : "Saving..."}
              </>
            ) : isUpdating ? (
              "Update"
            ) : (
              "Save"
            )}
          </span>
        </button>
        <button
          onClick={() => onSave(true)} // Save and publish
          className={`flex-grow rounded-md py-2 px-6 text-center bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition ${
            loadingType === "save" ||
            loadingType === "publish" ||
            !isPublishDateSet
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={
            loadingType === "save" ||
            loadingType === "publish" ||
            !isPublishDateSet
          }
          title={
            !isPublishDateSet
              ? "Publish date is required to publish the page."
              : ""
          }
        >
          <span className="text-gradient flex items-center justify-center">
            {loadingType === "publish" ? (
              <>
                <ImSpinner8 className="animate-spin mr-2" />
                {isUpdating ? "Updating..." : "Publishing..."}
              </>
            ) : isUpdating ? (
              "Update & Publish"
            ) : (
              "Save & Publish"
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

// Optional: Define prop types for better type checking
AddPageHeader.propTypes = {
  onSave: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  loadingType: PropTypes.string.isRequired,
  isPublishDateSet: PropTypes.bool.isRequired,
};

export default AddPageHeader;
