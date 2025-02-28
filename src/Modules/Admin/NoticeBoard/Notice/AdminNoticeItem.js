import React from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setTitleToDelete } from "../../../../Store/Slices/Admin/NoticeBoard/Notice/noticeSlice";
import { useTranslation } from "react-i18next";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../config/permission";
import { Tag, Tooltip, Button } from "antd";
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
  const tagColor = priorityLower.includes("high")
    ? "red"
    : priorityLower.includes("low")
    ? "green"
    : "blue";

  return (
    <motion.div
      className="border-t"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Container click to expand/collapse accordion */}
      <div
        className="cursor-pointer p-2 flex flex-col bg-white"
        onClick={() => toggleAccordion(index)}
      >
        <div className="flex gap-4 px-3 py-2 items-center">
          {/* Notice Icon (larger size, no background color) */}
          <div className="flex items-center justify-center h-20 w-20">
            <img
              className="h-16 w-16 object-contain"
              src="https://res.cloudinary.com/duipcpitb/image/upload/v1739621137/ClassIcons/sdglpewia1pkns4xg2ny.webp"
              alt={t("Announcement Icon")}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-1">
            {/* Notice Title */}
            <h2 className="font-semibold text-lg">{notice?.title}</h2>

            {/* Grid for Date, Posted by, Priority, and Actions */}
            <div className="grid grid-cols-4 gap-2 items-center text-xs w-full">
              {/* Column 1: Dates */}
              <div className="flex gap-4 items-center col-span-2">
                {/* From Date */}
                <div className="flex items-center">
                  <IoCalendarOutline className="text-gray-400" />
                  <span className="ml-1 text-gray-500">
                    {t("From")}: {formattedStartDate}
                  </span>
                </div>
                {/* To Date */}
                <div className="flex items-center">
                  <IoCalendarOutline className="text-gray-400" />
                  <span className="ml-1 text-gray-500">
                    {t("To")}: {formattedEndDate}
                  </span>
                </div>
              </div>

              {/* Column 2: Posted By */}
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

              {/* Column 3: Priority & Actions */}
              <div className="flex justify-end items-center gap-3">
                <Tag color={tagColor} className="whitespace-nowrap">
                  {t(notice.priority)}
                </Tag>

                {/* Action Buttons + Expand/Collapse Icon */}
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()} // prevent toggling on button clicks
                >
                  {/* Show Edit/Delete only for author or Admin */}
                  {(notice?.authorId === userDetails?.userId ||
                    role === "admin") && (
                    <>
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
                    </>
                  )}

                  {/* Expand/Collapse Arrow */}
                  {activeIndex === index ? (
                    <MdExpandLess
                      className="text-xl cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAccordion(index);
                      }}
                    />
                  ) : (
                    <MdExpandMore
                      className="text-xl cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAccordion(index);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notice Description with fade-in animation */}
        {activeIndex === index && (
          <motion.div
            className="p-4 text-sm text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p>{notice?.description}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminNoticeItem;
