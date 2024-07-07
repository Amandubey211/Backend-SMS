import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { AiOutlineFileAdd } from "react-icons/ai";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import useFetchAnnouncementById from "../../../../../../Hooks/AuthHooks/Staff/Admin/Announcement/useFetchAnnouncementById";
import AnnouncementViewHeader from "./Components/AnnouncementViewHeader";

const MainSection = () => {
  const { aid } = useParams();
  const { announcement, error, fetchAnnouncementById, loading } =
    useFetchAnnouncementById();

  useEffect(() => {
    fetchAnnouncementById(aid);
  }, [aid, fetchAnnouncementById]);

  return (
    <div className="flex w-full">
      <SubjectSideBar />
      <div className="border-l w-full">
        <AnnouncementViewHeader announcement={announcement} />
        <div className="p-4 bg-white">
          {loading && (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-gray-700"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
              Loading...
            </div>
          )}
          {error && <p>Error: {error}</p>}
          {announcement ? (
            <>
            {/* // this is the thumbnail */}
              <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg mb-4">
                <img
                  src={announcement.attachment || "default_image_url_here"}
                  alt="Announcement"
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold mb-4">{announcement.title}</h2>
              <div
                className="text-gray-700 mb-6"
                dangerouslySetInnerHTML={{ __html: announcement.content }}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <AiOutlineFileAdd size={64} className="text-gray-500" />
              <p className="text-gray-500 mt-4">No announcement found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainSection;
