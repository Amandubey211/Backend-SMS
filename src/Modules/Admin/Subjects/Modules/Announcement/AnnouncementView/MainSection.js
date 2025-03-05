import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnnouncementById } from "../../../../../../Store/Slices/Admin/Class/Announcement/announcementThunk";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import AnnouncementViewHeader from "./Components/AnnouncementViewHeader";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";

const MainSection = () => {
  const { aid } = useParams();
  const dispatch = useDispatch();
  const { announcement, loading, error } = useSelector(
    (state) => state.admin.announcements
  );

  useEffect(() => {
    dispatch(fetchAnnouncementById(aid));
  }, [aid, dispatch]);

  return (
    <div className="flex w-full h-full">
      <SubjectSideBar />
      <ProtectedSection
        requiredPermission={PERMISSIONS.ANNOUNCEMENT_BY_ID}
        title="Announcement "
      >
        <div className="border-l w-full  ">
          <AnnouncementViewHeader />
          <div className="p-4 bg-white ">
            {loading ? (
              <Spinner />
            ) : error ? (
              <NoDataFound title="Announcement" />
            ) : announcement ? (
              <>
                {announcement.attachment && (
                  <img
                    src={announcement.attachment}
                    alt="Announcement"
                    className="w-full h-full"
                  />
                )}
                <div
                  className="text-gray-700 mb-6 "
                  dangerouslySetInnerHTML={{ __html: announcement.content }}
                />
              </>
            ) : null}
          </div>
        </div>
      </ProtectedSection>
    </div>
  );
};

export default MainSection;
