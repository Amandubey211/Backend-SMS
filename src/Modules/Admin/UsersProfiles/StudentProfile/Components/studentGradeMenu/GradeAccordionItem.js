import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  MdOutlineQuiz,
  MdAssignment,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../../config/Common";
import subjectIcon from '../../../../../../Assets/DashboardAssets/subjectIcon.png'
const GradeAccordionItem = ({ grades, getData }) => {
  const [isOpen, setIsOpen] = useState(null);

  const toggleOpen = (index) => {
    setIsOpen((prevState) => (prevState === index ? null : index));
  };

  const getIconForType = (type) => {
    switch (type) {
      case "Quiz":
        return (
          <MdOutlineQuiz style={{ marginRight: 8 }} className="text-blue-500" />
        );
      case "Assignment":
        return (
          <MdAssignment style={{ marginRight: 8 }} className="text-green-500" />
        );
      default:
        return null;
    }
  };

  const getColorForStatus = (status) => {
    return status === "Completed" ? "text-green-500" : "text-red-500";
  };

  const { cid } = useParams();
  const [studentSubjects, setStudentSubjects] = useState([]);
  const role = useSelector((store) => store.Auth.role);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem(`${role}:token`);
        if (!token) {
          throw new Error("Authentication token not found");
        }
        const response = await axios.get(`${baseUrl}/api/studentDashboard/subjects/${cid}`, {
          headers: { Authentication: token },
        });
        setStudentSubjects(response.data.subjects);
        console.log(response.data.subjects);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };

    fetchSubjects();
  }, [cid, role]);

  return (
    <>
      {studentSubjects.map((i, index) => (
        <div key={i._id} className="border-b p-3">
          <div
            className="cursor-pointer py-3 px-5 flex items-center justify-between"
            onClick={() => toggleOpen(index)}
          >
            <div className="flex justify-center items-center gap-3 ">
              <div className="border rounded-full p-2">
  <img
                src={subjectIcon}
                className="h-10 w-10 rounded-full bg-contain "
              />
              </div>
            
              <span className="font-bold">{i.name}</span>
            </div>

            <span>
              {isOpen === index ? (
                <MdKeyboardArrowUp className="border rounded text-black" />
              ) : (
                <MdKeyboardArrowDown onClick={() => getData(i._id)} />
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
                <tbody className="w-full ">

              { grades.length > 0 ? grades.map((i, idx) => (
                <tr key={idx} className="bg-white ">
                  {/* <td className="px-5 py-2">{evalItem.name}</td> */}
                  <td className="px-5 py-2 flex items-center">
                    <span>{i?.title}
                    </span>
                  </td>
                  <td className="px-5 py-2">{i?.dueDate}</td>
                  <td className="px-5 py-2">{i.submitedAt}</td>
                  {/* <td className="px-5 py-2">{evalItem.status}</td> */}
                  <td className="px-5 py-2">
                    <span
                      className={`${getColorForStatus(
                        'submit'
                      )} font-medium `}
                    >
                      {" "}
                      {'Missed'}{" "}
                    </span>
                  </td>
                  <td className="px-5 py-2">{i?.score}</td>
                </tr>
              )):<tr className="w-full text-center text-gray-500 py-2">
              <td className="px-5 py-2" colSpan="5">
                No Grades found
              </td>
            </tr>
                }
            </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default GradeAccordionItem;
