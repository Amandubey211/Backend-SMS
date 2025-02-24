import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStudents } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";
import { TbEdit } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  deleteOfflineExamStudent,
  UpdateOfflineExamStudent,
} from "../../../../../../Store/Slices/Admin/Class/OfflineExam/oflineExam.action";
import { useParams } from "react-router-dom";
import DeleteModal from "../../../../../../Components/Common/DeleteModal";
import DeleteConfirmatiomModal from "../../../../../../Components/Common/DeleteConfirmationModal";

const OfflineExamViewCard = ({
  student,
  examType,
  startDate,
  examId,
  semesterId,
}) => {
  const { allStudents } = useSelector((store) => store.admin.all_students);
  const { cid, sid } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const selectedExam = useSelector(
    (state) => state.admin.offlineExam.selectedExamStudents
  );
  const { students } = selectedExam || {};

  const dispatch = useDispatch();

  const [editedData, setEditedData] = useState({
    score: student?.score || 0,
    maxMarks: student?.maxMarks || 0,
    status: student?.status || "present",
    examId,
    subjectId: sid,
    semesterId: semesterId || "",
  });

  useEffect(() => {
    dispatch(fetchAllStudents());
  }, [dispatch]);

  const studentDetails = allStudents.find(
    (s) => s?._id === student?.studentId?._id
  );

  const handleDeleteStudent = async (e) => {
    dispatch(
      deleteOfflineExamStudent({
        subjectId: sid,
        classId: cid,
        admissionNumber: studentDetails.admissionNumber,
        examId: examId,
      })
    );
  };

  const handleEditStudent = (e) => {
    e.preventDefault();
    dispatch(
      UpdateOfflineExamStudent({
        payload: editedData,
        admissionNumber: studentDetails.admissionNumber,
        subjectId: sid,
        classId: cid,
      })
    );
    setIsEditModalOpen(false);
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition duration-150 w-full">
      {/* Student Info */}
      <td className="p-2 flex gap-2 items-center w-[100%] flex-nowrap">
        <img
          className="h-8 w-8 rounded-full border object-cover"
          src={studentDetails?.profile || "/default-avatar.png"}
          alt="user"
        />
        <span className="font-semibold text-gray-700 truncate capitalize">
          {student?.studentId?.fullName}
        </span>
      </td>
      <td className="p-3 border w-[15%]">{examType ?? "N/A"}</td>
      <td className="p-3 border w-[15%">{editedData?.score ?? "N/A"}</td>
      <td className="p-3 border w-[15%">{student?.maxMarks ?? "N/A"}</td>
      <td className="p-3 border w-[15%">{startDate ?? "N/A"}</td>

      {/* Status with Badge */}
      <td className="p-3 border text-center w-[15%]">
        <span
          className={`px-3 py-1 capitalize rounded-full text-xs font-semibold tracking-wide ${
            editedData?.status === "absent"
              ? "bg-red-100 text-red-600"
              : editedData?.status === "excused"
              ? "bg-orange-100 text-orange-700"
              : "bg-green-100 text-green-600"
          }`}
        >
          {editedData?.status ?? "Unknown"}
        </span>
      </td>
      {/* Action Buttons */}
      <td className="p-3 border w-[10%] ">
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditModalOpen(true);
            }}
            className="bg-white p-2 rounded-full shadow hover:bg-gray-200 transition"
          >
            <TbEdit className="w-4 h-4 text-green-500" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="bg-white p-2 rounded-full shadow hover:bg-gray-200 transition"
          >
            <RiDeleteBin6Line className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </td>
      <DeleteConfirmatiomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteStudent}
        title={student?.studentId?.fullName}
      />

      {/* Edit Exam Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] relative">
            <h2 className="text-lg font-semibold mb-4">Edit Exam Details</h2>
            <form onSubmit={handleEditStudent} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium text-sm">
                  Obtained Marks:
                </label>
                <input
                  type="number"
                  value={editedData.score}
                  onChange={(e) =>
                    setEditedData({ ...editedData, score: e.target.value })
                  }
                  className="border p-2 rounded-md w-full"
                  required
                />
              </div>

              {/* Max Marks */}
              {/* <div>
                <label className="block text-gray-700 font-medium text-sm">
                  Max Marks:
                </label>
                <input
                  type="number"
                  value={editedData.maxMarks}
                  onChange={(e) =>
                    setEditedData({ ...editedData, maxMarks: e.target.value })
                  }
                  className="border p-2 rounded-md w-full"
                  required
                />
              </div> */}

              {/* Status */}
              <div>
                <label className="block text-gray-700 font-medium text-sm">
                  Status:
                </label>
                <select
                  value={editedData.status}
                  onChange={(e) =>
                    setEditedData({ ...editedData, status: e.target.value })
                  }
                  className="border p-2 rounded-md w-full"
                  required
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="excused">Excused</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-white px-4 py-2 rounded-md border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </tr>
  );
};

export default OfflineExamViewCard;
