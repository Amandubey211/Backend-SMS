import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import useFetchAnnouncementById from "../../../../../../Hooks/AuthHooks/Staff/Admin/Announcement/useFetchAnnouncementById";
import AnnouncementViewHeader from "./Components/AnnouncementViewHeader";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";

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
        <div className="p-4 bg-white border">
          {loading && <Spinner />}
          {error && <NoDataFound title="Announcement" />}
          {/* {announcement ? ( */}
          <>
            {announcement && announcement?.attachment && (
              <img
                src={announcement?.attachment || "default_image_url_here"}
                alt="Announcement"
                className=" w-full h-full "
              />
            )}

            <div
              className="text-gray-700 mb-6"
              dangerouslySetInnerHTML={{ __html: announcement?.content }}
            />
          </>
          {/* // ) : (
          //   <NoDataFound title="Announcement" />
          // )} */}
        </div>
      </div>
    </div>
  );
};

export default MainSection;
