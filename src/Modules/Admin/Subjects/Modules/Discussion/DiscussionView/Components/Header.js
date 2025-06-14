import React, { useState, useRef, useEffect, Suspense } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineBlock } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { BsChat } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import { Tooltip } from "antd";
import Sidebar from "../../../../../../../Components/Common/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import DeleteModal from "../../../../../../../Components/Common/DeleteModal";
import {
  deleteDiscussion,
  updateDiscussion,
} from "../../../../../../../Store/Slices/Admin/Class/Discussion/discussionThunks";
import ProtectedAction from "../../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import Spinner from "../../../../../../../Components/Common/Spinner";
import ProtectedSection from "../../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../../config/permission";

const DiscussionMessage = React.lazy(() =>
  import("../../DiscussionMessage/DiscussionMessage")
);

const Header = ({ discussion, refetchDiscussion }) => {
  const { t } = useTranslation("admModule");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(discussion.publish);

  const navigate = useNavigate();
  const { cid, sid } = useParams();
  const dispatch = useDispatch();

  const { loading: deleteLoading } = useSelector(
    (state) => state.admin.discussions
  );

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleDeleteClick = () => {
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    await dispatch(deleteDiscussion({ discussionId: discussion._id }));
    navigate(`/class/${cid}/${sid}/discussions`);
    setModalOpen(false);
  };

  const handlePublishToggle = async () => {
    const updatedData = {
      ...discussion,
      publish: !isPublished,
    };

    await dispatch(
      updateDiscussion({
        discussionId: discussion._id,
        discussionData: updatedData,
      })
    );
    setIsPublished(!isPublished);
    refetchDiscussion();
  };

  // Format date with fallback
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "DD-MM-YYYY";

  return (
    <div className="flex items-end justify-between p-2 px-4 border-b">
      {/* Left Section */}
      <div className="flex items-center">
        <div className="ml-3">
          <h1 className="text-lg font-semibold">{discussion.createdBy}</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-600">{t("Discussion")}</span>
            <Tooltip
              title={
                isPublished
                  ? t("Discussion is published")
                  : t("Discussion is unpublished")
              }
              className="cursor-pointer"
            >
              {isPublished ? (
                <BsPatchCheckFill
                  aria-hidden="true"
                  className="text-green-600"
                />
              ) : (
                <MdOutlineBlock aria-hidden="true" className="text-red-600" />
              )}
            </Tooltip>
            {/*
            <ProtectedAction requiredPermission={PERMISSIONS.UPDATE_DISCUSSION}>
              <button
                className="flex items-center px-1 py-1 rounded-md border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                aria-label={
                  isPublished
                    ? t("Unpublish Discussion")
                    : t("Publish Discussion")
                }
                // onClick={handlePublishToggle}
              >
                {isPublished ? (
                  <BsPatchCheckFill
                    aria-hidden="true"
                    className="text-green-600"
                  />
                ) : (
                  <MdOutlineBlock
                    aria-hidden="true"
                    className="text-red-600"
                  />
                )}
              </button>
            </ProtectedAction>
            */}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col gap-1 items-end justify-center">
        <span className="text-sm text-gray-500">
          {t("Due")}: {formatDate(discussion.dueDate)}
        </span>
        <div className="flex items-center space-x-4">
          <ProtectedAction requiredPermission={PERMISSIONS.UPDATE_DISCUSSION}>
            <button
              className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
              aria-label={t("Edit Discussion")}
              onClick={() =>
                navigate(`/class/${cid}/${sid}/create_discussion`, {
                  state: { discussion },
                })
              }
            >
              <AiOutlineEdit aria-hidden="true" />
              <span>{t("Edit")}</span>
            </button>
          </ProtectedAction>
          <ProtectedAction requiredPermission={PERMISSIONS.DELETE_DISCUSSION}>
            <button
              className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-red-600 hover:bg-gray-100 transition"
              aria-label={t("Delete Discussion")}
              onClick={handleDeleteClick}
              disabled={deleteLoading}
            >
              <MdDelete aria-hidden="true" />
              <span>{t("Delete")}</span>
            </button>
          </ProtectedAction>
          <ProtectedAction
            requiredPermission={PERMISSIONS.CREATE_COMMENT_ON_DISCUSSION}
          >
            {isPublished ? (
              <button
                onClick={handleSidebarOpen}
                className="px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white items-center rounded-md flex gap-2"
              >
                <BsChat />
                <span>{t("Discussion")}</span>
              </button>
            ) : (
              <button
                onClick={() =>
                  toast.info(t("Discussion will be shown when it is published"))
                }
                disabled
                className="px-4 py-1 bg-gray-300 text-white items-center rounded-md flex gap-2 cursor-not-allowed"
              >
                <BsChat />
                <span>{t("Discussion")}</span>
              </button>
            )}
          </ProtectedAction>
        </div>
      </div>

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title={discussion.title || t("discussion")}
      />
      <Sidebar
        width="70%"
        title={t("Discussion")}
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
      >
        <Suspense fallback={<Spinner />}>
          <DiscussionMessage />
        </Suspense>
      </Sidebar>
    </div>
  );
};

export default Header;
