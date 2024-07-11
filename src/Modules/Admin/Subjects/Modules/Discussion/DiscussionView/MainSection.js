
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Components/Header";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import useFetchDiscussionById from "../../../../../../Hooks/AuthHooks/Staff/Admin/Disscussion/useFetchDiscussionById";

const MainSection = () => {
  const { did } = useParams();
  const { discussion, error, fetchDiscussionById, loading } = useFetchDiscussionById();

  useEffect(() => {
    fetchDiscussionById(did);
  }, [did, fetchDiscussionById]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!discussion) return <p>No discussion found.</p>;

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="border-l w-full">
        <Header discussion={discussion} />
        <div className="p-6 bg-white">
        <h1 className="text-lg font-semibold">{discussion.title}</h1>
          <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg mb-4">
            {discussion.attachment && (
              <img
                src={discussion.attachment}
                alt="Attachment"
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            )}
          </div>
          <div className="text-gray-700 mb-6">
            <div dangerouslySetInnerHTML={{ __html: discussion.content }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;

