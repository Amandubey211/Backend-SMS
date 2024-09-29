import React, { useState, useEffect, useRef } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { MdEdit } from "react-icons/md";
import Sidebar from "../../../../Components/Common/Sidebar"; // Assuming you have the Sidebar component
import EditBook from "../Components/EditBook"; // Assuming you have the EditBook component

const BookIssueRow = ({ item }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [editBookData, setEditBookData] = useState(null); // Store selected book for editing
  const menuRef = useRef(null);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleSidebarOpen = () => {
    // Pass the book data and class information for editing
    setEditBookData({
      ...item.bookId,
      classId: item.classId?._id || "", // Pass the classId directly from item
    });
    setSidebarOpen(true);
    setShowMenu(false);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setEditBookData(null); // Reset the selected book after closing
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
    <tr className="text-left text-gray-700 relative">
      <td className="px-5 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <img
            src={item?.studentId?.profile}
            alt="Profile"
            className="h-8 w-8 rounded-full mr-2"
          />
          <span>{item.studentId?.firstName}</span>
        </div>
      </td>
      <td className="px-5 py-2 border-b border-gray-200">
        <div className="text-base">class-{item.classId?.className}</div>
        <div className="text-[12px]">section-{item.sectionId?.sectionName}</div>
      </td>
      <td className="px-5 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <img
            src={item.bookId?.image}
            alt="Book"
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
        <div>Issue: {new Date(item.issueDate).toLocaleDateString()}</div>
        <div>Return: {new Date(item.dueDate).toLocaleDateString()}</div>
      </td>
      <td className="px-5 py-2 border-b border-gray-200">
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
            item.status === "Returned"
              ? "bg-green-200 text-green-800"
              : item.status === "Pending"
              ? "bg-sky-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {item.status}
        </span>
      </td>
      <td className="px-5 py-2 border-b border-gray-200 relative">
        {/* Dots Menu */}
        <HiDotsVertical className="cursor-pointer" onClick={handleMenuToggle} />

        {showMenu && (
          <div
            ref={menuRef} // Attach ref to the menu
            className="absolute top-full right-0 w-24 bg-white border rounded-lg shadow-lg z-10"
          >
            <button
              onClick={handleSidebarOpen}
              className="flex items-center gap-2 p-2 hover:bg-gray-200 w-full text-left"
            >
              <MdEdit className="text-gray-500" />
              <span>Edit</span>
            </button>
          </div>
        )}

        {/* Sidebar for Editing */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          title="Edit Book Issue"
          width="40%"
        >
          {/* Pass the book data to EditBook */}
          {editBookData && (
            <EditBook book={editBookData} onClose={handleSidebarClose} />
          )}
        </Sidebar>
      </td>
    </tr>
  );
};

export default BookIssueRow;
