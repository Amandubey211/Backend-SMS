import React, { useEffect, useState } from "react";
import {
  MdOutlineQuiz,
  MdAssignment,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import { FaBook } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
import { fetchStudentSubjects } from "../../../Store/Slices/Admin/Users/Students/student.action";

const GradeAccordionItem = ({ getData }) => {
  const [isOpen, setIsOpen] = useState(null);

  const toggleOpen = (index, subjectId) => {
    // Load data only if we're opening the accordion
    if (isOpen !== index) {
      getData(subjectId);
    }
    setIsOpen((prevState) => (prevState === index ? null : index));
  };

  const getColorForStatus = (status) => {
    return status === "Submit" ? "text-green-500" : "text-red-500";
  };

  const { studentId } = useParams();
  const { grades, studentSubjects, loading } = useSelector(
    (store) => store.admin.all_students
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStudentSubjects(studentId));
  }, [dispatch, studentId]);

  return (
    <div className="w-full bg-white rounded-lg overflow-hidden px-4 py-2">
      {studentSubjects?.map((subject, index) => (
        <div key={subject._id} className="border-b last:border-none">
          {/* Accordion Header */}
          <button
            className="w-full flex items-center justify-between p-4 focus:outline-none hover:bg-gray-50 transition-colors"
            onClick={() => toggleOpen(index, subject._id)}
          >
            <div className="flex items-center gap-3">
              <div className="border rounded-full p-2 bg-pink-50 shadow-sm">
                <FaBook className="text-pink-400 text-2xl" />
              </div>
              <span className="text-gray-700 font-semibold text-lg">
                {subject?.name}
              </span>
            </div>
            <span>
              {isOpen === index ? (
                <MdKeyboardArrowUp className="text-xl text-gray-600 transition-transform transform rotate-180" />
              ) : (
                <MdKeyboardArrowDown className="text-xl text-gray-600 transition-transform" />
              )}
            </span>
          </button>

          {/* Accordion Content */}
          <div
            className={`bg-white overflow-hidden transition-all duration-300 ${
              isOpen === index ? "max-h-[1000px] py-4" : "max-h-0"
            }`}
          >
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-5 py-2 text-gray-600 font-semibold">
                    Name
                  </th>
                  <th className="px-5 py-2 text-gray-600 font-semibold">
                    Due
                  </th>
                  <th className="px-5 py-2 text-gray-600 font-semibold">
                    Submit
                  </th>
                  <th className="px-5 py-2 text-gray-600 font-semibold">
                    Status
                  </th>
                  <th className="px-5 py-2 text-gray-600 font-semibold">
                    Score
                  </th>
                </tr>
              </thead>
              {loading ? (
                <tbody>
                  <tr>
                    <td
                      className="text-center text-lg py-10 text-gray-400"
                      colSpan={5}
                    >
                      <div className="flex flex-col items-center">
                        <FiLoader className="animate-spin w-6 h-6 mb-2 text-gray-600" />
                        <p className="text-gray-800 text-sm">Loading...</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {grades?.grades?.length > 0 ? (
                    grades?.grades?.map((item, idx) => (
                      <tr
                        key={idx}
                        className="border-b hover:bg-gray-50 transition-colors last:border-none"
                      >
                        <td className="px-5 py-3 text-gray-700">
                          {item?.Name}
                        </td>
                        <td className="px-5 py-3 text-gray-700">
                          {item?.dueDate?.slice(0, 10)}
                        </td>
                        <td className="px-5 py-3 text-gray-700">
                          {item?.submittedDate?.slice(0, 10)}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`${getColorForStatus(item?.status)} 
                              font-medium`}
                          >
                            {item?.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-center text-gray-700">
                          {item?.score}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-5 py-5 text-center" colSpan="5">
                        <div className="flex flex-col items-center text-gray-500">
                          <GoAlertFill className="text-3xl mb-2 text-gray-400" />
                          <span className="font-medium text-sm">
                            No Data Found
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GradeAccordionItem;
