import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { AiOutlineFileAdd } from "react-icons/ai";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import AnnouncementViewHeader from "./Components/AnnouncementHeader";
import useFetchAnnouncementById from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Announcement/useFetchAnnouncementById";
import { ImSpinner3 } from "react-icons/im";

const StudentMainSection = () => {
  const { aid } = useParams();
  const { announcement, error, fetchAnnouncementById, loading } =
    useFetchAnnouncementById();

  useEffect(() => {
    fetchAnnouncementById(aid);
  }, [aid, fetchAnnouncementById]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <ImSpinner3 className="w-12 h-12 animate-spin text-gray-500 mb-3" />
        <p className="text-lg font-semibold text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }


  if (!announcement) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AiOutlineFileAdd size={64} className="text-gray-500" />
        <p className="text-gray-500 mt-4">No announcement found.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <SubjectSideBar />
      <div className="border-l w-full">
        <AnnouncementViewHeader announcement={announcement}   loading={loading}
          error={error}  />
        <div className="p-4 bg-white">
          <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg mb-4">
            <img
              src={
                announcement.attachment || "https://via.placeholder.com/600x400"
              }
              alt="Announcement"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
          {/* <h2 className="text-xl font-semibold mb-4">{announcement.title}</h2> */}
          <div
            className="text-gray-700 mb-6"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />
          {/* <p className="text-gray-600">Posted by: {announcement.author}</p>
          <p className="text-gray-600">
            Posted on: {new Date(announcement.createdAt).toLocaleDateString()}
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default StudentMainSection;
