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
  const [activeSection, setActiveSection] = useState("attachments"); // Default to attachments only
  const [searchQuery, setSearchQuery] = useState("");
  const [isItemsLoading, setIsItemsLoading] = useState(false);
  const [errorLoading, setErrorLoading] = useState(null);

  const {
    _id: chapterId,
    name: title,
    thumbnail: imageUrl,
    // assignments,
    attachments,
    // quizzes,
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

  const getFileIcon = (attachment) => {
    if (attachment.type.startsWith("image/")) {
      return (
        <div className="w-10 h-10 mr-2 flex-shrink-0">
          <img
            src={attachment.url}
            alt={attachment.name}
            className="w-full h-full object-cover rounded"
          />
        </div>
      );
    }

    switch (attachment.type) {
      case "application/pdf":
        return <FaFilePdf className="text-red-500 mr-2" size={24} />;
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <FaFileWord className="text-blue-500 mr-2" size={24} />;
      case "application/vnd.ms-powerpoint":
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        return <FaFilePowerpoint className="text-orange-500 mr-2" size={24} />;
      default:
        return <FaRegFileAlt className="text-gray-500 mr-2" size={24} />;
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

  const filteredAttachments = attachments
    ? attachments.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.label &&
            item.label.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  // Commented out for future use
  /*
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
  */

  const totalCount = filteredAttachments.length;
  // Commented out for future use
  // filteredAttachments.length +
  // filteredAssignments.length +
  // filteredQuizzes.length;

  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
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
          onClick={() => setActiveSection("attachments")}
          className={`cursor-pointer rounded-full border px-2 py-1 ${
            activeSection === "attachments"
              ? "bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white"
              : "bg-transparent text-gray-500"
          }`}
        >
          Attachments ({filteredAttachments.length})
        </Tag>
        {/* Commented out for future use */}
        {/*
        <Tag
          onClick={() => setActiveSection("assignments")}
          className={`cursor-pointer rounded-full border px-2 py-1 ${
            activeSection === "assignments"
              ? "bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white"
              : "bg-transparent text-gray-500"
          }`}
        >
          Assignments ({filteredAssignments.length})
        </Tag>
        <Tag
          onClick={() => setActiveSection("quizzes")}
          className={`cursor-pointer rounded-full border px-2 py-1 ${
            activeSection === "quizzes"
              ? "bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white"
              : "bg-transparent text-gray-500"
          }`}
        >
          Quiz ({filteredQuizzes.length})
        </Tag>
        */}
      </div>
    </div>
  );

  const renderEmptyState = (section) => {
    let content;
    switch (section) {
      case "attachments":
        content = (
          <ProtectedAction
            requiredPermission={PERMISSIONS.UPLOAD_CHAPTER_FILES}
          >
            <Button
              className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white border-0"
              onClick={handleAddAttachment}
              icon={<GrAttachment size={12} />}
              size="small"
            >
              Add Attachment
            </Button>
          </ProtectedAction>
        );
        break;
      // Commented out for future use
      /*
      case "assignments":
        content = (
          <ProtectedAction requiredPermission={PERMISSIONS.CREATE_ASSIGNMENT}>
            <Link to={`/class/${cid}/${sid}/createassignment`}>
              <Button
                className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white border-0"
                icon={<FaRegFileAlt size={12} />}
                size="small"
              >
                Create Assignment
              </Button>
            </Link>
          </ProtectedAction>
        );
        break;
      case "quizzes":
        content = (
          <ProtectedAction requiredPermission={PERMISSIONS.CREATE_QUIZ}>
            <Link to={`/class/${cid}/${sid}/create_quiz`}>
              <Button
                className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white border-0"
                icon={<FaClipboardList size={12} />}
                size="small"
              >
                Create Quiz
              </Button>
            </Link>
          </ProtectedAction>
        );
        break;
      default:
        content = (
          <div className="flex gap-2">
            <ProtectedAction
              requiredPermission={PERMISSIONS.UPLOAD_CHAPTER_FILES}
            >
              <Button
                className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white border-0"
                onClick={handleAddAttachment}
                icon={<GrAttachment size={12} />}
                size="small"
              >
                Add Attachment
              </Button>
            </ProtectedAction>
            <ProtectedAction requiredPermission={PERMISSIONS.CREATE_QUIZ}>
              <Link to={`/class/${cid}/${sid}/create_quiz`}>
                <Button
                  className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white border-0"
                  icon={<FaClipboardList size={12} />}
                  size="small"
                >
                  Create Quiz
                </Button>
              </Link>
            </ProtectedAction>
            <ProtectedAction requiredPermission={PERMISSIONS.CREATE_ASSIGNMENT}>
              <Link to={`/class/${cid}/${sid}/createassignment`}>
                <Button
                  className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white border-0"
                  icon={<FaRegFileAlt size={12} />}
                  size="small"
                >
                  Create Assignment
                </Button>
              </Link>
            </ProtectedAction>
          </div>
        );
      */
      default:
        content = (
          <ProtectedAction
            requiredPermission={PERMISSIONS.UPLOAD_CHAPTER_FILES}
          >
            <Button
              className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white border-0"
              onClick={handleAddAttachment}
              icon={<GrAttachment size={12} />}
              size="small"
            >
              Add Attachment
            </Button>
          </ProtectedAction>
        );
    }

    return (
      <div className="flex flex-col items-center justify-center py-4">
        {content}
      </div>
    );
  };

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
                className="border p-2 rounded-full hover:bg-gray-100 text-[#C83B62]"
                aria-label="Add Attachment"
                onClick={handleAddAttachment}
              >
                <GrAttachment />
              </button>
              {attachments?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#C83B62] to-[#7F35CD] opacity-90 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
              className="border p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring focus:ring-[#C83B62]"
              aria-label="Options menu"
            >
              <FaEllipsisV />
            </button>
          </Dropdown>
          <button
            className="border p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring focus:ring-[#C83B62]"
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
              ) : (
                <>
                  {activeSection === "attachments" && (
                    <div className="space-y-2">
                      {filteredAttachments.length > 0 ? (
                        <>
                          <h3 className="text-lg font-semibold">Attachments</h3>
                          {filteredAttachments.map((attachment, index) => (
                            <div
                              key={index}
                              className="flex items-center p-2 border rounded-md"
                            >
                              {getFileIcon(attachment)}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium capitalize truncate">
                                  {attachment.label || attachment.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
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
                                  className="p-1 text-[#7F35CD] hover:text-[#C83B62]"
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
                                  className="p-1 text-[#C83B62] hover:text-red-700"
                                  aria-label="Delete Attachment"
                                >
                                  <FaTrashAlt size={20} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        renderEmptyState("attachments")
                      )}
                    </div>
                  )}
                  {/* Commented out for future use */}
                  {/*
                  {(activeSection === "all" ||
                    activeSection === "assignments") && (
                    <div className="space-y-2">
                      {filteredAssignments.length > 0 ? (
                        <>
                          <h3 className="text-lg font-semibold">Assignments</h3>
                          {filteredAssignments.map((assignment, index) => (
                            <ChapterItem
                              key={`assignment-${index}`}
                              type="assignment"
                              title={assignment.name}
                              id={assignment._id}
                              isPublished={assignment.isPublished}
                            />
                          ))}
                        </>
                      ) : activeSection === "assignments" ? (
                        renderEmptyState("assignments")
                      ) : null}
                    </div>
                  )}
                  {(activeSection === "all" || activeSection === "quizzes") && (
                    <div className="space-y-2">
                      {filteredQuizzes.length > 0 ? (
                        <>
                          <h3 className="text-lg font-semibold">Quizzes</h3>
                          {filteredQuizzes.map((quiz, index) => (
                            <ChapterItem
                              key={`quiz-${index}`}
                              type="quiz"
                              title={quiz.name}
                              id={quiz._id}
                              isPublished={quiz.isPublished}
                            />
                          ))}
                        </>
                      ) : activeSection === "quizzes" ? (
                        renderEmptyState("quizzes")
                      ) : null}
                    </div>
                  )}
                  {activeSection === "all" && totalCount === 0 && (
                    <div className="flex flex-col items-center justify-center py-4">
                      <Empty description="No items found" />
                      {renderEmptyState("all")}
                    </div>
                  )}
                  */}
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
