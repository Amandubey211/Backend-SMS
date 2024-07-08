<<<<<<< HEAD
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AddNewRatingForm = () => {
  const [ratingScore, setRatingScore] = useState('');
  const [ratingTitle, setRatingTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleScoreChange = (e) => {
    setRatingScore(e.target.value);
  };

  const handleTitleChange = (e) => {
    setRatingTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = () => {
    toast.success("New Rating Added");
    // Add your form submission logic here
  };

  return (
    <div className="flex flex-col h-full  p-4">
      <div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Rating Score
          </label>
          <input
            type="text"
            value={ratingScore}
            onChange={handleScoreChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Type here"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Rating Title
          </label>
          <input
            type="text"
            value={ratingTitle}
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
          onClick={handleSubmit}
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          Add New Rating
        </button>
      </div>
    </div>
  );
};

export default AddNewRatingForm;
=======
import React, { useState } from "react";
import toast from "react-hot-toast";

const AddNewRatingForm = ({ onAddNewRating }) => {
  const [markType, setMarkType] = useState("");
  const [points, setPoints] = useState("");
  const [description, setDescription] = useState("");

  const handleMarkTypeChange = (e) => {
    setMarkType(e.target.value);
  };

  const handlePointsChange = (e) => {
    setPoints(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = () => {
    const newRating = {
      ratingTitle: markType,
      ratingScore: points,
      ratingDescription: description,
    };

    onAddNewRating(newRating);
    setMarkType("");
    setPoints("");
    setDescription("");
    toast.success("New Rating Added");
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Mark Type
        </label>
        <input
          type="text"
          value={markType}
          onChange={handleMarkTypeChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Type here"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Points
        </label>
        <input
          type="text"
          value={points}
          onChange={handlePointsChange}
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
      <div className="mt-auto mb-6">
        <button
          onClick={handleSubmit}
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          Add New Rating
        </button>
      </div>
    </div>
  );
};

export default AddNewRatingForm;
>>>>>>> main
