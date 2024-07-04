import React, { useState } from "react";

const AddCriteriaComponent = ({ rubricId }) => {
  // const { addCriteria, loading, error } = useAddCriteria();
  const [criteriaData, setCriteriaData] = useState({
    title: "",
    description: "",
  });

  const handleAddCriteria = async () => {
    console.log(criteriaData);
    // const result = await addCriteria(rubricId, criteriaData);
    // if (result.success) {
    //   // Handle successful criteria addition (e.g., reset form or update UI)
    // }
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
      {/* Form fields for criteria data */}
      <div className="mb-6">
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
          // disabled={false}
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          {false ? "Adding..." : "Add Criteria"}
        </button>
      </div>

      {/* {error && <p>{error}</p>} */}
    </div>
  );
};

export default AddCriteriaComponent;
