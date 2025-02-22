import React, { useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Header from "./Components/Header";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import { fetchDiscussionById } from "../../../../../../Store/Slices/Admin/Class/Discussion/discussionThunks";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";

const MainSection = () => {
  const { did } = useParams();
  const dispatch = useDispatch();

  const { discussion, loading, error } = useSelector(
    (state) => state.admin.discussions
  );

  // Callback to refetch the discussion
  const handleRefetchDiscussion = useCallback(() => {
    dispatch(fetchDiscussionById({ did }));
  }, [dispatch, did]);

  useEffect(() => {
    handleRefetchDiscussion();
  }, [handleRefetchDiscussion]);

  if (loading) return <Spinner />;
  if (error) return <NoDataFound />;
  if (!discussion) return <NoDataFound />;

  return (
    <div className="flex h-full w-full">
      <SubjectSideBar />
      <ProtectedSection
        requiredPermission={PERMISSIONS.DISCUSSION_BY_ID}
        title="Discussion View"
      >
        <div className="border-l w-full">
          <Header
            discussion={discussion}
            refetchDiscussion={handleRefetchDiscussion}
          />
          <div className="p-6 bg-white">
            <h1 className="text-lg font-semibold">{discussion?.title}</h1>
            <div className="text-gray-700 mb-3">
              <div dangerouslySetInnerHTML={{ __html: discussion?.content }} />
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
        </div>
      </ProtectedSection>
    </div>
  );
};

export default MainSection;
