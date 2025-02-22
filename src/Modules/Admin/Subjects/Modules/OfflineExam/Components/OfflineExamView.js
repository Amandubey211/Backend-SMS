import React, { useEffect, useMemo, useState } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import { useLocation } from "react-router-dom";
import OfflineExamViewCard from "./OfflineExamViewCard";
import { CiSearch } from "react-icons/ci";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";
import { debounce } from "lodash";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import { FaClipboardUser } from "react-icons/fa6";

const OfflineExamView = () => {
  const location = useLocation();
  const { examName, students, examType, startDate, examId, semesterId } =
    location.state;
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  // const [editedData, setEditedData] = useState({
  //   students:
  //     students?.map((stu) => ({
  //       _id: stu._id,
  //       score: stu.score || 0,
  //       maxMarks: stu.maxMarks || 0,
  //       status: stu.status || "present",
  //       studentId: stu.studentId?._id || null, // Send only ID
  //     })) || [],
  //   examDate: startDate || new Date(),
  //   examType: examType || "N/A",
  // });
  const debouncedSearch = useMemo(
    () =>
      debounce((searchQuery) => {
        setDebouncedQuery(searchQuery);
      }, 300),
    []
  );

  console.log(" sem id", semesterId);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const searchedData = useMemo(() => {
    if (!students || !debouncedQuery.trim()) return students;
    const query = debouncedQuery.toLowerCase();

    return students.filter(
      ({ studentId }) =>
        studentId.firstName.toLowerCase().includes(query) ||
        studentId.lastName.toLowerCase().includes(query)
    );
  }, [students, debouncedQuery]);

  return (
    <div className="flex ">
      <SubjectSideBar />
      <div className="p-4  w-full pr-4">
        <ProtectedSection
          title={"Exam View"}
          requiredPermission={PERMISSIONS.SHOW_ALL_EXAMS}
        >
          <div className="flex gap-7 items-center">
            <h2 className="text-xl font-semibold capitalize">
              {examName}
              <span className="border-none rounded-full text-sm p-1 px-2 ml-1 text-purple-600 bg-purple-100">
                {searchedData?.length}
              </span>
            </h2>
            <div className="relative flex items-center max-w-xs w-full mr-4">
              <input
                type="text"
                placeholder="Search here"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
              />
              <button className="absolute right-3">
                <CiSearch className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          {searchedData?.length ? (
            <div className=" bg-white mt-5 rounded-lg shadow-md">
              <table className="w-full text-gray-700 text-sm table-fixed border-collapse">
                <thead className="bg-gradient-to-r  from-pink-500 to-purple-500  text-white">
                  <tr>
                    <th className="p-3 border w-[15%]">Student</th>
                    <th className="p-3 border w-[15%]">Type</th>
                    <th className="p-3 border w-[15%]">Obtained Marks</th>
                    <th className="p-3 border w-[15%]">Max Marks</th>
                    <th className="p-3 border w-[15%]">Exam Date</th>
                    <th className="p-3 border w-[15%]">Status</th>
                    <th className="p-3 border w-[10%]">Actions</th>
                  </tr>
                </thead>

                <tbody className="w-full">
                  {searchedData?.map((student, index) => (
                    <OfflineExamViewCard
                      key={index}
                      student={student}
                      examType={examType}
                      startDate={startDate}
                      // editedData={editedData}
                      // setEditedData={setEditedData}
                      examId={examId}
                      semesterId={semesterId}
                      // handleEditStudent={handleEditStudent}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <NoDataFound
              title="Students Data"
              desc="No Students Found !"
              icon={FaClipboardUser}
              iconColor="text-blue-500"
              textColor="text-gray-700"
              bgColor="bg-gray-100"
            />
          )}
        </ProtectedSection>
      </div>
    </div>
  );
};

export default OfflineExamView;
