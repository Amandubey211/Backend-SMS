import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { GiImperialCrown } from "react-icons/gi";
import { FaChevronDown, FaTimes, FaUserSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  createGroup,
  updateGroup,
  fetchUnassignedStudents,
  fetchGroupsByClass,
  fetchSectionsByClass,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { useParams } from "react-router-dom";
import { fetchStudentsByClassAndSection } from "../../../../Store/Slices/Admin/Class/Students/studentThunks";
import { useTranslation } from "react-i18next";
import { Tooltip, Modal } from "antd";
import { motion } from "framer-motion";

const AddGroup = ({ group, isUpdate, groupId, onClose }) => {
  const { t } = useTranslation("admClass");
  const [groupName, setGroupName] = useState("");
  const [seatLimit, setSeatLimit] = useState(5);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [leader, setLeader] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [seatLimitError, setSeatLimitError] = useState("");
  const [isFullScreenModalOpen, setIsFullScreenModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { cid } = useParams();

  // Fetch student names for the dropdown
  useEffect(() => {
    // dispatch(fetchStudentsByClassAndSection(cid));
  }, [dispatch, cid]);

  // From Redux store
  const { unassignedStudents, groupsLoading: loading } = useSelector(
    (store) => store.admin.group_section.unassignedStudentsList
  );
  const { studentsList } = useSelector((store) => store.admin.students);

  // Preload data when editing
  useEffect(() => {
    if (isUpdate && group) {
      setGroupName(group?.groupName || "");
      setSeatLimit(group?.seatLimit || 5);
      setSelectedStudents(group?.students || []);
      setLeader(group?.leader || null);
    }
  }, [isUpdate, group]);

  // Fetch unassigned students
  useEffect(() => {
    dispatch(fetchUnassignedStudents(cid));
  }, [cid, dispatch]);

  // Add student
  const handleStudentSelect = useCallback(
    (studentId) => {
      const student = studentsList.find((s) => s._id === studentId);
      if (student && !selectedStudents.some((s) => s._id === studentId)) {
        setSelectedStudents((prev) => [...prev, student]);
      }
      setDropdownOpen(false);
    },
    [studentsList, selectedStudents]
  );

  // Toggle leader
  const handleToggleLeader = useCallback(
    (student) => {
      if (leader && leader._id === student._id) {
        // Unset leader
        setLeader(null);
      } else {
        // Set as leader
        setLeader(student);
      }
    },
    [leader]
  );

  // Remove a student
  const handleRemoveStudent = useCallback(
    (studentId) => {
      setSelectedStudents((prev) => prev.filter((s) => s._id !== studentId));
      if (leader && leader._id === studentId) {
        setLeader(null);
      }
    },
    [leader]
  );

  // Validate & submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure seatLimit is a number and greater than 0
    const numericSeatLimit = Number(seatLimit);
    if (numericSeatLimit <= 0) {
      setSeatLimitError(t("Seat limit must be a positive number"));
      return;
    } else {
      setSeatLimitError("");
    }

    const formData = {
      classId: cid,
      groupName,
      seatLimit: numericSeatLimit, // Ensure it's sent as a number
      students: selectedStudents?.map((student) => student._id),
      leader: leader ? leader._id : null,
    };

    try {
      if (isUpdate) {
        dispatch(updateGroup({ groupId, formData }));
      } else {
        dispatch(createGroup(formData));
        setGroupName("");
        setSeatLimit(5);
        setSelectedStudents([]);
        setLeader(null);
      }
      onClose();
      dispatch(fetchSectionsByClass(cid));
      dispatch(fetchGroupsByClass(cid));
      dispatch(fetchUnassignedStudents(cid));
    } catch (err) {
      toast.error(err.message || t("Something went wrong"));
    }
  };

  // Preview up to 5 selected students
  const renderSelectedStudentsPreview = () => {
    if (!selectedStudents || selectedStudents.length === 0) return null;

    const maxPreview = 5;
    const preview = selectedStudents?.slice(0, maxPreview);
    const extraCount = selectedStudents?.length - maxPreview;

    return (
      <>
        {preview.map((student) => {
          const isLeader = leader && leader?._id === student?._id;
          return (
            <Tooltip
              key={student?._id}
              title={
                <div className="flex items-center space-x-3">
                  <img
                    src={student.profile || ""}
                    alt={`${student?.firstName} ${student?.lastName}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {student?.firstName} {student?.lastName}
                    </p>
                    {/* <p className="text-xs text-gray-500">
                      {student.presentSectionId || t("No Section")}
                    </p> */}
                  </div>
                </div>
              }
              placement="top"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 bg-gray-200 rounded px-3 py-2 text-sm cursor-pointer"
                onClick={() => handleToggleLeader(student)}
              >
                <img
                  src={student.profile || ""}
                  alt={`${student.firstName} ${student.lastName}`}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="truncate">
                  {student.firstName} {student.lastName}
                </span>
                {isLeader && (
                  <GiImperialCrown className="text-yellow-400 text-base" />
                )}
              </motion.div>
            </Tooltip>
          );
        })}
        {extraCount > 0 && (
          <div
            className="bg-gray-300 rounded px-3 py-2 text-sm cursor-pointer"
            onClick={() => setIsFullScreenModalOpen(true)}
          >
            +{extraCount}
          </div>
        )}
      </>
    );
  };

  // Fullscreen modal content
  const renderAllSelectedStudents = () => {
    return (
      <div className="grid grid-cols-2 gap-4">
        {selectedStudents.map((student) => {
          const isLeader = leader && leader._id === student._id;
          return (
            <motion.div
              key={student._id}
              whileHover={{ scale: 1.03 }}
              className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50"
              onClick={() => handleToggleLeader(student)}
            >
              <img
                src={student.profile || ""}
                alt={`${student.firstName} ${student.lastName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-base font-semibold">
                  {student.firstName} {student.lastName}
                </p>
                {/* <p className="text-xs text-gray-500">
                  {student.presentSectionId || t("No Section")}
                </p> */}
              </div>
              {isLeader && (
                <GiImperialCrown className="text-yellow-400 text-xl flex-shrink-0" />
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <form className="flex flex-col h-full" onSubmit={handleSubmit}>
        <div className="bg-white h-[80%] overflow-y-auto rounded-lg p-5 w-full max-w-md">
          <div className="flex flex-col space-y-6">
            {/* Group Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Group Name")}
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base"
                required
              />
            </div>

            {/* Seat Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Max. Number Of Students")}
              </label>
              <input
                type="number"
                value={seatLimit}
                onChange={(e) => setSeatLimit(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base"
                required
              />
              {seatLimitError && (
                <p className="text-red-500 text-sm mt-1">{seatLimitError}</p>
              )}
            </div>

            {/* Select Students */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Select Students")}
              </label>
              <div className="border border-gray-300 rounded-md p-3 flex flex-wrap gap-2">
                {selectedStudents?.map((student) => (
                  <Tooltip
                    key={student._id}
                    title={
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.profile || ""}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold">
                            {student.firstName} {student.lastName}
                          </p>
                          {/* <p className="text-xs text-gray-500">
                            {student.presentSectionId || t("No Section")}
                          </p> */}
                        </div>
                      </div>
                    }
                    placement="top"
                  >
                    <div className="bg-gray-200 rounded px-3 py-2 flex items-center space-x-2 text-sm">
                      <span className="truncate">
                        {student.firstName} {student.lastName}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStudent(student._id)}
                        className="hover:text-red-500 text-sm"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </Tooltip>
                ))}
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="ml-auto flex items-center"
                >
                  <FaChevronDown className="text-base" />
                </button>
              </div>
              {isDropdownOpen && (
                <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  {studentsList?.length === 0 ? (
                    <div className="text-center p-4">
                      <FaUserSlash className="text-2xl text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-500 mt-2">
                        {t("No students available in this class.")}
                      </p>
                    </div>
                  ) : (
                    /* Each dropdown item now shows avatar, name, and section. */
                    studentsList?.map((student) => (
                      <button
                        key={student._id}
                        type="button"
                        onClick={() => handleStudentSelect(student._id)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={student.profile || ""}
                            alt={`${student.firstName} ${student.lastName}`}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-semibold">
                              {student.firstName} {student.lastName}
                            </p>
                            {/* <p className="text-xs text-gray-500">
                              {student.presentSectionId || t("No Section")}
                            </p> */}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Name Of Team Leader (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Name Of Team Leader (Optional)")}
              </label>
              <div className="mt-2 flex items-center gap-3 flex-wrap">
                {/* Show up to 5 badges + “+X” for more */}
                {renderSelectedStudentsPreview()}
                {/* Optional "View All" button if more than 5 selected */}
                {/* {selectedStudents?.length > 1 && (
                  <Button
                    size="middle"
                    onClick={() => setIsFullScreenModalOpen(true)}
                  >
                    {t("View All")}
                  </Button>
                )} */}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto mb-6">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-5 rounded-md text-base"
            disabled={loading}
          >
            {loading
              ? t("Please Wait...")
              : isUpdate
              ? t("Update Group")
              : t("Add Group")}
          </button>
        </div>
      </form>

      {/* Full Screen Modal */}
      <Modal
        visible={isFullScreenModalOpen}
        title={t("Selected Students")}
        onCancel={() => setIsFullScreenModalOpen(false)}
        style={{ top: 10, padding: 0, bottom: 10 }}
        width="100vw"
        bodyStyle={{ height: "85vh", overflowY: "auto" }}
      >
        {selectedStudents.length === 0 ? (
          <div className="text-center p-6">
            <FaUserSlash className="text-4xl text-gray-400 mx-auto" />
            <p className="text-base text-gray-500 mt-2">
              {t("No students selected yet.")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {renderAllSelectedStudents()}
          </div>
        )}
      </Modal>
    </>
  );
};

export default React.memo(AddGroup);
