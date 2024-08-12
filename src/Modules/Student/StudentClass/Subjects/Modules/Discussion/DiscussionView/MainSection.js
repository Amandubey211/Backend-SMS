import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Components/Header";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import useFetchDiscussionById from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Disscussion/useFetchDiscussionById";
import { CiSearch } from "react-icons/ci";
import { ImSpinner3 } from "react-icons/im";
import { FaExclamationTriangle } from "react-icons/fa";
const StudentMainSection = () => {
  const { did } = useParams();
  const { discussion, error, fetchDiscussionById, loading } =
    useFetchDiscussionById();

  useEffect(() => {
    fetchDiscussionById(did);
  }, [did, fetchDiscussionById]);

  // if (loading) {
  //   return (
  //     <div className="flex flex-col items-center justify-center py-10 text-gray-500">
  //       <ImSpinner3 className="w-12 h-12 animate-spin mb-3" />
  //       <p className="text-lg font-semibold">Loading...</p>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="flex flex-col items-center justify-center py-10 text-gray-500">
  //       <FaExclamationTriangle className="w-12 h-12 mb-3" />
  //       <p className="text-lg font-semibold">{error}</p>
  //     </div>
  //   );
  // }
  // if (!discussion) return <p>No discussion found.</p>;

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="border-l w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <ImSpinner3 className="w-12 h-12 animate-spin mb-3" />
            <p className="text-lg font-semibold">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <FaExclamationTriangle className="w-12 h-12 mb-3" />
            <p className="text-lg font-semibold">{error}</p>
          </div>
        ) : discussion ? (
          <>
            <Header discussion={discussion} />
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
        ) : (
          <p className="text-center py-10 text-lg font-semibold text-gray-500">
            No discussion found.
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentMainSection;
