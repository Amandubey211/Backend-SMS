import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStudents } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";

const OfflineExamViewCard = ({ student, examType, startDate }) => {
  const dispatch = useDispatch();

  const { allStudents, loading } = useSelector(
    (store) => store.admin.all_students
  );

  useEffect(() => {
    if (!allStudents?.length) {
      dispatch(fetchAllStudents());
    }
  }, [dispatch, allStudents]);

  const studentDetails = allStudents?.find((s) => s._id === student.studentId);

  return (
    <div
      className={`border border-t-0 border-x-0 px-2 py-4 bg-white relative h-auto w-full my-2`}
    >
      <div className="flex w-full h-auto justify-between items-end">
        <h1 className="font-bold text-sm pr-2 truncate w-[25%] mb-2">
          {/* {studentDetails.firstName} {studentDetails.lastName} */}
        </h1>
        <div className="flex justify-between h-auto items-end gap-x-5 w-[75%]">
          <div className="text-gray-600 text-xs capitalize ">
            Type
            <div>{examType}</div>
          </div>

          <div>
            <div className="text-gray-600 text-xs">Obtained Marks </div>
            <span className=" text-gray-600 text-xs">{student.score}</span>
          </div>
          <div>
            <div className="text-gray-600 text-xs ">Max Marks </div>
            <span className=" text-gray-600 text-xs">{student.maxMarks}</span>
          </div>
          <div>
            <div className="text-gray-600 text-xs ">Exam Date </div>
            <span className=" text-gray-600 text-xs">{startDate}</span>
          </div>

          <div
            className={`${
              student.status === "absent"
                ? "bg-red-100 text-red-600"
                : "bg-green-100  text-green-600"
            }  text-xs font-semibold rounded-full px-2 py-1 mb-2`}
          >
            {student.status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineExamViewCard;
