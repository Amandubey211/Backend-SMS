import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { FiLoader } from "react-icons/fi"; // Importing a loader icon
import toast from "react-hot-toast";
import useAddChapter from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useAddChapter";
import useUpdateChapter from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useUpdateChapter";
import { useSelector } from "react-redux";

const AddChapter = ({ chapterData, isEditing, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [chapterTitle, setChapterTitle] = useState("");

  const { loading: addLoading, error, success, addChapter } = useAddChapter();
  const {
    loading: updateLoading,
    error: updateError,
    success: updateSuccess,
    updateChapter,
  } = useUpdateChapter();

  const selectedModule = useSelector((store) => store.Common.selectedModule);

  useEffect(() => {
    if (isEditing && chapterData) {
      setChapterTitle(chapterData.name);
      setPreview(chapterData.thumbnail);
    }
  }, [isEditing, chapterData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!chapterTitle) {
      toast.error("Chapter title is required");
      return;
    }

    if (!preview && !selectedFile) {
      toast.error("Chapter image is required");
      return;
    }

    const thumbnail = selectedFile ? selectedFile : null;

    if (isEditing) {
      await updateChapter(
        chapterTitle,
        thumbnail,
        selectedModule?.moduleId,
        chapterData._id
      );
      if (updateSuccess) {
        toast.success(updateSuccess);
        onClose();
      }
      if (updateError) {
        toast.error(updateError);
      }
    } else {
      await addChapter(chapterTitle, thumbnail, selectedModule?.moduleId);
      if (success) {
        toast.success(success);
        setChapterTitle("");
        clearImage();
        onClose();
      }
      if (error) {
        toast.error(error);
      }
    }
  };

  return (
    <form className="flex flex-col h-full p-2" onSubmit={handleSubmit}>
      <div className="bg-white rounded-lg">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold opacity-60 mb-2"
            htmlFor="moduleImage"
          >
            Chapter Image
          </label>
          <div className="relative border rounded-lg w-full h-48 flex items-center justify-center">
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-white text-gray-700 p-1 rounded-full shadow-md hover:text-red-500"
                >
                  <FaTimes />
                </button>
              </>
            ) : (
              <>
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
                <input
                  type="file"
                  id="moduleImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </>
            )}
          </div>
        </div>
        <div>
          <label
            className="block text-gray-700 text-sm font-semibold opacity-60 mb-2"
            htmlFor="moduleTitle"
          >
            Chapter Title
          </label>
          <input
            type="text"
            id="moduleTitle"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            placeholder="Type here"
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
      <div className="mt-auto mb-8">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 flex justify-center items-center"
          disabled={addLoading || updateLoading}
        >
          {addLoading || updateLoading ? (
            <FiLoader className="animate-spin mr-2" />
          ) : null}
          {addLoading || updateLoading
            ? isEditing
              ? "Updating Chapter..."
              : "Adding Chapter..."
            : isEditing
            ? "Update Chapter"
            : "Add New Chapter"}
        </button>
      </div>
    </form>
  );
};

export default AddChapter;
