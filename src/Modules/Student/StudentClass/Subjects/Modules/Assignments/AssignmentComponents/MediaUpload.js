import React, { useState } from "react";
import axios from "axios";
import { FaSpinner, FaTimes, FaPlusCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const MediaUpload = ({ onSubmit }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY_URL;
    const cloudinaryPreset = process.env.REACT_APP_CLOUDINARY_PRESET;

    if (!cloudinaryUrl || !cloudinaryPreset) {
      setError("Cloudinary URL or preset is not defined");
      return;
    }

    setLoading(true);
    try {
      const responses = await Promise.all(
        files.map((file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", cloudinaryPreset);
          return axios.post(cloudinaryUrl, formData);
        })
      );
      const mediaData = responses.map((res, index) => ({
        url: res.data.secure_url,
        name: files[index].name,
        type: files[index].type
    }));
    onSubmit(mediaData);
    toast.success("Files uploaded successfully");
    
      // const fileUrls = responses.map((res) => res.data.secure_url);
      // onSubmit(fileUrls);
      // toast.success("Files uploaded successfully");
    } catch (error) {
      console.error("Error uploading files to Cloudinary", error);
      setError("Error uploading files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6 bg-white mb-3">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Upload Media
      </label>
      <input
        id="file-upload"
        type="file"
        multiple
        onChange={handleFileChange}
        className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {files.map((file, index) => (
        <div key={index} className="flex items-center justify-between mb-2">
          <span>{file.name}</span>
          <button
            onClick={() => removeFile(index)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTimes />
          </button>
        </div>
      ))}
      <button
        onClick={() => document.getElementById("file-upload").click()}
        className="flex items-center mb-4 text-blue-500 hover:text-blue-700 focus:outline-none"
      >
        <FaPlusCircle className="mr-2" />
        Add More Files
      </button>
      {loading ? (
        <div className="flex items-center justify-center mt-3">
          <FaSpinner className="animate-spin mr-2 text-2xl" />
          <span>Uploading...</span>
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={files.length === 0}
        >
          Submit all
        </button>
      )}
      {error && <div className="text-red-500 mt-3">{error}</div>}
    </div>
  );
};

export default MediaUpload;
