import React, { useEffect, useState, memo } from "react";
import {
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
import { FiLoader } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGrades, fetchChildren } from "../../../Store/Slices/Parent/Children/children.action";

const GradeAccordionItem = memo(({ onToggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(null);
  const { studentId } = useParams();
  const dispatch = useDispatch();

  // Get subjects, grades, loading, and error from Redux state
  const { children: studentSubjects, grades, loading, error } = useSelector((state) => state.Parent.children);

  useEffect(() => {
    // Fetch subjects (children) on component mount
    if (studentSubjects?.length === 0) {
      dispatch(fetchChildren()); // Fetch subjects from Redux state
    }
  }, [dispatch, studentSubjects?.length]);

  const toggleOpen = (index, subjectId) => {
    const newOpenState = isOpen === index ? null : index;
    setIsOpen(newOpenState);
    onToggleSidebar(newOpenState !== null);

    if (newOpenState !== null && !grades?.[subjectId]) {
      // Lazy load grades when the accordion is opened
      dispatch(fetchGrades({ studentId, subjectId }));
    }
  };

  // Error Handling UI
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex items-center flex-col text-center">
          <GoAlertFill className="text-[3rem] text-gray-400" />
          <p className="text-xl font-bold text-gray-600">
            {error || "Something went wrong. Please try again later."}: Please Check your Network.
          </p>
        </div>
      </div>
    );
  }


  return (
    <>
      {studentSubjects?.map((subject, index) => (
        <div key={subject?._id} className="border-b p-3">
          <div
            className="cursor-pointer py-3 px-5 flex items-center justify-between"
            onClick={() => toggleOpen(index, subject?._id)}
          >
            <div className="flex justify-center items-center gap-3">
              <div className="border rounded-full p-2">
                <FaBook className="text-[2rem] text-pink-400" />
              </div>
              <span className="font-bold">{subject?.name || "Unknown Subject"}</span>
            </div>
            <span>
              {isOpen === index ? (
                <MdKeyboardArrowUp className="border rounded text-black" />
              ) : (
                <MdKeyboardArrowDown />
              )}
            </span>
          </div>

          {isOpen === index && (
            <div className="p-3">
              <table className="min-w-full py-3 px-5">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="px-5 py-2">Name</th>
                    <th className="px-5 py-2">Due</th>
                    <th className="px-5 py-2">Submit</th>
                    <th className="px-5 py-2">Status</th>
                    <th className="px-5 py-2">Score</th>
                  </tr>
                </thead>
                {loading ? (
                  <tr>
                    <td className="text-center text-2xl py-10 text-gray-400" colSpan={6}>
                      <div className="flex w-full flex-col items-center">
                        <FiLoader className="animate-spin mr-2 w-[2rem] h-[2rem]" />
                        <p className="text-gray-800 text-sm">Loading...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tbody className="w-full">
                    {grades?.[subject?._id]?.length > 0 ? (
                      grades?.[subject?._id]?.map((grade, idx) => (
                        <tr key={idx} className="bg-white">
                          <td className="px-5 py-2 flex items-center w-[10rem]">
                            <span>{grade?.Name || "No Name Available"}</span>
                          </td>
                          <td className="px-5 py-2">{grade?.dueDate?.slice(0, 10) || "N/A"}</td>
                          <td className="px-5 py-2">{grade?.submittedDate?.slice(0, 10) || "N/A"}</td>
                          <td className="px-5 py-2">
                            <span className={`${grade?.status === 'Submit' ? 'text-green-500' : 'text-red-500'} font-medium`}>
                              {grade?.status || "No Status"}
                            </span>
                          </td>
                          <td className="px-5 py-2 text-center">{grade?.score ?? "N/A"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="w-full text-center text-gray-500 py-2">
                        <td className="px-5 py-2" colSpan="5">
                          <div className="flex items-center justify-center flex-col text-2xl">
                            <GoAlertFill className="text-[3rem] text-gray-400" />
                            <p>No Data Found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                )}
              </table>
            </div>
          )}
        </div>
      ))}
    </>
  );
});
export default React.memo(GradeAccordionItem);

