import React, { useEffect } from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import RubricModalRow from "./RubricModalRow";
import mockData from "./MockData/ModalData";

const AddRubricModal = ({ isOpen, onClose, onAddCriteria }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white w-full p-3 h-[97vh] rounded-t-lg shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center p-1">
          <h2 className="text-lg font-semibold">Add Rubric</h2>
          <button
            onClick={onClose}
            className="text-gray-600 text-3xl hover:text-gray-900"
          >
            &times;
          </button>
        </div>
        <div className="p-2">
          <label className="block mb-2 text-sm text-gray-700">Rubric Name</label>
          <input
            type="text"
            className="block w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Type here"
          />
        </div>
        <div className="m-2 overflow-auto border h-[47vh]"> {/* Set a fixed height and make it scrollable */}
          <div className="flex px-4 font-semibold justify-between items-center p-2 w-full  bg-gradient-to-r from-pink-100 to-purple-100">
            <div className="w-2/8 bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">Criteria</div>
            <div className="w-2/8 bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">Ratings</div>
            <div className="w-2/8 bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">Point</div>
          </div>
          {mockData.map((item, index) => (
            <RubricModalRow key={index} data={item} />
          ))}
        </div>
        <div className="flex justify-between items-center p-4 border-t">
          <button
            onClick={onAddCriteria}
            className="flex items-center gap-2 font-semibold p-2 rounded-md bg-gradient-to-r from-pink-100 to-purple-100 hover:shadow-md transition-shadow duration-300"
          >
            <HiOutlinePlus className="text-red-600 text-2xl" />
            <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">Add Criteria</span>
          </button>
          <div className="text-transparent text-xl font-bold bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Total Points :100
          </div>
        </div>
        <div className="p-4 border-t flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onAddCriteria}
            className="flex items-center gap-2 font-semibold p-2 rounded-md bg-gradient-to-r from-pink-100 to-purple-100 hover:shadow-md transition-shadow duration-300"
          >
            <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">Add To Assignment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRubricModal;
