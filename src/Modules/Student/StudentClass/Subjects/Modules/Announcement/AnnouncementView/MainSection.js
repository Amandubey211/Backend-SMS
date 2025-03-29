import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { AiOutlineFileAdd } from "react-icons/ai";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import AnnouncementViewHeader from "./Components/AnnouncementHeader";
import Spinner from "../../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../../Components/Common/NoDataFound";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentAnnounceById,
  markAsReadStudentAnnounce,
} from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Announcement/announcement.action";

const StudentMainSection = () => {
  const { aid, cid, sid } = useParams();
  const dispatch = useDispatch();
  const { loading, error, announcement } = useSelector(
    (store) => store?.student?.studentAnnounce
  );
  // const location = useLocation()
  // const { id } = location.state;

  useEffect(() => {
    dispatch(fetchStudentAnnounceById({ aid, cid, sid }));
    dispatch(markAsReadStudentAnnounce({ id: aid, cid, sid }));
  }, [aid, cid, dispatch, sid]);

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
        <div className="p-4">
          {announcement?.attachment && (
            <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg mb-4">
              <img
                src={announcement?.attachment}
                alt="Announcement"
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
          )}

          <div
            className="text-gray-700 mb-6"
            dangerouslySetInnerHTML={{ __html: announcement?.content }}
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
