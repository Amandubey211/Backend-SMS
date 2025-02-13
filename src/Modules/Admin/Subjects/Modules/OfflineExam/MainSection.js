import React, { useEffect } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { useState } from "react";
import NoDataFound from "../../../../../Components/Common/NoDataFound";
import { FaClipboardList } from "react-icons/fa";
import Spinner from "../../../../../Components/Common/Spinner";
import OfflineExamCard from "./Components/OfflineExamCard";
import CreateButton from "./Components/CreateButton";
import Header from "./Components/Header";
import UploadAndFilter from "./Components/UploadAndFilter";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOfflineExam } from "../../../../../Store/Slices/Admin/Class/OfflineExam/oflineExam.action";
import { formatDate } from "../../../../../Utils/helperFunctions";

const MainSection = () => {
  const { sid, cid } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { offlineExamData, loading } = useSelector(
    (store) => store.admin.offlineExam
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!loading && cid && sid) {
      dispatch(fetchAllOfflineExam({ classId: cid, subjectId: sid }));
    }
  }, [cid, sid, dispatch]);

  // console.log("Data", offlineExamData.data);

  return (
    <div className="flex h-full w-full">
      <SubjectSideBar />
      <ProtectedSection title="All Offline Exams">
        <div className="flex pt-4">
          {/* Left Section */}
          <div className="w-[65%] border-l">
            <Header
              data={offlineExamData.data}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <ul className="border-t mt-4 mx-4"></ul>
            {/* Offline Exam Card */}
            {loading ? (
              <Spinner />
            ) : offlineExamData.data?.length ? (
              <div className="h-[calc(100vh-150px)] overflow-y-auto">
                {offlineExamData.data?.map((item, index) => (
                  <div>
                    <OfflineExamCard
                      key={index}
                      examType={item.examType}
                      examName={item.examName}
                      semester={item.semesterId?.title ?? "NA"}
                      startDate={formatDate(item.startDate)}
                      endDate={formatDate(item.endDate)}
                      maxScore={item.students[0]?.maxMarks}
                      examId={item._id}
                      students={item.students}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <NoDataFound
                title="Offline Exam"
                desc={"No Offline Exam Found !"}
                icon={FaClipboardList}
                iconColor="text-blue-500"
                textColor="text-gray-700"
                bgColor="bg-gray-100"
              />
            )}
          </div>
          {/* Right Section */}
          <UploadAndFilter />
        </div>
      </ProtectedSection>
      {/* Floating Add Exam Button */}
      <CreateButton />
    </div>
  );
};

export default MainSection;
