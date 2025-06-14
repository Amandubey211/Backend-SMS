import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Components/Header";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import { fetchDiscussionById } from "../../../../../../Store/Slices/Admin/Class/Discussion/discussionThunks";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";
import { Modal, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const MainSection = () => {
  const { did } = useParams();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Function to determine the file type based on the URL extension
  const getFileType = (url) => {
    if (!url) return null;
    const extension = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp"].includes(extension)) return "image";
    if (extension === "pdf") return "pdf";
    return "other"; // For DOCX or other file types
  };

  const attachmentType = getFileType(discussion.attachment);

  // Handle modal open/close
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
              <>
                {attachmentType === "image" ? (
                  <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg mb-4">
                    <img
                      src={discussion.attachment}
                      alt="Attachment"
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mb-4 flex gap-2 items-center">
                    <span className="font-mono capitalize">{attachmentType}:</span>
                    <Button
                      type="primary"
                      icon={<EyeOutlined />}
                      onClick={showModal}
                      className="flex items-center"
                    >
                      Preview Attachment
                    </Button>
                    <Modal
                      title="Attachment Preview"
                      open={isModalOpen}
                      onCancel={handleCancel}
                      footer={null}
                      width={800}
                    >
                      {attachmentType === "pdf" ? (
                        <iframe
                          src={discussion.attachment}
                          title="PDF Preview"
                          className="w-full h-[500px]"
                        />
                      ) : (
                        <div className="text-center">
                          <p className="mb-4">
                            Preview not available for this file type.
                          </p>
                          <a
                            href={discussion.attachment}
                            download
                            className="text-blue-500 underline"
                          >
                            Download {discussion.attachment.split("/").pop()}
                          </a>
                        </div>
                      )}
                    </Modal>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </ProtectedSection>
    </div>
  );
};

export default MainSection;