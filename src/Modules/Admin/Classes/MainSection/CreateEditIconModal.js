import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import {
  createIcon,
  updateIcon,
} from "../../../../Store/Slices/Admin/Class/actions/iconThunk";
import {
  selectIcon,
  resetIconSelection,
} from "../../../../Store/Slices/Admin/Class/reducer/iconSlice";

const CreateEditIconModal = ({ onClose,type }) => {
  const dispatch = useDispatch();
  const { selectedIcon, loading } = useSelector(
    (state) => state.admin.classIcons
  );

  // State and refs
  const [iconName, setIconName] = useState("");
  const [iconImage, setIconImage] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (selectedIcon) {
      setIconName(selectedIcon.name || "");
      setIconPreview(selectedIcon.imageLink || null);
    } else {
      setIconName("");
      setIconPreview(null);
    }
  }, [selectedIcon]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconImage(file);
      setIconPreview(URL.createObjectURL(file));
      setError(false); // Clear error on valid file selection
    }
  };

  const handleRemoveImage = () => {
    setIconImage(null);
    setIconPreview(null);
  };

  const handleIconSubmit = async () => {
    if (!iconName || (!iconImage && !selectedIcon)) {
      setError(true);
      toast.error("Please provide an icon name and image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", iconName);
    formData.append("type", type?type:"Class");
    if (iconImage) formData.append("image", iconImage);

    try {
      if (selectedIcon) {
        await dispatch(
          updateIcon({ iconData: formData, iconId: selectedIcon._id })
        );
        toast.success("Icon Updated Successfully!");
      } else {
        await dispatch(createIcon(formData));
        toast.success("Icon Created Successfully!");
      }
      dispatch(resetIconSelection());
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to submit icon");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">
          {selectedIcon ? "Edit Icon" : "Create New Icon"}
        </h2>

        {/* Icon Name Input */}
        <input
          type="text"
          placeholder="Icon Name"
          value={iconName}
          onChange={(e) => {
            setIconName(e.target.value);
            if (error) setError(false); // Reset error on valid input
          }}
          className={`border p-2 w-full mb-3 rounded-md ${
            error && !iconName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {error && !iconName && (
          <span className="text-red-500 text-xs">Icon name is required.</span>
        )}

        {/* Image Upload Section */}
        <div
          className={`flex flex-col items-center justify-center border-2 p-1 rounded-lg relative w-full h-40 border-dashed ${
            error && !iconImage && !iconPreview
              ? "border-red-500"
              : "border-gray-300"
          }`}
        >
          {iconPreview ? (
            <div className="relative w-full h-full">
              <img
                src={iconPreview}
                alt="Icon Preview"
                className="object-cover rounded-lg w-full h-full"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="absolute top-2 right-2 text-purple-500 bg-purple-300 rounded-full p-1 hover:bg-purple-500 hover:text-white transition transform hover:scale-110"
                style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
              >
                <FaTimes size={20} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-2"
              >
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
              </svg>
              <p className="text-xs text-gray-600">Drop Your Image here</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current.click();
                }}
                className="mt-2 text-purple-500 underline"
              >
                Click to browse
              </button>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>

        {/* Error message for image upload if required */}
        {error && !iconImage && !iconPreview && (
          <span className="text-red-500 text-center text-xs mt-1">
            Icon image is required.
          </span>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleIconSubmit}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : selectedIcon
              ? "Update Icon"
              : "Create Icon"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEditIconModal;
