import React from "react";
import {
  MdExpandMore,
  MdExpandLess,
  MdReportProblem,
  MdInfoOutline,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setTitleToDelete } from "../../../../Store/Slices/Admin/NoticeBoard/Notice/noticeSlice";
import { useTranslation } from "react-i18next";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../config/permission";
import { Tooltip, Button } from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { IoCalendarOutline } from "react-icons/io5";
import { motion } from "framer-motion";

const AdminNoticeItem = ({
  notice,
  index,
  activeIndex,
  toggleAccordion,
  handleEditNotice,
  setDeleteModalOpen,
  setNoticeToDelete,
}) => {
  const dispatch = useDispatch();
  const role = useSelector((store) => store.common.auth.role);
  const { userDetails } = useSelector((store) => store.common.user);
  const { t } = useTranslation("admNotice");

  const handleDelete = () => {
    setDeleteModalOpen(true);
    setNoticeToDelete(notice._id);
    dispatch(setTitleToDelete(notice.title));
  };

  const formattedStartDate = new Date(notice.startDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
  const formattedEndDate = notice.endDate
    ? new Date(notice.endDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  const priorityLower = notice.priority?.toLowerCase() || "";

  return (
    <motion.div
      className="border-t"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`transition-colors duration-300 ${
          activeIndex === index ? "bg-pink-50" : "bg-white"
        }`}
      >
        {/* Header: Clickable to toggle accordion */}
        <div
          className="cursor-pointer p-2 flex flex-col"
          onClick={() => toggleAccordion(index)}
        >
          <div className="flex gap-4 px-3 py-2 items-center">
            {/* Notice Icon */}
            <div className="flex items-center justify-center h-20 w-20">
              <img
                className="h-16 w-16 object-contain"
                src="https://res.cloudinary.com/duipcpitb/image/upload/v1739621137/ClassIcons/sdglpewia1pkns4xg2ny.webp"
                alt={t("Announcement Icon")}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-1">
              <h2 className="font-semibold text-lg">{notice?.title}</h2>
              {/* Grid for Date, Posted by, Priority, and Actions */}
              <div className="grid grid-cols-4 gap-2 items-center text-xs w-full">
                {/* Dates */}
                <div className="flex gap-4 items-center col-span-2">
                  <div className="flex items-center">
                    <IoCalendarOutline className="text-gray-400" />
                    <span className="ml-1 text-gray-500">
                      {t("From")}: {formattedStartDate}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <IoCalendarOutline className="text-gray-400" />
                    <span className="ml-1 text-gray-500">
                      {t("To")}: {formattedEndDate}
                    </span>
                  </div>
                </div>

                {/* Posted By */}
                <div className="flex items-center">
                  <UserOutlined className="mr-1 text-gray-500" />
                  <span className="text-gray-500">{t("Posted by")}:</span>
                  {notice?.authorName && notice.authorName.length > 15 ? (
                    <Tooltip title={notice.authorName}>
                      <span className="ml-1 text-gray-700 truncate max-w-[100px]">
                        {notice.authorName}
                      </span>
                    </Tooltip>
                  ) : (
                    <span className="ml-1 text-gray-700">
                      {notice?.authorName || "-"}
                    </span>
                  )}
                </div>

                {/* Priority Icon & Actions */}
                <div className="flex justify-end items-center gap-4">
                  {/* Priority Icon as a circle with border only */}
                  <Tooltip title={t(notice.priority)}>
                    <div className="flex items-center justify-center rounded-full border border-gray-300 w-10 h-10 hover:border-gray-400 transition-colors duration-200">
                      {priorityLower.includes("high") ? (
                        <MdReportProblem color="red" size={22} />
                      ) : priorityLower.includes("low") ? (
                        <MdInfoOutline color="green" size={22} />
                      ) : null}
                    </div>
                  </Tooltip>

                  {/* Action Buttons & Dropdown Toggle */}
                  <div
                    className="flex items-center gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {(notice?.authorId === userDetails?.userId ||
                      role === "admin") && (
                      <div className="flex items-center gap-2">
                        <ProtectedAction
                          requiredPermission={PERMISSIONS.UPDATE_NOTICE}
                        >
                          <Tooltip title={t("Edit Notice")}>
                            <Button
                              type="default"
                              shape="circle"
                              icon={<EditOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditNotice(notice);
                              }}
                            />
                          </Tooltip>
                        </ProtectedAction>
                        <ProtectedAction
                          requiredPermission={PERMISSIONS.REMOVE_NOTICE}
                        >
                          <Tooltip title={t("Delete Notice")}>
                            <Button
                              danger
                              shape="circle"
                              icon={<DeleteOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                              }}
                            />
                          </Tooltip>
                        </ProtectedAction>
                      </div>
                    )}
                    {/* Dropdown Toggle wrapped in a circle with border */}
                    <div
                      className="flex items-center justify-center rounded-full border border-gray-300 w-10 h-10 cursor-pointer hover:border-gray-400 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAccordion(index);
                      }}
                    >
                      {activeIndex === index ? (
                        <MdExpandLess className="text-xl" />
                      ) : (
                        <MdExpandMore className="text-xl" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description: Clicking inside does not toggle the accordion */}
        {activeIndex === index && (
          <motion.div
            className="p-4 text-sm text-gray-700"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div dangerouslySetInnerHTML={{ __html: notice?.description }} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminNoticeItem;
