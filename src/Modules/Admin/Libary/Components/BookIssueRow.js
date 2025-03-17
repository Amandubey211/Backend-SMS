import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { UserOutlined } from "@ant-design/icons";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddIssue from "../Components/AddIssue";
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { Tooltip, Tag } from "antd";
import BookIcon from "../../../../Assets/LibraryAsset/book.png";
import moment from "moment";

const BookIssueRow = ({ item, setEditIssueData, role, handleSidebarOpen }) => {
  const { t } = useTranslation("admLibrary");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarEditOpen = () => {
    setEditIssueData(item);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setEditIssueData(null);
  };

  // Get profile image if available; otherwise, use default icon.
  const userProfile = item?.issuedTo?.userId?.profile?.trim();

  // User type and fallback values
  const userType = item?.issuedTo?.userType || "N/A";
  const className = item?.classId?.className || "No Class";
  const sectionName = item?.sectionId?.sectionName || "No Section";
  const issueDateStr = item?.issueDate
    ? moment(item.issueDate).format("DD-MM-YYYY")
    : "N/A";
  const returnDateStr = item?.returnDate
    ? moment(item.returnDate).format("DD-MM-YYYY")
    : "N/A";

  // Construct full name: if parent, use guardianName; otherwise use firstName + lastName
  const fullName =
    userType.toLowerCase() === "parent"
      ? item?.issuedTo?.userId?.guardianName || "No username"
      : item?.issuedTo?.userId?.firstName && item?.issuedTo?.userId?.lastName
      ? `${item.issuedTo.userId.firstName} ${item.issuedTo.userId.lastName}`
      : "No username";

  return (
    <tr className="text-left text-gray-700 hover:bg-gray-100 hover:shadow-md transition duration-200 ease-in-out">
      {/* Student Column */}
      <td className="px-5 py-3 border-b border-gray-200">
        <div className="flex flex-col">
          {/* Name & Profile Row */}
          <div className="flex items-center mb-1">
            {userProfile ? (
              <img
                src={userProfile}
                alt={t("Profile")}
                className="h-8 w-8 rounded-full mr-2"
              />
            ) : (
              <UserOutlined className="h-8 w-8 text-gray-400 mr-2" />
            )}
            <span>{fullName}</span>
          </div>

          {/* Admission Number on its own line with a slight top margin */}
          {item?.issuedTo?.userId?.role?.toLowerCase() === "student" && (
            <div>
              <Tag color="green">
                {item?.issuedTo?.userId?.admissionNumber || "Admission No: N/A"}
              </Tag>
            </div>
          )}
        </div>
      </td>

      {/* User Type Column as Tag */}
      <td className="px-5 py-3 border-b border-gray-200">
        <Tag color="blue">{userType}</Tag>
      </td>

      {/* Class & Section Column */}
      {/* <td className="px-5 py-2 border-b border-gray-200">
        <div className="text-base font-semibold">{className}</div>
        <div className="text-sm text-green-500">{sectionName}</div>
      </td> */}

      {/* Book Column */}
      <td className="px-5 py-2 border-b border-gray-200">
        <div className="flex items-center bg-pink-50 rounded-lg p-1">
          <img
            src={item?.bookId?.image || BookIcon}
            alt={t("Book")}
            className="h-10 w-10 mr-2 rounded-md"
          />
          <div className="flex flex-col">
            <span className="font-semibold">{item?.bookId?.name || "N/A"}</span>
            <span className="text-[12px] text-green-600">
              {item?.bookId?.categories?.[0]?.name || "N/A"}
            </span>
          </div>
        </div>
      </td>

      {/* Author Column */}
      <td className="px-5 py-2 border-b border-gray-200 capitalize">
        {item?.author || "N/A"}
      </td>

      {/* Issue & Return Dates Column */}
      <td className="px-5 py-2 border-b border-gray-200">
        <div>
          {t("Issue")}: {issueDateStr}
        </div>
        <div>
          {t("Return")}: {returnDateStr}
        </div>
      </td>

      {/* Status Column */}
      <td className="px-5 py-2 border-b border-gray-200">
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-md ${
            item?.status === "Returned"
              ? "bg-green-200 text-green-800"
              : item?.status === "Pending"
              ? "bg-sky-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {t(item?.status || "N/A")}
        </span>
      </td>

      {/* Action Column for non-teacher roles */}
      {role !== "teacher" && (
        <ProtectedAction requiredPermission={PERMISSIONS.EDIT_ISSUE_BOOK}>
          <td className="px-5 py-2 border-b border-gray-200">
            <Tooltip title={t("Edit")}>
              <button
                onClick={handleSidebarEditOpen}
                className="p-2 hover:bg-gray-200 rounded-lg text-blue-500"
              >
                <MdEdit size={20} />
              </button>
            </Tooltip>
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={handleSidebarClose}
              title={t("Edit Book Issue")}
              width="40%"
            >
              <ProtectedSection
                requiredPermission={PERMISSIONS.EDIT_ISSUE_BOOK}
              >
                <AddIssue editIssueData={item} onClose={handleSidebarClose} />
              </ProtectedSection>
            </Sidebar>
          </td>
        </ProtectedAction>
      )}
    </tr>
  );
};

export default BookIssueRow;
