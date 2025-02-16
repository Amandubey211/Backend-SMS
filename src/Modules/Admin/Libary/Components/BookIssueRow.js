import React, { useState, useEffect, useRef } from "react";
import { MdEdit } from "react-icons/md";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddIssue from "../Components/AddIssue";
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import BookIcon from "../../../../Assets/LibraryAsset/book.png";

const BookIssueRow = ({ item, setEditIssueData, role }) => {
  const { t } = useTranslation("admLibrary");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarEditOpen = () => {
    // Pass the complete row data to the parent and open the sidebar for editing
    setEditIssueData(item);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setEditIssueData(null);
  };

  return (
    <tr className="text-left text-gray-700 hover:bg-gray-100 hover:shadow-md transition duration-200 ease-in-out">
      {/* Student Column */}
      <td className="px-5 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <img
            src={item?.studentId?.profile}
            alt={t("Profile")}
            className="h-8 w-8 rounded-full mr-2"
          />
          <span>{item.studentId?.firstName}</span>
        </div>
      </td>
      {/* Class & Section Column */}
      <td className="px-5 py-2 border-b border-gray-200">
        <div className="text-base">{item.classId?.className}</div>
        <div className="text-sm text-green-500">{item.sectionId?.sectionName}</div>
      </td>
      {/* Book Column */}
      <td className="px-5 py-2 border-b border-gray-200">
        <div className="flex items-center bg-pink-50 rounded-lg p-1">
          <img
            src={item.bookId?.image || BookIcon}
            alt={t("Book")}
            className="h-10 w-10 mr-2 rounded-md"
          />
          <div className="flex flex-col">
            <span>{item?.bookId?.name || "N/A"}</span>
            <span className="text-[12px] text-green-600">
              {item?.bookId?.category || "N/A"}
            </span>
          </div>
        </div>
      </td>
      {/* Author Column */}
      <td className="px-5 py-2 border-b border-gray-200 capitalize">{item.author}</td>
      {/* Issue Date Column */}
      <td className="px-5 py-2 border-b border-gray-200">
        <div>
          {t("Issue")}: {new Date(item.issueDate).toLocaleDateString()}
        </div>
        <div>
          {t("Return")}: {new Date(item.returnDate).toLocaleDateString()}
        </div>
      </td>
      {/* Status Column */}
      <td className="px-5 py-2 border-b border-gray-200">
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-md ${
            item.status === "Returned"
              ? "bg-green-200 text-green-800"
              : item.status === "Pending"
              ? "bg-sky-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {t(item.status)}
        </span>
      </td>
      {/* Action Column for non-teacher roles */}
      {role !== "teacher" && (
        <ProtectedAction requiredPermission={PERMISSIONS.EDIT_ISSUE_BOOK}>
          <td className="px-5 py-2 border-b border-gray-200">
            <button
              onClick={handleSidebarEditOpen}
              className="flex items-center gap-1 p-2 hover:bg-gray-200 rounded-lg"
            >
              <MdEdit className="text-gray-500" />
              <span>{t("Edit")}</span>
            </button>
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={handleSidebarClose}
              title={t("Edit Book Issue")}
              width="40%"
            >
              <ProtectedSection requiredPermission={PERMISSIONS.EDIT_ISSUE_BOOK}>
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
