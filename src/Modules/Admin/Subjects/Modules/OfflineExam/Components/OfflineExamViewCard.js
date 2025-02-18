import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStudents } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";

const OfflineExamViewCard = ({ student, examType, startDate }) => {
  const { allStudents } = useSelector((store) => store.admin.all_students);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllStudents());
  }, [dispatch]);

  const studentDetails = allStudents.find(
    (s) => s?._id === student?.studentId?._id
  );

  console.log("view", student);

  return (
    <tr className="border-b ">
      <td className="p-2 flex gap-2 flex-nowrap w-[100%]">
        <img
          className="h-8 w-8 rounded-full border"
          src={studentDetails?.profile || "/default-avatar.png"}
          alt="user"
        />
        <span className="font-bold truncate">
          {studentDetails?.firstName || "Unknown"}{" "}
          {studentDetails?.lastName || ""}
        </span>
      </td>
      <td className="p-2 border  capitalize w-[15%]">{examType || "N/A"}</td>
      <td className="p-2 border  w-[15%]">{student?.score ?? "N/A"}</td>
      <td className="p-2 border w-[15%]">{student?.maxMarks ?? "N/A"}</td>
      <td className="p-2 border w-[15%]">{startDate ?? "N/A"}</td>
      <td className="p-2 border w-[15%]">
        <span
          className={`px-2 py-1 capitalize rounded-full text-xs font-semibold ${
            student?.status === "absent"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {student?.status ?? "Unknown"}
        </span>
      </td>
    </tr>
  );
};

export default OfflineExamViewCard;
