import React, { useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi2';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { TbEdit } from 'react-icons/tb';
import RatingCard from './RatingCard';
import AddNewRatingForm from './AddNewRatingForm';
import Sidebar from '../../../../../../Components/Common/Sidebar';
// import useAddRating from './hooks/useAddRating';

const RubricModalRow = ({ data, criteriaIndex, onDeleteCriteria }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [ratings, setRatings] = useState(data.ratings);
  // const { addRating, loading, error } = useAddRating();

  const handleAddNewRating = async (ratingData) => {
    console.log(data._id,ratingData)
    // const result = await addRating(data._id, ratingData);
    // if (result.success) {
    //   setRatings([...ratings, result.data]);
    //   setSidebarOpen(false);
    // }
  };

  const handleDeleteRating = (ratingIndex) => {
    setRatings(ratings.filter((_, index) => index !== ratingIndex));
  };

  return (
    <div className="flex flex-col border-t border-gray-200">
      <div className="flex justify-between flex-row">
        <div className="flex flex-col w-48 justify-around px-4 py-2">
          <p className="font-medium text-gray-900">{data.criteria}</p>
          <div className="flex justify-between items-center mt-1">
            <div className="flex items-center gap-1">
              <input type="checkbox" className="mr-2" checked={data.range} readOnly />
              <p className="text-sm text-gray-500">Range</p>
            </div>
            <div className="flex gap-2">
              <button className="text-red-600" onClick={() => onDeleteCriteria(criteriaIndex)}>
                <RiDeleteBin5Line />
              </button>
              <button className="text-green-600">
                <TbEdit />
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-start flex-wrap w-[70%] gap-1 px-4 py-2">
          {ratings.length > 0 ? (
            ratings.map((rating, index) => (
              <RatingCard key={index} rating={rating} onDeleteRating={() => handleDeleteRating(index)} />
            ))
          ) : (
            <p className="text-gray-500">No ratings added yet</p>
          )}
          <button
            className="flex flex-col justify-center border-dashed  w-44 items-center text-purple-600 text-xl gap-1 border-2  border-black border-opacity-65  hover:border-opacity-100 rounded-md px-5"
            onClick={() => setSidebarOpen(true)}
          >
            <HiOutlinePlus />
            <span className="text-gray-500 text-sm">Add Rating</span>
          </button>
        </div>
        <div className="flex flex-col justify-center items-center px-4 py-2">
          <p className="font-medium text-gray-900">Point Full Mark</p>
          <input
            type="number"
            value={data.fullMark}
            className="w-16 p-2 ps-4 text-center border rounded-md focus:ring-indigo-500 focus:border-indigo-500 mt-1"
            readOnly
          />
        </div>
        <Sidebar
          title="Add New Rating"
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
        >
          <AddNewRatingForm onAddNewRating={handleAddNewRating} />
        </Sidebar>
      </div>
      {/* {error && <p className="text-red-500">{error}</p>} */}
    </div>
  );
};

export default RubricModalRow;
