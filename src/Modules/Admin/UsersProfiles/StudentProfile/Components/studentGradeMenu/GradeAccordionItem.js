
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
import { fetchStudentSubjectProgress, fetchStudentSubjects } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";
import SkeletonLoader from "../../../../../../Utils/SkeletonLoader";
const GradeAccordionItem = ({  getData }) => {
  const [isOpen, setIsOpen] = useState(null);

  const toggleOpen = (index) => {
    setIsOpen((prevState) => (prevState === index ? null : index));
  };

  // const getIconForType = (type) => {
  //   switch (type) {
  //     case "Quiz":
  //       return (
  //         <MdOutlineQuiz style={{ marginRight: 8 }} className="text-blue-500" />
  //       );
  //     case "Assignment":
  //       return (
  //         <MdAssignment style={{ marginRight: 8 }} className="text-green-500" />
  //       );
  //     default:
  //       return null;
  //   }
  // };

  const getColorForStatus = (status) => {
    return status === "Submit" || status === "present" ? "text-green-500" : "text-red-500";
  };

  const { cid } = useParams();
  const {grades,studentSubjectProgress,loading} = useSelector((store) => store.admin.all_students);
  const dispatch = useDispatch();
  useEffect(()=>{
dispatch(fetchStudentSubjectProgress(cid))
  },[dispatch])

  return (
    <>
      {studentSubjectProgress?.map((i, index) => (
        <div key={i.subjectId} className="border-b p-3" onClick={() => { if (isOpen !== index) getData(i.subjectId) }}>
          <div
            className="cursor-pointer py-3 px-5 flex items-center justify-between"
            onClick={() => toggleOpen(index)}
          >
            <div className="flex justify-center items-center gap-3 ">
              <div className="border rounded-full p-2">
                <FaBook className="text-[2rem] text-pink-400" />
              </div>

              <span className="font-bold">{i.subjectName}</span>
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
                    <th className="px-5 py-2">Mode</th>
                    {/* <th className="px-5 py-2">Submit</th> */}
                    <th className="px-5 py-2">Status</th>
                    <th className="px-5 py-2">Score</th>
                  </tr>
                </thead>
                {loading ? (
                  <tr>
                    <td className="text-center text-2xl py-10 text-gray-400" colSpan={6} >
                      <SkeletonLoader/>
                    </td>
                  </tr>
                ) : (
                  <tbody className="w-full">
                    {grades?.grades?.length > 0 ? (
                      grades?.grades?.map((i, idx) => (
                        <tr key={idx} className="bg-white">
                          <td className="px-5 py-2 flex items-center w-full">
                            <span>{i?.Name}</span>
                          </td>
                          <td className="px-5 py-2">{i?.mode || "Online"}</td>
                          {/* <td className="px-5 py-2">{i?.submittedDate?.slice(0, 10) || '-'}</td> */}
                          <td className="px-5 py-2">
                            <span
                              className={`${getColorForStatus(
                                i?.status
                              )} font-medium `}
                            >
                              {i?.status}
                            </span>
                          </td>
                          <td className="py-2 px-5">{i?.score}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="w-full text-center text-gray-500 py-2">
                        <td className="px-5 py-2" colSpan="5">
                          <div className="flex  items-center justify-center flex-col text-2xl">
                            <GoAlertFill className="text-[3rem]" />
                            No  Data Found
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
};

export default GradeAccordionItem;
