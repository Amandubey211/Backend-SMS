import React, { useEffect, useState } from "react";
import {
  MdOutlineQuiz,
  MdAssignment,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FiLoader, FiAlertCircle } from "react-icons/fi";
import { FaBook } from "react-icons/fa";
import { fetchStudentSubjectProgress, fetchStudentSubjects } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";
import SkeletonLoader from "../../../../../../Utils/SkeletonLoader";

const GradeAccordionItem = ({ getData }) => {
  const [isOpen, setIsOpen] = useState(null);

  const toggleOpen = (index) => {
    setIsOpen((prevState) => (prevState === index ? null : index));
  };

  const getColorForStatus = (status) => {
    return status === "Submit" || status === "present" ? "text-green-600" : "text-red-600";
  };

  const { cid } = useParams();
  const { grades, studentSubjectProgress, loading } = useSelector((store) => store.admin.all_students);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStudentSubjectProgress(cid));
  }, [dispatch, cid]);

  return (
    <div className="w-full font-roboto">
      {studentSubjectProgress?.map((i, index) => (
        <div
          key={i.subjectId}
          className="border-b border-gray-200 bg-white rounded-lg shadow-sm mb-2"
          onClick={() => {
            if (isOpen !== index) getData(i.subjectId);
          }}
        >
          {/* Accordion Header */}
          <div
            className="cursor-pointer py-4 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
            onClick={() => toggleOpen(index)}
          >
            <div className="flex items-center gap-4">
              <div className="border border-gray-200 rounded-full p-2 bg-gray-50">
                {i.subjectIcon ? (
                  <img src={i?.subjectIcon} className="h-[40px] w-[40px] object-cover" alt={i.subjectName} />
                ) : (
                  <FaBook className="text-[2rem] text-pink-400" />
                )}
              </div>
              <span className="font-semibold text-gray-800 text-lg">{i.subjectName}</span>
            </div>
            <span>
              {isOpen === index ? (
                <MdKeyboardArrowUp className="text-gray-600 text-2xl" />
              ) : (
                <MdKeyboardArrowDown className="text-gray-600 text-2xl" />
              )}
            </span>
          </div>

          {/* Accordion Content */}
          {isOpen === index && (
            <div className="px-4 pb-4">
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100 text-gray-700 text-sm font-medium uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Mode</th>
                      <th className="px-6 py-3 text-left">Type</th> {/* New Type column */}
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Score</th>
                    </tr>
                  </thead>
                  {loading ? (
                    <tbody>
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-500">
                          <SkeletonLoader />
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody className="text-gray-600 text-sm">
                      {grades?.grades?.length > 0 ? (
                        grades.grades.map((grade, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="px-6 py-3">{grade?.Name}</td>
                            <td className="px-6 py-3">{grade?.mode || "Online"}</td>
                            <td className="px-6 py-3">{grade?.type || "N/A"}</td> {/* New Type column data */}
                            <td className="px-6 py-3">
                              <span className={`${getColorForStatus(grade?.status)} font-medium`}>
                                {grade?.status}
                              </span>
                            </td>
                            <td className="px-6 py-3">
                              {grade?.score}/{grade?.maxMarks}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-8 text-gray-500">
                            <div className="flex items-center justify-center flex-col gap-2">
                              <FiAlertCircle className="text-4xl text-gray-400" />
                              <span className="text-lg">No Data Found</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GradeAccordionItem;