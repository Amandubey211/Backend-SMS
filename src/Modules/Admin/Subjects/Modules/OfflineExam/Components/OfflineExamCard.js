import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteOfflineExamCard,
  UpdateOfflineExamCard,
} from "../../../../../../Store/Slices/Admin/Class/OfflineExam/oflineExam.action";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../../../../../../Utils/helperFunctions";
import toast from "react-hot-toast";
import DateSection from "./DateSection";
import { setSelectedExamStudents } from "../../../../../../Store/Slices/Admin/Class/OfflineExam/offlineExamSlice";
import { BsPatchCheckFill } from "react-icons/bs";
import { MdOutlineBlock } from "react-icons/md";
import { Tooltip } from "antd";

const OfflineExamCard = ({
  examType,
  examName,
  semester,
  startDate,
  endDate,
  maxMarks,
  examId,
  students,
  semesterId,
  resultsPublished,
  resultsPublishDate,
}) => {
  const dispatch = useDispatch();
  const { offlineExamData, loading } = useSelector(
    (store) => store.admin.offlineExam
  );

  const navigate = useNavigate();
  const { sid, cid } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [examDetails, setExamDetails] = useState({
    examName,
    startDate,
    endDate,
    maxMarks: maxMarks || 0,
    publishDate: resultsPublishDate || "",
    isPublished: resultsPublished || false,
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
          : null,
      })) || [],
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const updatedExam = offlineExamData?.find((exam) => exam?._id === examId);

    if (updatedExam) {
      setExamDetails({
        examName: updatedExam.examName,
        startDate: updatedExam.startDate,
        endDate: updatedExam.endDate,
        maxMarks: updatedExam.students?.[0]?.maxMarks || 0,
        publishDate: updatedExam.resultsPublishDate || "",
        isPublished: updatedExam.resultsPublished || false,
        students:
          updatedExam.students?.map((student) => ({
            _id: student._id || null,
            score: student.score || 0,
            maxMarks: student.maxMarks || 0,
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
          })) || [],
      });
    }
  }, [offlineExamData, examId]);

  const handleDeleteClick = async () => {
    try {
      const response = await dispatch(
        deleteOfflineExamCard({ examId: examId, cid: cid, sid: sid })
      ).unwrap();
      if (response.success) {
        setIsModalOpen(false);
        toast.success("Exam deleted successfully!");
      }
    } catch (error) {
      toast.error("Failed to delete exam.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setExamDetails({
        ...examDetails,
        [name]: checked,
      });
    } else {
      setExamDetails({
        ...examDetails,
        [name]: value,
      });
    }
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
        resultsPublishDate: examDetails.publishDate,
        resultsPublished: examDetails.isPublished,
        students: examDetails?.students?.map((student) => ({
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
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update exam.");
    }
  };

  return (
    <div className="ps-1 rounded-md bg-green-500 h-auto m-4 hover:shadow-lg">
      <div className="border rounded-md px-5 py-5 shadow-sm relative h-auto bg-white">
        <div
          className="cursor-pointer"
          onClick={() => {
            if (!isEditing) {
              dispatch(
                setSelectedExamStudents({
                  examName: examDetails.examName,
                  students: examDetails.students,
                  examType: examType,
                  startDate: formatDate(examDetails.startDate),
                  examId: examId,
                  semesterId: semesterId,
                })
              );
              navigate(`/class/${cid}/${sid}/offline_exam/view`);
            }
          }}
        >
          <div className="flex flex-col sm:flex-row w-full h-auto justify-between items-start sm:items-center gap-2">
            <div className="flex w-full sm:w-auto items-center gap-x-2">
              {isEditing ? (
                <input
                  type="text"
                  name="examName"
                  value={examDetails.examName}
                  onChange={handleInputChange}
                  className="border px-2 py-1 rounded-md w-full sm:w-48"
                />
              ) : (
                <span className="font-bold text-lg pr-2 truncate capitalize">
                  {examDetails.examName}
                </span>
              )}
              {/* Published Icon aligned with exam name */}
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="isPublished"
                    className="text-sm font-medium text-gray-600"
                  >
                    Published
                  </label>
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={examDetails.isPublished}
                    onChange={handleInputChange}
                    name="isPublished"
                    className="h-3 w-3 accent-green-500 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {examDetails.isPublished ? (
                    <Tooltip title="Published">
                      <BsPatchCheckFill className="text-green-600 p-1 border rounded-full h-7 w-7 cursor-pointer" />
                    </Tooltip>
                  ) : (
                    <Tooltip title="UnPublished">
                      <MdOutlineBlock className="text-gray-600 p-1 h-7 w-7 cursor-pointer" />
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
            <div className="bg-gray-100 text-gray-600 text-sm font-semibold rounded-full px-2 py-1 capitalize shrink-0">
              {examType}
            </div>
          </div>
          <div className="mt-2">
            <span className="font-medium text-gray-600 text-sm">
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
              <span className="text-purple-600 text-sm font-medium">
                {examDetails.maxMarks || 0}
              </span>
            )}
          </div>
          <div>
            <span className="font-medium text-gray-600 text-sm">
              Semester:{" "}
            </span>
            <span className="text-gray-600 text-sm">{semester}</span>
          </div>
        </div>
        <ul className="border-t px-8 mt-2 mb-1"></ul>
        <DateSection
          isEditing={isEditing}
          examDetails={examDetails}
          handleInputChange={handleInputChange}
          handleUpdate={handleUpdate}
          handleEditClick={handleEditClick}
          loading={loading}
          handleDeleteClick={handleDeleteClick}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          cid={cid}
          examId={examId}
        />
      </div>
    </div>
  );
};

export default OfflineExamCard;