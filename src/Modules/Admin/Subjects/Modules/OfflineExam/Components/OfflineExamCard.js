import React, { useEffect, useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbCheck, TbEdit } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteOfflineExamCard,
  UpdateOfflineExamCard,
} from "../../../../../../Store/Slices/Admin/Class/OfflineExam/oflineExam.action";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../../../../../../Utils/helperFunctions";
import toast from "react-hot-toast";

const OfflineExamCard = ({
  examType,
  examName,
  semester,
  startDate,
  endDate,
  maxScore,
  examId,
  students,
}) => {
  const dispatch = useDispatch();
  const { loading, offlineExamData } = useSelector(
    (store) => store.admin.offlineExam
  );
  const navigate = useNavigate();
  const { sid, cid } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    examName,
    startDate,
    endDate,
    maxScore,
  });
  

  console.log("offline exam data", offlineExamData);

  const handleDeleteClick = async () => {
    try {
      const response = dispatch(deleteOfflineExamCard({ examId }));
      if (response.success) {
        toast.success("Exam deleted successfully!");
      }
    } catch (error) {
      toast.error("Failed to delete exam.");
    }
  };

  const handleInputChange = (e) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await dispatch(
        UpdateOfflineExamCard({ payload: editedData, examId })
      ).unwrap();

      if (response.success) {
        toast.success("Exam updated successfully!");

        setEditedData({
          examName: response.data.examName,
          startDate: response.data.startDate,
          endDate: response.data.endDate,
          maxScore: response.data.maxScore,
        });

        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update exam.");
    }
  };

  return (
    <div className={`ps-1 rounded-md bg-green-500 h-auto m-4 hover:shadow-lg`}>
      <div
        className={`border rounded-md  px-5 py-5 bg-white shadow-sm relative h-auto`}
      >
        <div className="flex w-full h-auto justify-between items-end">
          <div className="flex w-[70%] h-auto items-end gap-x-2">
            {isEditing ? (
              <input
                type="text"
                name="examName"
                value={editedData.examName}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded-md w-full"
              />
            ) : (
              <h1
                className="font-bold text-lg pr-2 truncate cursor-pointer"
                onClick={() =>
                  navigate(`/class/${cid}/${sid}/offline_exam/view`, {
                    state: {
                      examName: examName,
                      students: students,
                      examType: examType,
                      startDate: formatDate(startDate),
                    },
                  })
                }
              >
                {examName}
              </h1>
            )}
          </div>
          <div className="bg-gray-100 text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
            {examType}
          </div>
        </div>
        <div>
          <span className="font-medium text-gray-600 text-xs">Max score: </span>
          {isEditing ? (
            <input
              type="number"
              name="maxScore"
              value={editedData.maxScore}
              onChange={handleInputChange}
              className="border px-2 py-1 rounded-md w-20"
            />
          ) : (
            <span className="text-gray-600 text-xs">{maxScore}</span>
          )}
        </div>

        <div>
          <span className="font-medium text-gray-600 text-xs">Semester: </span>
          <span className=" text-gray-600 text-xs">{semester}</span>
        </div>
        <ul className="border-t px-8 mt-2 mb-1"></ul>
        {/* Dates Section */}
        <div className="flex flex-col text-gray-500 text-xs">
          {/* row-1 */}
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center gap-1">
                <IoCalendarOutline className="text-sm" />
                <span>Start Date:</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="startDate"
                    value={editedData.startDate}
                    onChange={handleInputChange}
                    className="border px-2 py-1 rounded-md"
                  />
                ) : (
                  <span>{startDate}</span>
                )}
              </div>
              <div className="flex items-center gap-1 pl-2">
                <IoCalendarOutline className="text-sm" />
                <span>End Date:</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="endDate"
                    value={editedData.endDate}
                    onChange={handleInputChange}
                    className="border px-2 py-1 rounded-md"
                  />
                ) : (
                  <span>{endDate}</span>
                )}
              </div>
            </div>

            <div className="flex gap-x-2 cursor-pointer">
              {isEditing ? (
                <button
                  onClick={handleUpdate}
                  className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
                >
                  <TbCheck className="w-5 h-5 text-green-500" />
                </button>
              ) : (
                <button
                  onClick={handleEditClick}
                  className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
                >
                  <TbEdit className="w-5 h-5 text-green-500" />
                </button>
              )}

              <div className="flex flex-col">
                <button
                  disabled={loading}
                  onClick={handleDeleteClick}
                  className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
                >
                  <RiDeleteBin6Line className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineExamCard;
