import React, { useState } from "react";

const AddNewCriteriaForm = ({ onSave }) => {
  const [criteriaData, setCriteriaData] = useState({
    title: "",
    description: "",
    ratings: [],
  });

  const handleAddCriteria = () => {
    onSave(criteriaData);
    setCriteriaData({ title: "", description: "", ratings: [] });
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Criteria Title
        </label>
        <input
          type="text"
          value={criteriaData.title}
          onChange={(e) =>
            setCriteriaData({ ...criteriaData, title: e.target.value })
          }
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Type here"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Description
        </label>
        <textarea
          value={criteriaData.description}
          onChange={(e) =>
            setCriteriaData({ ...criteriaData, description: e.target.value })
          }
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Type here"
        />
      </div>

      <div className="mt-auto mb-6">
        <button
          onClick={handleAddCriteria}
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          Add Criteria
        </button>
      </div>
    </div>
  );
};

export default AddNewCriteriaForm;
