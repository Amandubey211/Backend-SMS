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
  const { offlineExamData, loading } = useSelector(
    (store) => store.admin.offlineExam
  );
  const navigate = useNavigate();
  const { sid, cid } = useParams();

  // ✅ Local state for edited exam data
  const [examDetails, setExamDetails] = useState({
    examName,
    startDate,
    endDate,
    maxScore,
  });

  const [isEditing, setIsEditing] = useState(false);

  // ✅ Update state when Redux state changes
  useEffect(() => {
    const updatedExam = offlineExamData?.find((exam) => exam._id === examId);
    if (updatedExam) {
      setExamDetails({
        examName: updatedExam.examName,
        startDate: updatedExam.startDate,
        endDate: updatedExam.endDate,
        maxScore: updatedExam.maxScore,
      });
    }
  }, [offlineExamData, examId]);

  const handleDeleteClick = async () => {
    try {
      const response = await dispatch(
        deleteOfflineExamCard({ examId: examId })
      ).unwrap();
      if (response.success) {
        toast.success("Exam deleted successfully!");
      }
    } catch (error) {
      toast.error("Failed to delete exam.");
    }
  };

  const handleInputChange = (e) => {
    setExamDetails({
      ...examDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await dispatch(
        UpdateOfflineExamCard({ payload: examDetails, examId, cid, sid })
      ).unwrap();

      if (response.success) {
        toast.success("Exam updated successfully!");
        setIsEditing(false); // ✅ Close edit mode
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update exam.");
    }
  };

  return (
    <div className="ps-1 rounded-md bg-green-500 h-auto m-4 hover:shadow-lg">
      <div className="border rounded-md px-5 py-5 bg-white shadow-sm relative h-auto">
        <div className="flex w-full h-auto justify-between items-end">
          <div className="flex w-[70%] h-auto items-end gap-x-2">
            {isEditing ? (
              <input
                type="text"
                name="examName"
                value={examDetails.examName}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded-md w-full"
              />
            ) : (
              <h1
                className="font-bold text-lg pr-2 truncate cursor-pointer"
                onClick={() =>
                  navigate(`/class/${cid}/${sid}/offline_exam/view`, {
                    state: {
                      examName: examDetails.examName,
                      students: students,
                      examType: examType,
                      startDate: formatDate(examDetails.startDate),
                    },
                  })
                }
              >
                {examDetails.examName}
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
              value={examDetails.maxScore}
              onChange={handleInputChange}
              className="border px-2 py-1 rounded-md w-20"
            />
          ) : (
            <span className="text-gray-600 text-xs">
              {examDetails.maxScore}
            </span>
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
                    value={examDetails.startDate}
                    onChange={handleInputChange}
                    className="border px-2 py-1 rounded-md"
                  />
                ) : (
                  <span>{formatDate(examDetails.startDate)}</span>
                )}
              </div>
              <div className="flex items-center gap-1 pl-2">
                <IoCalendarOutline className="text-sm" />
                <span>End Date:</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="endDate"
                    value={examDetails.endDate}
                    onChange={handleInputChange}
                    className="border px-2 py-1 rounded-md"
                  />
                ) : (
                  <span>{formatDate(examDetails.endDate)}</span>
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
