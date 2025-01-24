import React, { useState, useEffect, useRef } from "react";
import {
  FaEllipsisV,
  FaChevronDown,
  FaChevronUp,
  FaPen,
  FaTrashAlt,
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaEye,
} from "react-icons/fa";
import { ImSpinner3 } from "react-icons/im";
import { RiDeleteBin5Line } from "react-icons/ri";
import { GrAttachment } from "react-icons/gr";
import ChapterItem from "./ChapterItem";
import DeleteModal from "../../../../../../Components/Common/DeleteModal";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import AddAttachment from "./AddAttachment";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { deleteChapter } from "../../../../../../Store/Slices/Admin/Class/Module/chapterThunk";
import { fetchModules } from "../../../../../../Store/Slices/Admin/Class/Module/moduleThunk";
import toast from "react-hot-toast";
import { deleteAttachmentThunk } from "../../../../../../Store/Slices/Admin/Class/Module/attachmentThunk";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";

const Chapter = ({ onEdit, chapterNumber, chapter }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chapterExpanded, setChapterExpanded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [attachmentToDelete, setAttachmentToDelete] = useState(null);
  const [attachmentLoading, setAttachmentLoading] = useState({});

  const {
    _id: chapterId,
    name: title,
    thumbnail: imageUrl,
    assignments,
    attachments,
    quizzes,
  } = chapter;

  const dispatch = useDispatch();
  const { cid, sid } = useParams();
  const { moduleId } = useSelector(
    (state) => state.admin.module.selectedModule
  );

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
    setDeleteModalOpen(true);
    setMenuOpen(false);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteChapter({ moduleId, chapterId, sid }));
      setDeleteModalOpen(false);
      dispatch(fetchModules({ cid, sid }));
    } catch (error) {
      toast.error("Error deleting chapter.");
    }
  };

  const handleAddAttachment = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleDeleteAttachment = async () => {
    if (!attachmentToDelete) return;

    setAttachmentLoading((prev) => ({
      ...prev,
      [attachmentToDelete.url]: true,
    }));

    try {
      await dispatch(
        deleteAttachmentThunk({
          chapterId,
          subjectId: sid,
          fileUrl: attachmentToDelete.url,
        })
      );
      toast.success("Attachment deleted successfully");
    } catch (error) {
      toast.error("Error deleting attachment.");
    } finally {
      setAttachmentLoading((prev) => ({
        ...prev,
        [attachmentToDelete.url]: false,
      }));
      setAttachmentToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  const toggleChapter = () => {
    setChapterExpanded((prev) => !prev);
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

  const openPreviewModal = (url, type) => {
    setPreviewUrl(url);
    setPreviewType(type);
  };

  const closePreviewModal = () => {
    setPreviewUrl(null);
    setPreviewType(null);
  };

  return (
    <div className="mb-4 p-1 bg-white rounded-lg border-b relative">
      {/* Chapter Header */}
      <div className="flex items-center justify-between mb-2 relative">
        <div className="flex items-center">
          <img
            src={imageUrl}
            alt={`Chapter ${chapterNumber}`}
            className="w-12 h-12 mr-4 rounded-lg"
          />
          <div className="flex flex-col">
            <h2 className="font-semibold text-md">{title}</h2>
            <div className="flex gap-1 items-center">
              <p className="text-gray-500">Chapter {chapterNumber}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 relative">
          <ProtectedAction requiredPermission="add attachment">
            <div className="relative">
              <button
                className="border p-2 rounded-full hover:bg-gray-100 text-red-600"
                aria-label="Add Attachment"
                onClick={handleAddAttachment}
              >
                <GrAttachment />
              </button>

              {attachments?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-100 opacity-90 text-red-900 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {attachments?.length}
                </span>
              )}
            </div>
          </ProtectedAction>

          <button
            className="border p-2 rounded-full hover:bg-gray-100 relative"
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
              <ul>
                <ProtectedAction requiredPermission="edit chapter">
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
                </ProtectedAction>
                <ProtectedAction requiredPermission="delete chapter">
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
                </ProtectedAction>
              </ul>
            </div>
          )}
          <button
            className="border p-2 rounded-full hover:bg-gray-100"
            onClick={toggleChapter}
            aria-label="Toggle Chapter"
            aria-expanded={chapterExpanded}
            aria-controls={`chapter-content-${chapterId}`}
          >
            {chapterExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>

      {/* Chapter Content */}
      {chapterExpanded && (
        <ProtectedSection title="Chapters" requiredPermission="view Chapters">
          <div
            id={`chapter-content-${chapterId}`}
            className="mt-2 transition-all duration-300 ease-in-out"
          >
            <div className="flex flex-col space-y-4">
              {/* Attachments */}
              {attachments?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-green-600">
                    Attachments ({attachments?.length})
                  </h3>
                  <div className="grid grid-cols-1 gap-2 mb-2">
                    {attachments?.map((attachment, index) => (
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
                              <p className="text-gray-700 text-sm truncate max-w-xs overflow-hidden whitespace-nowrap">
                                {attachment.name}
                              </p>
                              <p className="text-md">{attachment.label}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                openPreviewModal(
                                  attachment.url,
                                  attachment.type
                                )
                              }
                              className="text-green-500 transition p-1 border rounded-full transform hover:scale-110 cursor-pointer"
                              aria-label="Preview"
                            >
                              <FaEye size={20} />
                            </button>
                            <ProtectedAction requiredPermission="delete Attachment">
                              <button
                                type="button"
                                className="text-red-500 transition p-1 border rounded-full transform hover:scale-110 cursor-pointer"
                                onClick={() => {
                                  setAttachmentToDelete(attachment);
                                  setDeleteModalOpen(true);
                                }}
                                disabled={attachmentLoading[attachment.url]}
                              >
                                {attachmentLoading[attachment.url] ? (
                                  <ImSpinner3
                                    size={20}
                                    className="animate-spin text-gray-700"
                                  />
                                ) : (
                                  <RiDeleteBin5Line size={20} />
                                )}
                              </button>
                            </ProtectedAction>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignments and Quizzes */}
              <div>
                {/* {assignments?.length > 0 || quizzes?.length > 0 ? (
                <>
                  {assignments?.map((assignment, index) => (
                    <ChapterItem
                      key={index}
                      type="assignment"
                      title={assignment.name}
                      id={assignment._id}
                      isPublished={assignment.isPublished}
                    />
                  ))}
                  {quizzes?.map((quiz, index) => (
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
                  No Assignment or Quizz
                </p>
              )} */}
                {assignments?.length > 0 ||
                  (quizzes?.length > 0 && (
                    <>
                      {assignments?.map((assignment, index) => (
                        <ChapterItem
                          key={index}
                          type="assignment"
                          title={assignment.name}
                          id={assignment._id}
                          isPublished={assignment.isPublished}
                        />
                      ))}
                      {quizzes?.map((quiz, index) => (
                        <ChapterItem
                          key={index}
                          type="quiz"
                          title={quiz.name}
                          id={quiz._id}
                          isPublished={quiz.isPublished}
                        />
                      ))}
                    </>
                  ))}
              </div>
            </div>
          </div>
        </ProtectedSection>
      )}

      {/* Delete Modal for Chapter */}
      <DeleteModal
        isOpen={deleteModalOpen && attachmentToDelete === null}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={title}
      />

      {/* Delete Modal for Attachment */}
      <DeleteModal
        isOpen={deleteModalOpen && attachmentToDelete !== null}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteAttachment}
        title={attachmentToDelete?.label || "Attachment"}
      />

      {isSidebarOpen && (
        <Sidebar
          width="60%"
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          title={`Add Attachment (${title})`}
        >
          <AddAttachment
            chapterData={{ title, chapterId, sid }}
            onClose={handleSidebarClose}
          />
        </Sidebar>
      )}

      {previewUrl && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={closePreviewModal}
          ></div>
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-transform duration-300 max-w-3xl w-full p-6 relative">
            <button
              onClick={closePreviewModal}
              className="absolute top-2 right-2 p-2 px-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-colors duration-500 ease-in-out shadow-lg"
            >
              ✕
            </button>
            <div className="flex justify-center">
              <div className="overflow-y-auto max-h-[80vh] w-full">
                {previewType === "application/pdf" ? (
                  <embed
                    src={previewUrl}
                    type="application/pdf"
                    width="100%"
                    height="500px"
                    className="max-h-[80vh] overflow-y-auto rounded-md"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-[80vh] w-full object-contain rounded-md"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chapter;
