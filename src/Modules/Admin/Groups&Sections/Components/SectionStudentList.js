import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button, Modal, Popover, Empty } from "antd";
import { MoreOutlined, EditOutlined } from "@ant-design/icons";
import { HiOutlineX } from "react-icons/hi";

import Sidebar from "../../../../Components/Common/Sidebar";
import AssignStudent from "./AssignStudent"; // <-- For "Update Section"
import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";

/*
  Props:
    - onSeeGradeClick(student)
    - activeSectionId
    - activeSection
    - students: array of relevant + fuzzy-filtered students
    - loading: boolean (from store)
    - error: any
*/

const SectionStudentList = ({
  onSeeGradeClick,
  activeSectionId,
  activeSection,
  students,
  loading,
  error,
}) => {
  // For the "Update Section" popup
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // For the "Full Details" modal (currently commented out usage)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsStudent, setDetailsStudent] = useState(null);

  // -------------------- Conditional Rendering --------------------
  if (loading) {
    return <SectionStudentListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Failed to load students. Please try again later.
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 text-center">
        <Empty description="No students found." />
      </div>
    );
  }

  // -------------------- Handlers --------------------
  const handleOpenAssignSidebar = (student) => {
    setSelectedStudent(student);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedStudent(null);
  };

  const openDetailsModal = (student) => {
    setDetailsStudent(student);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setDetailsStudent(null);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0.6, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-2"
      >
        {/* Sleek Header Row */}
        <div className="flex items-center justify-between p-4 bg-pink-50 rounded mb-2">
          <div className="flex-shrink-0 w-1/4 text-sm font-semibold">
            Student Info
          </div>
          <div className="flex-shrink-0 w-1/4 text-sm font-semibold">
            Email / Contact
          </div>
          <div className="flex-shrink-0 w-1/4 text-sm font-semibold">
            Guardian Info
          </div>
          <div className="flex-shrink-0 w-1/8 text-sm font-semibold text-center">
            Grade
          </div>
          <div className="flex-shrink-0 w-1/8 text-sm font-semibold text-center">
            Actions
          </div>
        </div>

        <div className="space-y-2">
          {students.map((student) => (
            <motion.div
              key={student._id}
              layout
              initial={{ scale: 0.95, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between p-4 border-b border-gray-200 rounded bg-white relative"
            >
              {/* Student basic info */}
              <div className="flex items-center flex-shrink-0 w-1/4">
                <img
                  src={student?.profile || profileIcon}
                  alt={student?.firstName || "First"}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex flex-col">
                  <div className="text-sm font-medium truncate">
                    {student?.firstName} {student?.lastName || ""}
                  </div>
                  <div className="text-xs text-gray-500">
                    {student?.admissionNumber || "Admission #"}
                  </div>
                </div>
              </div>
              {/* Email / Contact */}
              <div className="flex flex-col w-1/4 truncate text-sm">
                <span className="truncate">{student?.email || "No email"}</span>
                <span className="truncate">
                  {student?.contactNumber || "N/A"}
                </span>
              </div>
              {/* Guardian Info */}
              <div className="flex flex-col w-1/4 truncate text-sm">
                <span className="truncate">
                  {student?.guardianRelationToStudent || "N/A"}
                </span>
                <span className="truncate">
                  {student?.guardianContactNumber || "N/A"}
                </span>
              </div>

              {/* See Grade Button with micro-animation */}
              <div className="flex-shrink-0 w-1/8">
                <button
                  onClick={() => onSeeGradeClick(student)}
                  className="px-3 py-1 text-green-500 font-semibold text-sm border border-green-500 rounded-md transition-transform transform hover:scale-105 hover:bg-green-50"
                >
                  See Grade
                </button>
              </div>

              {/* Actions Popover */}
              <div className="flex-shrink-0 w-1/8 text-center">
                <Popover
                  placement="bottomRight"
                  trigger="click"
                  content={
                    <div className="flex flex-col">
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenAssignSidebar(student)}
                      >
                        Update Section
                      </Button>

                      {/*
                      <Button
                        type="text"
                        icon={<InfoCircleOutlined />}
                        onClick={() => openDetailsModal(student)}
                      >
                        Full Details
                      </Button>
                      */}
                    </div>
                  }
                >
                  <Button type="text" icon={<MoreOutlined />} />
                </Popover>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar for "Update Section" */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          title="Update Section"
        >
          {selectedStudent && (
            <AssignStudent
              name={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
              section={selectedStudent?.sectionName || ""}
              studentId={selectedStudent._id}
              imageUrl={selectedStudent.profile}
            />
          )}
        </Sidebar>
      </motion.div>

      {/* Ant Design Modal for Full Details */}
      <Modal
        visible={isDetailsModalOpen}
        onCancel={closeDetailsModal}
        footer={null}
        title="Student Details"
        centered
        bodyStyle={{ backgroundColor: "#fff7f7" }}
        className="rounded-lg"
      >
        {detailsStudent && (
          <div className="p-4">
            <div className="flex items-center">
              <img
                src={detailsStudent?.profile || profileIcon}
                alt={detailsStudent?.firstName}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h2 className="text-lg font-semibold">
                  {detailsStudent.firstName} {detailsStudent.lastName}
                </h2>
                <p className="text-sm text-gray-600">
                  Admission: {detailsStudent.admissionNumber || "N/A"}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p>
                <strong>Email:</strong> {detailsStudent.email || "No email"}
              </p>
              <p>
                <strong>Contact:</strong>{" "}
                {detailsStudent.contactNumber || "N/A"}
              </p>
              <p>
                <strong>Guardian:</strong>{" "}
                {detailsStudent.guardianRelationToStudent || "N/A"}
              </p>
              <p>
                <strong>Guardian Contact:</strong>{" "}
                {detailsStudent.guardianContactNumber || "N/A"}
              </p>
            </div>
          </div>
        )}
        <div className="text-right mt-4">
          <Button
            onClick={closeDetailsModal}
            type="primary"
            danger
            icon={<HiOutlineX />}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default SectionStudentList;

/* ------------------------------ */
/* SectionStudentListSkeleton    */
/* ------------------------------ */
const SectionStudentListSkeleton = () => {
  return (
    <div className="p-2 space-y-2">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded animate-pulse"
        >
          <div className="flex items-center flex-shrink-0 w-1/4 space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div>
              <div className="h-3 w-24 bg-gray-300 rounded mb-1"></div>
              <div className="h-3 w-16 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="flex flex-col w-1/4 space-y-1">
            <div className="h-3 w-24 bg-gray-300 rounded"></div>
            <div className="h-3 w-16 bg-gray-300 rounded"></div>
          </div>
          <div className="flex flex-col w-1/4 space-y-1">
            <div className="h-3 w-24 bg-gray-300 rounded"></div>
            <div className="h-3 w-16 bg-gray-300 rounded"></div>
          </div>
          <div className="w-1/8">
            <div className="h-8 w-20 bg-gray-300 rounded"></div>
          </div>
          <div className="w-1/8">
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
