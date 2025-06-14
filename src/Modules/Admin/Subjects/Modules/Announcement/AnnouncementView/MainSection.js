import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnnouncementById } from "../../../../../../Store/Slices/Admin/Class/Announcement/announcementThunk";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import AnnouncementViewHeader from "./Components/AnnouncementViewHeader";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";
import { Modal, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const MainSection = () => {
  const { aid } = useParams();
  const dispatch = useDispatch();
  const { announcement, loading, error } = useSelector(
    (state) => state.admin.announcements
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAnnouncementById(aid));
  }, [aid, dispatch]);

  // Function to determine the file type based on the URL extension
  const getFileType = (url) => {
    if (!url) return null;
    const extension = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp"].includes(extension)) return "image";
    if (extension === "pdf") return "pdf";
    return "other"; // For DOCX or other file types
  };

  const attachmentType = getFileType(announcement?.attachment);

  // Handle modal open/close
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex w-full h-full">
      <SubjectSideBar />
      <ProtectedSection
        requiredPermission={PERMISSIONS.ANNOUNCEMENT_BY_ID}
        title="Announcement "
      >
        <div className="border-l w-full">
          <AnnouncementViewHeader />
          <div className="p-4 bg-white">
            {loading ? (
              <Spinner />
            ) : error ? (
              <NoDataFound title="Announcement" />
            ) : announcement ? (
              <>
                {announcement.attachment && (
                  <>
                    {attachmentType === "image" ? (
                      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg mb-4">
                        <img
                          src={announcement.attachment}
                          alt="Announcement Attachment"
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
                              src={announcement.attachment}
                              title="PDF Preview"
                              className="w-full h-[500px]"
                            />
                          ) : (
                            <div className="text-center">
                              <p className="mb-4">
                                Preview not available for this file type.
                              </p>
                              <a
                                href={announcement.attachment}
                                download
                                className="text-blue-500 underline"
                              >
                                Download {announcement.attachment.split("/").pop()}
                              </a>
                            </div>
                          )}
                        </Modal>
                      </div>
                    )}
                  </>
                )}
                <div
                  className="text-gray-700 mb-6"
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