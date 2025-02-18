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
  maxMarks,
  examId,
  students,
}) => {
  const dispatch = useDispatch();
  const { offlineExamData, loading } = useSelector(
    (store) => store.admin.offlineExam
  );
  const navigate = useNavigate();
  const { sid, cid } = useParams();

  const [examDetails, setExamDetails] = useState({
    examName,
    startDate,
    endDate,
    maxMarks: maxMarks || 0,
    students:
      students?.map((student) => ({
        _id: student._id,
        score: student.score || 0,
        maxMarks: maxMarks || 0,
        status: student.status || "present",
        studentId: student.studentId
          ? {
              _id: student.studentId._id || null,
              firstName: student.studentId.firstName || "",
              lastName: student.studentId.lastName || "",
              fullName: student.studentId.fullName || "",
              id: student.studentId.id || null,
            }
          : null, // Fallback if studentId is undefined
      })) || [],
  });

  const [isEditing, setIsEditing] = useState(false);

  // ✅ Update state when Redux state changes
  useEffect(() => {
    const updatedExam = offlineExamData?.find((exam) => exam._id === examId);
    if (updatedExam) {
      setExamDetails({
        examName: updatedExam?.examName,
        startDate: updatedExam?.startDate,
        endDate: updatedExam?.endDate,
        maxMarks: updatedExam?.students?.length
          ? updatedExam.students[0].maxMarks
          : 0,
        students:
          updatedExam?.students?.map((student) => ({
            _id: student._id || null, // Ensure it's not null
            score: student.score || 0, // Default score to 0 if undefined
            maxMarks: student.maxMarks || 0, // Default maxMarks to 0 if undefined
            status: student.status || "present", // Default status to 'present' if undefined
            studentId: student.studentId
              ? {
                  _id: student.studentId._id || null,
                  firstName: student.studentId.firstName || "",
                  lastName: student.studentId.lastName || "",
                  fullName: student.studentId.fullName || "",
                  id: student.studentId.id || null,
                }
              : null,
          })) || [],
      });
    }
  }, [offlineExamData, examId, maxMarks]);

  const handleDeleteClick = async () => {
    try {
      const response = await dispatch(
        deleteOfflineExamCard({ examId: examId, cid: cid, sid: sid })
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
      const payload = {
        examName: examDetails.examName,
        startDate: examDetails.startDate,
        endDate: examDetails.endDate,
        maxMarks: examDetails.maxMarks,
        students: examDetails.students.map((student) => ({
          _id: student._id || null,
          score: student.score || 0,
          maxMarks: examDetails.maxMarks || 0,
          status: student.status || "present",
          studentId: student.studentId
            ? {
                _id: student.studentId._id || null,
                firstName: student.studentId.firstName || "",
                lastName: student.studentId.lastName || "",
                fullName: student.studentId.fullName || "",
                id: student.studentId.id || null,
              }
            : null,
        })),
      };

      const response = await dispatch(
        UpdateOfflineExamCard({ payload, examId, cid, sid })
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

  // console.log("offlineExam", offlineExamData);
  console.log("exam details", examDetails);
  return (
    <div className="ps-1 rounded-md bg-green-500 h-auto m-4 hover:shadow-lg">
      <div className="border rounded-md px-5 py-5 shadow-sm relative h-auto  bg-white">
        <div
          className="cursor-pointer"
          onClick={() => {
            if (!isEditing) {
              navigate(`/class/${cid}/${sid}/offline_exam/view`, {
                state: {
                  examName: examDetails.examName,
                  students: examDetails.students,
                  examType: examType,
                  startDate: formatDate(examDetails.startDate),
                },
              });
            }
          }}
        >
          <div className="flex w-full h-auto justify-between items-end ">
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
                <h1 className="font-bold text-lg pr-2 truncate">
                  {examDetails.examName}
                </h1>
              )}
            </div>
            <div className="bg-gray-100 text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
              {examType}
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-600 text-xs">
              Max score:{" "}
            </span>
            {isEditing ? (
              <input
                type="number"
                name="maxMarks"
                value={examDetails.maxMarks}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded-md w-20"
              />
            ) : (
              <span className="text-gray-600 text-xs">
                {examDetails.maxMarks || 0}
              </span>
            )}
          </div>

          <div>
            <span className="font-medium text-gray-600 text-xs">
              Semester:{" "}
            </span>

            <span className=" text-gray-600 text-xs">{semester}</span>
          </div>
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
