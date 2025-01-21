import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { FiLoader } from "react-icons/fi"; // For loader icon
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  addModule,
  editModule,
} from "../../../../../../Store/Slices/Admin/Class/Module/moduleThunk";
import { setSelectedModule } from "../../../../../../Store/Slices/Admin/Class/Module/moduleSlice";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";

const AddModule = ({ data, onClose }) => {
  const { t } = useTranslation("admModule");
  const dispatch = useDispatch();
  const { sid } = useParams(); // Assuming the subjectId is present in the URL

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [moduleTitle, setModuleTitle] = useState("");

  // Access selected module from the Redux store
  const { selectedModule, moduleLoading, error } = useSelector(
    (state) => state.admin.module
  );

  useEffect(() => {
    if (data) {
      setModuleTitle(data.moduleName);
      setPreview(data.thumbnail);
    }
  }, [data]);

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

  const clearForm = () => {
    setModuleTitle("");
    clearImage();
  };

  const handleSubmit = async () => {
    if (!moduleTitle) {
      toast.error(t("Module title is required"));
      return;
    }

    if (!selectedFile && !preview) {
      toast.error(t("Module image is required"));
      return;
    }

    const moduleData = {
      name: moduleTitle,
      thumbnail: selectedFile || preview,
      subjectId: sid,
    };

    if (data) {
      // Editing existing module
      await dispatch(editModule({ ...moduleData, moduleId: data._id }));
      // If the edited module is the currently selected module, update it
      if (selectedModule && selectedModule.moduleId === data._id) {
        dispatch(
          setSelectedModule({
            moduleId: data._id,
            name: moduleTitle,
            chapters: selectedModule.chapters, // Keep chapters intact
          })
        );
      }
    } else {
      // Adding new module
      await dispatch(addModule(moduleData));
    }

    // After successful submission, clear form and close modal
    if (!moduleLoading && !error) {
      clearForm();
      onClose();
    }
  };

  return (
    <ProtectedSection requiredPermission={''}>
    <div className="flex flex-col h-full p-2">
      <div className="bg-white rounded-lg">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold opacity-60 mb-2"
            htmlFor="moduleImage"
          >
            {t("Module Image")}
          </label>
          <div className="relative border border-dashed rounded-lg w-full h-48 flex items-center justify-center">
            {preview ? (
              <>
                <img
                  src={preview}
                  alt={t("Preview")}
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
            {t("Module Title")}
          </label>
          <input
            type="text"
            id="moduleTitle"
            placeholder={t("Type here")}
            value={moduleTitle}
            onChange={(e) => setModuleTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
      <div className="mt-auto mb-8">
        <button
          onClick={handleSubmit}
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 flex justify-center items-center"
          disabled={moduleLoading}
        >
          {moduleLoading && <FiLoader className="animate-spin mr-2" />}
          {moduleLoading
            ? data
              ? t("Updating Module...")
              : t("Adding Module...")
            : data
            ? t("Update Module")
            : t("Add New Module")}
        </button>
      </div>
    </div>
    </ProtectedSection>
  );
};

export default AddModule;
