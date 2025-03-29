// src/components/Components/RubricModalRow.js

import React, { useState, useEffect } from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import { RiDeleteBin5Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { AiOutlineEye } from "react-icons/ai";
import RatingCard from "./RatingCard";
import AddNewRatingForm from "./AddNewRatingForm";
import EditRatingForm from "./EditRatingForm";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { setRubricField } from "../../../../../../Store/Slices/Admin/Class/Rubric/rubricSlice";
import { useTranslation } from "react-i18next";

const DESC_LIMIT = 60; // More aggressive limit for the criteria description

const RubricModalRow = ({ data, criteriaIndex, readonly }) => {
  const { t } = useTranslation("admModule");
  const dispatch = useDispatch();

  const { criteria } = useSelector((state) => state?.admin?.rubrics ?? {});
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isEditSidebarOpen, setEditSidebarOpen] = useState(false);
  const [ratings, setRatings] = useState(data?.ratings ?? []);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentEditRating, setCurrentEditRating] = useState(null);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);

  // State for viewing full description
  const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false);

  // Truncate text
  const truncateText = (text = "", limit = DESC_LIMIT) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  // Show truncated text in the UI
  const truncatedDescription = truncateText(
    data?.description ?? "",
    DESC_LIMIT
  );

  useEffect(() => {
    const calculateTotalPoints = () => {
      const total = (ratings ?? []).reduce(
        (acc, rating) => acc + Number(rating?.ratingScore ?? 0),
        0
      );
      setTotalPoints(total);
    };
    calculateTotalPoints();
  }, [ratings]);

  const handleAddNewRating = (ratingData) => {
    const updatedRatings = [...ratings, ratingData];
    setRatings(updatedRatings);
    updateCriteriaRatings(updatedRatings);
  };

  const handleEditRating = (index) => {
    setCurrentEditRating(ratings[index]);
    setCurrentEditIndex(index);
    setEditSidebarOpen(true);
  };

  const handleUpdateRating = (updatedRating) => {
    const updatedRatings = (ratings ?? []).map((rating, idx) =>
      idx === currentEditIndex ? updatedRating : rating
    );
    setRatings(updatedRatings);
    updateCriteriaRatings(updatedRatings);
    setEditSidebarOpen(false);
  };

  const handleDeleteRating = (ratingIndex) => {
    const updatedRatings = (ratings ?? []).filter(
      (_, idx) => idx !== ratingIndex
    );
    setRatings(updatedRatings);
    updateCriteriaRatings(updatedRatings);
  };

  const updateCriteriaRatings = (updatedRatings) => {
    const updatedCriteria = (criteria ?? []).map((crit, idx) =>
      idx === criteriaIndex ? { ...crit, ratings: updatedRatings } : crit
    );
    dispatch(setRubricField({ field: "criteria", value: updatedCriteria }));
  };

  const handleDeleteCriteria = () => {
    const updatedCriteria = (criteria ?? []).filter(
      (_, idx) => idx !== criteriaIndex
    );
    dispatch(setRubricField({ field: "criteria", value: updatedCriteria }));
  };

  const handleEditCriteria = () => {
    dispatch(
      setRubricField({
        field: "criteriaToEdit",
        value: { ...data, index: criteriaIndex },
      })
    );
    dispatch(setRubricField({ field: "editMode", value: true }));
    dispatch(setRubricField({ field: "isSidebarOpen", value: true }));
  };

  // Open/close full description modal
  const handleViewDescription = () => setDescriptionModalOpen(true);
  const closeDescriptionModal = () => setDescriptionModalOpen(false);

  return (
    <div className="flex flex-col border-t border-gray-200">
      <div className="flex justify-between flex-row">
        {/* Left Column: Title + Truncated Description + Range + Icons */}
        <div className="flex flex-col w-48 justify-around px-4 py-2">
          <p className="font-medium text-gray-900">{t(data?.title ?? "")}</p>
          {/* Truncated Description, with no overflow */}
          <p className="text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-normal max-h-16 leading-tight">
            {t(truncatedDescription)}
          </p>

          <div className="flex justify-between items-center mt-1">
            {/* <div className="flex items-center gap-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={data?.range ?? false}
                readOnly
              />
              <p className="text-sm text-gray-500">{t("Range")}</p>
            </div> */}

            {/* Buttons: Eye, Delete, Edit */}
            <div className="flex gap-2">
              {/* Eye Button - always visible */}
              <button className="text-blue-600" onClick={handleViewDescription}>
                <AiOutlineEye />
              </button>
              {!readonly && (
                <>
                  <button
                    className="text-red-600"
                    onClick={handleDeleteCriteria}
                  >
                    <RiDeleteBin5Line />
                  </button>
                  <button
                    className="text-green-600"
                    onClick={handleEditCriteria}
                  >
                    <TbEdit />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column: Ratings */}
        <div className="flex justify-start flex-wrap w-[70%] gap-1 px-4 py-2">
          {(ratings ?? []).map((rating, index) => (
            <RatingCard
              key={index}
              rating={rating}
              onDeleteRating={() => handleDeleteRating(index)}
              onEditRating={() => handleEditRating(index)}
              readonly={readonly}
            />
          ))}
          {!readonly && (
            <button
              className="flex flex-col justify-center border-dashed w-44 h-40 items-center text-purple-600 text-xl gap-1 border-2 border-black border-opacity-65 hover:border-opacity-100 rounded-md px-5"
              onClick={() => setSidebarOpen(true)}
            >
              <HiOutlinePlus />
              <span className="text-gray-500 text-sm">{t("Add Rating")}</span>
            </button>
          )}
        </div>

        {/* Right Column: Total Points */}
        <div className="flex flex-col justify-center items-center px-4 py-2">
          <p className="font-medium text-gray-900">{t("Total Points")}</p>
          <input
            type="number"
            value={totalPoints}
            className="w-24 p-2 ps-4 text-center border rounded-md focus:ring-indigo-500 focus:border-indigo-500 mt-1"
            readOnly
          />
        </div>

        {/* Sidebars for Adding/Editing Ratings */}
        {!readonly && (
          <>
            <Sidebar
              title={t("Add New Rating")}
              isOpen={isSidebarOpen}
              onClose={() => setSidebarOpen(false)}
            >
              <AddNewRatingForm onAddNewRating={handleAddNewRating} />
            </Sidebar>
            {currentEditRating && (
              <Sidebar
                title={t("Edit Rating")}
                isOpen={isEditSidebarOpen}
                onClose={() => setEditSidebarOpen(false)}
              >
                <EditRatingForm
                  currentRating={currentEditRating}
                  onUpdateRating={handleUpdateRating}
                />
              </Sidebar>
            )}
          </>
        )}
      </div>

      {/* Full Description Modal */}
      {isDescriptionModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-xl w-full">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">{t("Full Description")}</h2>
              <button
                onClick={closeDescriptionModal}
                className="text-gray-600 text-xl"
              >
                &times;
              </button>
            </div>
            {/* Scrollable area for very long text */}
            <div className="text-gray-800 max-h-64 overflow-auto whitespace-pre-wrap break-words">
              {t(data?.description ?? "")}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeDescriptionModal}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                {t("Close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RubricModalRow;
