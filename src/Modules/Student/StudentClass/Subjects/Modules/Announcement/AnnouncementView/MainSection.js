import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { AiOutlineFileAdd } from "react-icons/ai";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import AnnouncementViewHeader from "./Components/AnnouncementHeader";
import useFetchAnnouncementById from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Announcement/useFetchAnnouncementById";
import { ImSpinner3 } from "react-icons/im";
import Spinner from "../../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../../Components/Common/NoDataFound";

const StudentMainSection = () => {
  const { aid } = useParams();
  const { announcement, error, fetchAnnouncementById, loading } =
    useFetchAnnouncementById();

  useEffect(() => {
    fetchAnnouncementById(aid);
  }, [aid, fetchAnnouncementById]);

  let content;

  if (loading) {
    content = <Spinner />;
  } else if (error) {
    content = (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  } else if (!announcement) {
    content = <NoDataFound title="Announcement" />;
  } else {
    content = (
      <>
        <AnnouncementViewHeader announcement={announcement} />
        <div className="p-4 bg-white">
          {announcement.attachment && (
            <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg mb-4">
              <img
                src={announcement.attachment}
                alt="Announcement"
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
          )}

          <div
            className="text-gray-700 mb-6"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />
        </div>
      </>
    );
  }

  return (
    <div className="flex w-full">
      <SubjectSideBar />
      <div className="border-l w-full h-full">{content}</div>
    </div>
  );
};

export default StudentMainSection;
