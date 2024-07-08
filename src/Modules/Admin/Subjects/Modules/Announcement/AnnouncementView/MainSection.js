<<<<<<< HEAD
import React from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import AnnouncementViewHeader from "./Components/AnnouncementHeader";
import { assignmentDetails } from "../../Assignments/AssignmentComponents/MockData";
import { RiListCheck3, RiAddFill } from "react-icons/ri";

const MainSection = () => {
  const { description } = assignmentDetails;
  return (
    <div className="flex w-full">
      <SubjectSideBar />
      <div className="border-l w-full">
        <AnnouncementViewHeader />
        <div className="p-4 bg-white ">
       
      
        <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg mb-4">
            <img
              src="https://s3-alpha-sig.figma.com/img/799f/05d7/de5dca43c9f926af7d7e7a944d33810b?Expires=1719792000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ABVpAPyHqGhNhpYMdDHk3i0bWbCvB0odFA1Hi9gmOetAfx~Sj~dZexaPjkqOUzrI16~ooiHKdGmfBIMRJN38KfVnb0cAJg2T-CH6k6-IndZ-YIKHgf-6Ef9~QBzVXstarfK~c-H~l9sYqCQUWtr1kSeLAI26uxQi53QvAE6mo7pwY1HI0o2D6KTJfqtbBWAWEOGunXjDTW7PpehzYIMsIpvWUOe69AH8ln-o0wvpTI5EAJG6Jo47YDPeI1igItIkX2c9d16N71AhzF-kb9~YKTPJWmQ83rROqgkrYdvojYtCmwvY-x~jQhsH2z~8t2713AvXO8xxYyRP8xtDtDuyoA__"
              alt="Assignment"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
          <p className="text-gray-700 mb-6">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
=======
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
>>>>>>> main
