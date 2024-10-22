import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Components/Header";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import { ImSpinner3 } from "react-icons/im";
import { FaExclamationTriangle } from "react-icons/fa";
import NoDataFound from "../../../../../../../Components/Common/NoDataFound";
import Spinner from "../../../../../../../Components/Common/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentDiscussionById } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Discussion/discussion.action";

const StudentMainSection = () => {
  const dispatch = useDispatch()
  const { did } = useParams();

  const { discussion, loading, error } = useSelector((store) => store?.student?.studentDiscussion)

  useEffect(() => {
    dispatch(fetchStudentDiscussionById(did))
  }, [did, dispatch]);

  let content;

  if (loading) {
    content = <Spinner />;
  } else if (error) {
    content = (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <FaExclamationTriangle className="w-12 h-12 mb-3" />
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );
  } else if (discussion) {
    content = (
      <>
        <Header />
        <div className="p-6 bg-white">
          <h1 className="text-lg font-semibold">{discussion.title}</h1>
          <div className="text-gray-700 mb-3">
            <div dangerouslySetInnerHTML={{ __html: discussion.content }} />
          </div>
          {discussion.attachment && (
            <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg mb-4">
              <img
                src={discussion.attachment}
                alt="Attachment"
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </>
    );
  } else {
    content = <NoDataFound title="Discussion" />;
  }

  return (
    <div className="flex w-full">
      <SubjectSideBar />
      <div className="border-l w-full">{content}</div>
    </div>
  );
};

export default StudentMainSection;
