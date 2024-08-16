import React, { useState, useEffect } from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import { RiDeleteBin5Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import RatingCard from "./RatingCard";
import AddNewRatingForm from "./AddNewRatingForm";
import EditRatingForm from "./EditRatingForm";
import Sidebar from "../../../../../../Components/Common/Sidebar";

const RubricModalRow = ({
  data,
  criteriaIndex,
  onDeleteCriteria,
  onAddRating,
  onEditCriteria,
  readonly, // Add readonly prop
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isEditSidebarOpen, setEditSidebarOpen] = useState(false);
  const [ratings, setRatings] = useState(data?.ratings);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentEditRating, setCurrentEditRating] = useState(null);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);

  useEffect(() => {
    const calculateTotalPoints = () => {
      const total = ratings.reduce(
        (acc, rating) => acc + Number(rating.ratingScore),
        0
      );
      setTotalPoints(total);
    };

    calculateTotalPoints();
  }, [ratings]);

  const handleAddNewRating = (ratingData) => {
    const updatedRatings = [...ratings, ratingData];
    setRatings(updatedRatings);
    onAddRating(criteriaIndex, updatedRatings);
  };

  const handleEditRating = (index) => {
    setCurrentEditRating(ratings[index]);
    setCurrentEditIndex(index);
    setEditSidebarOpen(true);
  };

  const handleUpdateRating = (updatedRating) => {
    const updatedRatings = ratings.map((rating, index) =>
      index === currentEditIndex ? updatedRating : rating
    );
    setRatings(updatedRatings);
    onAddRating(criteriaIndex, updatedRatings);
    setEditSidebarOpen(false);
  };

  const handleDeleteRating = (ratingIndex) => {
    const updatedRatings = ratings.filter((_, index) => index !== ratingIndex);
    setRatings(updatedRatings);
    onAddRating(criteriaIndex, updatedRatings);
  };

  return (
    <div className="flex flex-col border-t border-gray-200">
      <div className="flex justify-between flex-row">
        <div className="flex flex-col w-48 justify-around px-4 py-2">
          <p className="font-medium text-gray-900">{data.title}</p>
          <p className="text-sm text-gray-600">{data.description}</p>
          <div className="flex justify-between items-center mt-1">
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={data.range}
                readOnly
              />
              <p className="text-sm text-gray-500">Range</p>
            </div>
            {!readonly && ( // Hide buttons in readonly mode
              <div className="flex gap-2">
                <button
                  className="text-red-600"
                  onClick={() => onDeleteCriteria(criteriaIndex)}
                >
                  <RiDeleteBin5Line />
                </button>
                <button
                  className="text-green-600"
                  onClick={() => onEditCriteria(criteriaIndex)}
                >
                  <TbEdit />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-start flex-wrap w-[70%] gap-1 px-4 py-2">
          {ratings.map((rating, index) => (
            <RatingCard
              key={index}
              rating={rating}
              onDeleteRating={() => handleDeleteRating(index)}
              onEditRating={() => handleEditRating(index)}
              readonly={readonly} // Pass readonly to RatingCard
            />
          ))}
          {!readonly && ( // Hide "Add Rating" button in readonly mode
            <button
              className="flex flex-col justify-center border-dashed  w-44 h-40 items-center text-purple-600 text-xl gap-1 border-2  border-black border-opacity-65  hover:border-opacity-100 rounded-md px-5"
              onClick={() => setSidebarOpen(true)}
            >
              <HiOutlinePlus />
              <span className="text-gray-500 text-sm">Add Rating</span>
            </button>
          )}
        </div>
        <div className="flex flex-col justify-center items-center px-4 py-2">
          <p className="font-medium text-gray-900">Total Points</p>
          <input
            type="number"
            value={totalPoints}
            className=" w-24 p-2 ps-4 text-center border rounded-md focus:ring-indigo-500 focus:border-indigo-500 mt-1"
            readOnly
          />
        </div>
        {!readonly && ( // Only show the sidebars if not in readonly mode
          <>
            <Sidebar
              title="Add New Rating"
              isOpen={isSidebarOpen}
              onClose={() => setSidebarOpen(false)}
            >
              <AddNewRatingForm onAddNewRating={handleAddNewRating} />
            </Sidebar>
            {currentEditRating && (
              <Sidebar
                title="Edit Rating"
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
    </div>
  );
};

export default RubricModalRow;
