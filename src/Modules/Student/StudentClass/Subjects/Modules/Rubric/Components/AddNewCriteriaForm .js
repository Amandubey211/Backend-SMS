import React, { useState } from "react";
import toast from "react-hot-toast";

const AddNewCriteriaForm = () => {
  const [criteriaTitle, setCriteriaTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleTitleChange = (e) => {
    setCriteriaTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <div className="flex flex-col  h-full p-4">
        <div>
        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Criteria Title
        </label>
        <input
          type="text"
          value={criteriaTitle}
          onChange={handleTitleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Type here"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Type here"
        />
      </div>
        </div>


        <div className="mt-auto mb-6">
        <button
          onClick={()=>toast.success("New Criteria Added")}
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
 Add New Criteria
        </button>
      </div>
      </div>
  
  );
};

export default AddNewCriteriaForm;
