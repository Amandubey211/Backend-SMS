import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const EditRatingForm = ({ currentRating, onUpdateRating }) => {
  const [markType, setMarkType] = useState("");
  const [points, setPoints] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (currentRating) {
      setMarkType(currentRating?.ratingTitle);
      setPoints(currentRating.ratingScore);
      setDescription(currentRating.ratingDescription);
    }
  }, [currentRating]);

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
    const updatedRating = {
      ratingTitle: markType,
      ratingScore: points,
      ratingDescription: description,
    };

    onUpdateRating(updatedRating);
    toast.success("Rating Updated");
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
          Update Rating
        </button>
      </div>
    </div>
  );
};

export default EditRatingForm;
