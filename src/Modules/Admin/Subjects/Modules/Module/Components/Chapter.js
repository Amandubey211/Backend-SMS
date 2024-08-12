import React, { useState, useEffect, useRef } from "react";
import {
  FaEllipsisV,
  FaChevronDown,
  FaChevronUp,
  FaPen,
  FaTrashAlt,
  FaArrowRight,
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaEye,
} from "react-icons/fa";
import { MdDownload } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { GrAttachment } from "react-icons/gr";
import ChapterItem from "./ChapterItem";
import useDeleteChapter from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useDeleteChapter";
import useDeleteAttachment from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useDeleteAttachment";
import DeleteModal from "../../../../../../Components/Common/DeleteModal";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import AddAttachment from "./AddAttachment";

const Chapter = ({
  title,
  chapterNumber,
  imageUrl,
  assignments,
  chapterId,
  moduleId,
  quizzes,
  attachments,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  fetchModules,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [attachmentsExpanded, setAttachmentsExpanded] = useState(false); // For toggling attachments

  const { loading, error, success, deleteChapter } = useDeleteChapter();
  const { deleteAttachment } = useDeleteAttachment(fetchModules);
  const menuRef = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleDelete = () => {
    setModalOpen(true);
    setMenuOpen(false);
  };

  const confirmDelete = async () => {
    try {
      await deleteChapter(moduleId, chapterId);
      setModalOpen(false);
      onDelete();
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };

  const handleAddAttachment = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleDeleteAttachment = async (attachmentUrl) => {
    try {
      await deleteAttachment(moduleId, chapterId, [attachmentUrl]);
    } catch (error) {
      console.error("Error deleting attachment:", error);
    }
  };

  const toggleAttachments = () => {
    setAttachmentsExpanded((prev) => !prev);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "application/pdf":
        return <FaFilePdf className="text-red-500" size={24} />;
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <FaFileWord className="text-blue-500" size={24} />;
      case "application/vnd.ms-powerpoint":
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        return <FaFilePowerpoint className="text-orange-500" size={24} />;
      default:
        return null;
    }
  };

  const handleDownload = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mb-4 p-1 bg-white rounded-lg border-b relative">
      {/* Attachments Accordion on Top */}

      {/* Chapter Content */}
      <div className="flex items-center justify-between mb-2 relative">
        <div className="flex items-center">
          <img
            src={imageUrl}
            alt={`Chapter ${chapterNumber}`}
            className="w-12 h-12 mr-4 rounded-lg"
          />
          <div className="flex items-center">
            <div>
              <h2 className="font-semibold text-md">{title}</h2>
              <p className="text-gray-500">Chapter {chapterNumber}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 relative">
          <button
            className="border p-2 rounded-full hover:bg-gray-50"
            aria-label="Add Attachment"
            onClick={handleAddAttachment}
          >
            <GrAttachment />
          </button>
          <button
            className="border p-2 rounded-full hover:bg-gray-50 relative"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Options"
          >
            <FaEllipsisV />
          </button>
          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute top-full mt-2 right-0 bg-white border rounded-lg shadow-lg w-48 z-10"
              role="menu"
              aria-label="Options Menu"
            >
              <ul className="py-2">
                <li
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                    setMenuOpen(false);
                  }}
                  role="menuitem"
                >
                  <FaPen className="mr-2" /> Edit
                </li>
                <li
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  role="menuitem"
                >
                  <FaTrashAlt className="mr-2" /> Delete
                </li>
                <li
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  role="menuitem"
                >
                  <FaArrowRight className="mr-2" /> Move
                </li>
              </ul>
            </div>
          )}
          <button
            className="border p-2 rounded-full hover:bg-gray-50"
            onClick={onToggle}
            aria-label="Toggle Chapter"
          >
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>
      <div className="ml-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <button
              className="flex items-center space-x-1 text-sm font-semibold text-purple-800 hover:underline"
              onClick={toggleAttachments}
            >
              <span>Attachments ({attachments.length})</span>
              {attachmentsExpanded ? (
                <FaChevronUp className="ml-1" />
              ) : (
                <FaChevronDown className="ml-1" />
              )}
            </button>
          </div>
        </div>
        {attachmentsExpanded && attachments.length > 0 && (
          <div className="mt-2">
            <div className="grid grid-cols-1 gap-2 mb-2">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex flex-col p-2 border rounded-md transform transition duration-100 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getFileIcon(attachment.type) || (
                        <img
                          src={attachment.url}
                          alt={attachment.name}
                          className="h-8 w-8 object-cover rounded-md"
                        />
                      )}
                      <div className="flex flex-col ml-4">
                        <p className="text-gray-700 text-sm truncate max-w-xs">
                          {attachment.name}
                        </p>
                        <p className="text-md">{attachment.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 transition p-1 border rounded-full transform hover:scale-110 cursor-pointer"
                        aria-label="Preview"
                      >
                        <FaEye size={20} />
                      </a>
                      {/* <button
                        onClick={() =>
                          handleDownload(attachment.url, attachment.name)
                        }
                        className="text-blue-500 transition p-1 border rounded-full transform hover:scale-110 cursor-pointer"
                        aria-label="Download"
                      >
                        <MdDownload size={20} />
                      </button> */}
                      <button
                        type="button"
                        className="text-red-500 transition p-1 border rounded-full transform hover:scale-110 cursor-pointer"
                        onClick={() => handleDeleteAttachment(attachment.url)}
                      >
                        <RiDeleteBin5Line size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {isExpanded && (
        <div className="ml-10 py-2">
          {assignments.length || quizzes.length ? (
            <>
              {assignments.map((assignment, index) => (
                <ChapterItem
                  key={index}
                  type="assignment"
                  title={assignment.name}
                  id={assignment._id}
                  isPublished={assignment.isPublished}
                />
              ))}
              {quizzes.map((quiz, index) => (
                <ChapterItem
                  key={index}
                  type="quiz"
                  title={quiz.name}
                  id={quiz._id}
                  isPublished={quiz.isPublished}
                />
              ))}
            </>
          ) : (
            <p className="py-2 bg-gray-50 italic text-gray-500 text-center">
              No Data found
            </p>
          )}
        </div>
      )}

      <DeleteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title={title}
      />

      {isSidebarOpen && (
        <Sidebar
          width="60%"
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          title="Add Attachment"
        >
          <AddAttachment
            chapterData={{ title, chapterId, moduleId }}
            onClose={handleSidebarClose}
            fetchModules={fetchModules}
          />
        </Sidebar>
      )}
    </div>
  );
};

export default Chapter;
