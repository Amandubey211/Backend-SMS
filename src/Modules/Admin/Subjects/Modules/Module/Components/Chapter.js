import React, { useState } from "react";
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
  FaSearch,
  FaClipboardList,
  FaRegFileAlt,
} from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import ChapterItem from "./ChapterItem";
import DeleteModal from "../../../../../../Components/Common/DeleteModal";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import AddAttachment from "./AddAttachment";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { deleteChapter } from "../../../../../../Store/Slices/Admin/Class/Module/chapterThunk";
import { fetchModules } from "../../../../../../Store/Slices/Admin/Class/Module/moduleThunk";
import toast from "react-hot-toast";
import { deleteAttachmentThunk } from "../../../../../../Store/Slices/Admin/Class/Module/attachmentThunk";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../config/permission";
import {
  Dropdown,
  Menu,
  Modal,
  Tag,
  Input,
  Skeleton,
  Empty,
  Button,
} from "antd";
import { motion } from "framer-motion";

const Chapter = ({ onEdit, chapterNumber, chapter }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chapterExpanded, setChapterExpanded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [attachmentToDelete, setAttachmentToDelete] = useState(null);
  const [attachmentLoading, setAttachmentLoading] = useState({});
  const [activeSection, setActiveSection] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isItemsLoading, setIsItemsLoading] = useState(false);
  const [errorLoading, setErrorLoading] = useState(null);

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

  const handleDelete = () => setDeleteModalOpen(true);

  const menu = (
    <Menu>
      <Menu.Item key="edit" onClick={onEdit} style={{ minWidth: "150px" }}>
        <div className="flex items-center">
          <FaPen className="mr-2" />
          <span>Edit</span>
        </div>
      </Menu.Item>
      <Menu.Item
        key="delete"
        onClick={handleDelete}
        style={{ minWidth: "150px" }}
      >
        <div className="flex items-center">
          <FaTrashAlt className="mr-2" />
          <span>Delete</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  const menuMotion = (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {menu}
    </motion.div>
  );

  const confirmDelete = async () => {
    try {
      await dispatch(deleteChapter({ moduleId, chapterId, sid }));
      setDeleteModalOpen(false);
      dispatch(fetchModules({ cid, sid }));
    } catch (error) {
      toast.error("Error deleting chapter.");
    }
  };

  const handleAddAttachment = () => setIsSidebarOpen(true);
  const handleSidebarClose = () => setIsSidebarOpen(false);

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

  const toggleChapter = () => setChapterExpanded((prev) => !prev);

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

  // Open preview modal by setting URL and type.
  const openPreviewModal = (url, type) => {
    setPreviewUrl(url);
    setPreviewType(type);
  };

  const closePreviewModal = () => {
    setPreviewUrl(null);
    setPreviewType(null);
  };

  const filteredAttachments = attachments
    ? attachments.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.label &&
            item.label.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const filteredAssignments = assignments
    ? assignments.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  const filteredQuizzes = quizzes
    ? quizzes.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  const totalCount =
    filteredAttachments.length +
    filteredAssignments.length +
    filteredQuizzes.length;

  // Always show the header if items exist or if a search query is present.
  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
      <div className="w-full sm:w-1/3 mb-2 sm:mb-0">
        <Input.Search
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
        />
      </div>
      <div
        className="flex gap-1 justify-end"
        role="group"
        aria-label="Filter options"
      >
        <Tag
          onClick={() => setActiveSection("all")}
          className={`cursor-pointer rounded-full border px-2 py-1 ${
            activeSection === "all"
              ? "bg-pink-100 text-pink-800"
              : "bg-transparent text-gray-500"
          }`}
        >
          All ({totalCount})
        </Tag>
        <Tag
          onClick={() => setActiveSection("attachments")}
          className={`cursor-pointer rounded-full border px-2 py-1 ${
            activeSection === "attachments"
              ? "bg-pink-100 text-pink-800"
              : "bg-transparent text-gray-500"
          }`}
        >
          Attachments ({filteredAttachments.length})
        </Tag>
        <Tag
          onClick={() => setActiveSection("assignments")}
          className={`cursor-pointer rounded-full border px-2 py-1 ${
            activeSection === "assignments"
              ? "bg-pink-100 text-pink-800"
              : "bg-transparent text-gray-500"
          }`}
        >
          Assignments ({filteredAssignments.length})
        </Tag>
        <Tag
          onClick={() => setActiveSection("quizzes")}
          className={`cursor-pointer rounded-full border px-2 py-1 ${
            activeSection === "quizzes"
              ? "bg-pink-100 text-pink-800"
              : "bg-transparent text-gray-500"
          }`}
        >
          Quiz ({filteredQuizzes.length})
        </Tag>
      </div>
    </div>
  );

  // Smaller "No items found" placeholder.
  const renderPlaceholder = () => (
    <div className="flex flex-col items-center justify-center py-2">
      <Empty description="No items found" />
      <div className="mt-2 flex space-x-4">
        <Button
          type="primary"
          onClick={handleAddAttachment}
          icon={<GrAttachment size={16} />}
        >
          Add Attachment
        </Button>
        <Link to={`/class/${cid}/${sid}/create_quiz`}>
          <Button type="primary" icon={<FaClipboardList size={16} />}>
            Create Quiz
          </Button>
        </Link>
        <Link to={`/class/${cid}/${sid}/createassignment`}>
          <Button type="primary" icon={<FaRegFileAlt size={16} />}>
            Create Assignment
          </Button>
        </Link>
      </div>
    </div>
  );

  const handleRetry = () => setErrorLoading(null);

  return (
    <div className="mb-4 p-1 bg-white rounded-lg border-b relative">
      {/* Chapter Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <img
            src={imageUrl}
            alt={`Chapter ${chapterNumber}`}
            className="w-12 h-12 mr-4 rounded-lg"
          />
          <div className="flex flex-col">
            <h2 className="font-semibold capitalize text-md">{title}</h2>
            <p className="text-gray-500">Chapter {chapterNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ProtectedAction
            requiredPermission={PERMISSIONS.UPLOAD_CHAPTER_FILES}
          >
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
          <Dropdown
            overlay={menuMotion}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button
              className="border p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring focus:ring-pink-300"
              aria-label="Options menu"
            >
              <FaEllipsisV />
            </button>
          </Dropdown>
          <button
            className="border p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring focus:ring-pink-300"
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
        <div
          id={`chapter-content-${chapterId}`}
          className="mt-2 transition-all duration-300 ease-in-out"
        >
          <div className="flex flex-col space-y-4">
            {(totalCount > 0 || searchQuery !== "") && renderHeader()}
            {/* Scrollable Container */}
            <div className="max-h-48 overflow-y-auto">
              {errorLoading ? (
                <div role="alert" className="p-4 text-red-600">
                  Failed to load items.{" "}
                  <button
                    onClick={handleRetry}
                    className="underline focus:outline-none"
                  >
                    Retry
                  </button>
                </div>
              ) : isItemsLoading ? (
                <Skeleton active paragraph={{ rows: 3 }} />
              ) : totalCount === 0 ? (
                renderPlaceholder()
              ) : (
                <>
                  {(activeSection === "all" ||
                    activeSection === "attachments") &&
                    filteredAttachments.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Attachments</h3>
                        {filteredAttachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center p-2 border rounded-md"
                          >
                            {attachment.type === "application/pdf" ? (
                              <FaFilePdf
                                className="text-red-500 mr-2"
                                size={24}
                              />
                            ) : attachment.type === "application/msword" ||
                              attachment.type ===
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
                              <FaFileWord
                                className="text-blue-500 mr-2"
                                size={24}
                              />
                            ) : attachment.type ===
                                "application/vnd.ms-powerpoint" ||
                              attachment.type ===
                                "application/vnd.openxmlformats-officedocument.presentationml.presentation" ? (
                              <FaFilePowerpoint
                                className="text-orange-500 mr-2"
                                size={24}
                              />
                            ) : attachment.type.startsWith("image/") ? (
                              <img
                                src={attachment.url}
                                alt={attachment.name}
                                className="w-10 h-10 mr-2 object-cover rounded"
                              />
                            ) : (
                              <FaRegFileAlt
                                className="text-gray-500 mr-2"
                                size={24}
                              />
                            )}
                            <div>
                              <p className="font-medium capitalize">
                                {attachment.label}
                              </p>
                              <p className="text-xs text-gray-500">
                                {attachment.name}
                              </p>
                            </div>
                            <div className="ml-auto flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openPreviewModal(
                                    attachment.url,
                                    attachment.type
                                  );
                                }}
                                className="p-1 text-blue-500 hover:text-blue-700"
                                aria-label="View Attachment"
                              >
                                <FaEye size={20} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAttachmentToDelete(attachment);
                                  setDeleteModalOpen(true);
                                }}
                                className="p-1 text-red-500 hover:text-red-700"
                                aria-label="Delete Attachment"
                              >
                                <FaTrashAlt size={20} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  {(activeSection === "all" ||
                    activeSection === "assignments") &&
                    filteredAssignments.length > 0 && (
                      <div>
                        {filteredAssignments.map((assignment, index) => (
                          <ChapterItem
                            key={`assignment-${index}`}
                            type="assignment"
                            title={assignment.name}
                            id={assignment._id}
                            isPublished={assignment.isPublished}
                          />
                        ))}
                      </div>
                    )}
                  {(activeSection === "all" || activeSection === "quizzes") &&
                    filteredQuizzes.length > 0 && (
                      <div>
                        {filteredQuizzes.map((quiz, index) => (
                          <ChapterItem
                            key={`quiz-${index}`}
                            type="quiz"
                            title={quiz.name}
                            id={quiz._id}
                            isPublished={quiz.isPublished}
                          />
                        ))}
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={deleteModalOpen && !attachmentToDelete}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={title}
      />
      <DeleteModal
        isOpen={deleteModalOpen && attachmentToDelete}
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
      <Modal
        visible={!!previewUrl}
        footer={null}
        onCancel={closePreviewModal}
        centered
        closable
        aria-modal="true"
        modalRender={(modal) => (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {modal}
          </motion.div>
        )}
      >
        {previewType === "application/pdf" ? (
          <embed
            src={previewUrl}
            type="application/pdf"
            width="100%"
            height="500px"
            className="rounded-md"
          />
        ) : (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full object-contain rounded-md"
          />
        )}
      </Modal>
    </div>
  );
};

export default Chapter;
