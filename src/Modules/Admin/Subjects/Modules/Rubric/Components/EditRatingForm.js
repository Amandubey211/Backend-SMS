// src/components/Components/EditRatingForm.js

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const EditRatingForm = ({ currentRating, onUpdateRating }) => {
  const { t } = useTranslation("admModule");
  const [markType, setMarkType] = useState("");
  const [points, setPoints] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (currentRating) {
      setMarkType(currentRating.ratingTitle);
      setPoints(currentRating.ratingScore);
      setDescription(currentRating.ratingDescription);
    }
  }, [currentRating]);

  const handleSubmit = () => {
    const updatedRating = {
      ratingTitle: markType,
      ratingScore: points,
      ratingDescription: description,
    };

    onUpdateRating(updatedRating);
    toast.success(t("Rating Updated"));
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {t("Mark Type")}
        </label>
        <input
          type="text"
          value={markType}
          onChange={(e) => setMarkType(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder={t("Type here")}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {t("Points")}
        </label>
        <input
          type="text"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder={t("Type here")}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {t("Description")}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder={t("Type here")}
        />
      </div>
      <div className="mt-auto mb-6">
        <button
          onClick={handleSubmit}
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          {t("Update Rating")}
        </button>
      </div>
    </div>
  );
};

export default EditRatingForm;
