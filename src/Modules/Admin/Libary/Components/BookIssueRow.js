import React, { useState, useEffect, useRef } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { MdEdit } from "react-icons/md";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddIssue from "../Components/AddIssue"; // Now using AddIssue instead of EditBook
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";

const BookIssueRow = ({ item, handleSidebarOpen, setEditIssueData, role }) => {
  const { t } = useTranslation("admLibrary");
  const [showMenu, setShowMenu] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef(null);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleSidebarEditOpen = () => {
    setEditIssueData(item); // Set the current book issue data for editing
    setSidebarOpen(true);
    setShowMenu(false);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setEditIssueData(null); // Reset the selected book issue data after closing
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <tr className="text-left text-gray-700 relative hover:bg-gray-100 hover:shadow-md transition duration-200 ease-in-out">
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
      <td className="px-5 py-2 border-b border-gray-200">
        <div className="text-base">{item.classId?.className}</div>
        <div className="text-sm text-green-500">
          {item.sectionId?.sectionName}
        </div>
      </td>
      <td className="px-5 py-2 border-b border-gray-200">
        <div className="flex items-center bg-pink-50 rounded-lg p-1">
          <img
            src={item.bookId?.image}
            alt={t("Book")}
            className="h-10 w-10 mr-2 rounded-md"
          />
          <div className="flex flex-col">
            <span>{item?.bookId?.name}</span>
            <span className="text-[12px] text-green-600">
              {item?.bookId?.category}
            </span>
          </div>
        </div>
      </td>
      <td className="px-5 py-2 border-b border-gray-200 capitalize">
        {item.author}
      </td>
      <td className="px-5 py-2 border-b border-gray-200">
        <div>
          {t("Issue")}: {new Date(item.issueDate).toLocaleDateString()}
        </div>
        <div>
          {t("Return")}: {new Date(item.returnDate).toLocaleDateString()}
        </div>
      </td>
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
      {/* Conditionally render the Action column for non-teacher roles */}
      {role !== "teacher" && (
        <ProtectedAction requiredPermission={PERMISSIONS.EDIT_ISSUE_BOOK}>
          <td className="px-5 py-2 border-b border-gray-200 relative">
            <button
              onClick={handleSidebarEditOpen}
              className="flex items-center gap-1 p-2 hover:bg-gray-200 w-auto text-left rounded-lg"
            >
              <MdEdit className="text-gray-500" />
              <span>{t("Edit")}</span>
            </button>

            {/* Sidebar for Editing Book Issue */}
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={handleSidebarClose}
              title={t("Edit Book Issue")}
              width="40%"
            >
              {item && (
                <ProtectedSection requiredPermission={PERMISSIONS.ISSUE_BOOK}>
                  <AddIssue
                    editIssueData={item} // Pass the current issue data for editing
                    onClose={handleSidebarClose}
                  />
                </ProtectedSection>
              )}
            </Sidebar>
          </td>
        </ProtectedAction>
      )}
    </tr>
  );
};

export default BookIssueRow;
