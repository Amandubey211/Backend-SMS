// // MediaUpload.js
// import React, { useState } from "react";

// const MediaUpload = ({ onSubmit }) => {
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleSubmit = () => {
//     if (selectedFile) {
//       console.log("Selected file:", selectedFile);
//       onSubmit();
//     } else {
//       alert("Please select a file first");
//     }
//   };

//   return (
//     <div className="w-full p-6 bg-white mb-3">
//       <label className="block mb-2 text-sm font-medium text-gray-700">
//         Upload Media
//       </label>
//       <input
//         type="file"
//         onChange={handleFileChange}
//         className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//       <button
//         onClick={handleSubmit}
//         className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       >
//         Submit
//       </button>
//     </div>
//   );
// };

// export default MediaUpload;





// import React, { useState } from "react";

// const MediaUpload = ({ onSubmit }) => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [comment, setComment] = useState("");

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleCommentChange = (e) => {
//     setComment(e.target.value);
//   };

//   const handleSubmit = () => {
//     if (selectedFile) {
//       console.log("Selected file:", selectedFile);
//       console.log("Comment:", comment);
//       onSubmit(selectedFile, comment);
//     } else {
//       alert("Please select a file first");
//     }
//   };

//   return (
//     <div className="w-full p-6 bg-white mb-3">
//       <label className="block mb-2 text-sm font-medium text-gray-700">
//         Upload Media
//       </label>
//       <input
//         type="file"
//         onChange={handleFileChange}
//         className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//       <label className="block mb-2 text-sm font-medium text-gray-700">
//         Comment
//       </label>
//       <textarea
//         value={comment}
//         onChange={handleCommentChange}
//         placeholder="Enter your comment"
//         className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//       <button
//         onClick={handleSubmit}
//         className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       >
//         Submit all
//       </button>
//     </div>
//   );
// };

// export default MediaUpload;


/////////////////////////
import React, { useState } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

const MediaUpload = ({ onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY_URL;
    const cloudinaryPreset = process.env.REACT_APP_CLOUDINARY_PRESET;
    
    if (!cloudinaryUrl || !cloudinaryPreset) {
      setError("Cloudinary URL or preset is not defined");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", cloudinaryPreset);

    try {
      // const response = await axios.post(cloudinaryUrl, formData);
      const response = await axios.put(cloudinaryUrl, formData);

      const fileUrl = response.data.secure_url;
      console.log("Uploaded file URL:", fileUrl);
      console.log("Comment:", comment);
      if (typeof onSubmit === 'function') {
        onSubmit(fileUrl, comment);
      } else {
        console.error("onSubmit is not a function");
      }
    } catch (error) {
      console.error("Error uploading file to Cloudinary", error);
      setError("Error uploading file. Please try again.");
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
        type="file"
        onChange={handleFileChange}
        className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Comment
      </label>
      <textarea
        value={comment}
        onChange={handleCommentChange}
        placeholder="Enter your comment"
        className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {loading && (
        <div className="flex items-center justify-center mt-3">
          <FaSpinner className="animate-spin mr-2 text-2xl" />
          <span>Uploading...</span>
        </div>
      )}
      {error && <div className="text-red-500 mt-3">{error}</div>}
      <button
        onClick={handleSubmit}
        className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      >
        Submit all
      </button>
    </div>
  );
};

export default MediaUpload;


