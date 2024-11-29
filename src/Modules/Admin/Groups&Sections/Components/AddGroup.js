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

const AddGroup = ({ group, isUpdate, groupId, onClose }) => {
  const { t } = useTranslation("admClass");
  const [groupName, setGroupName] = useState("");
  const [seatLimit, setSeatLimit] = useState(5);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [leader, setLeader] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [seatLimitError, setSeatLimitError] = useState(""); // Add error state for seat limit

  const dispatch = useDispatch();
  const { cid } = useParams();

  // Get unassigned students and loading/error state from Redux store
  const { unassignedStudents, loading, error } = useSelector((store) => ({
    unassignedStudents: store.admin.group_section.unassignedStudentsList,
    loading: store.admin.group_section.loading,
    error: store.admin.group_section.error,
  }));

  const { studentsList } = useSelector((store) => store.admin.students);
  console.log(studentsList, "allStudentsList");

  // Preload data when editing a group
  useEffect(() => {
    if (isUpdate && group) {
      setGroupName(group?.groupName || ""); // Set group name
      setSeatLimit(group?.seatLimit || 5); // Set seat limit
      setSelectedStudents(group?.students || []); // Set selected students
      setLeader(group?.leader || null); // Set leader
    }
    const classId = cid;
    dispatch(fetchStudentsByClassAndSection(classId));
  }, [isUpdate, group]); // Triggered only when editing

  useEffect(() => {
    dispatch(fetchUnassignedStudents(cid));
  }, [cid, dispatch]);

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

  const handleLeaderClick = useCallback((student) => {
    setLeader(student);
  }, []);

  const handleRemoveStudent = useCallback(
    (studentId) => {
      setSelectedStudents((prev) => prev.filter((s) => s._id !== studentId));
      if (leader && leader._id === studentId) {
        setLeader(null);
      }
    },
    [leader]
  );

  const handleRemoveLeader = useCallback(() => {
    setLeader(null);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate seat limit
    if (seatLimit <= 0) {
      setSeatLimitError(t("Seat limit must be a positive number"));
      return;
    } else {
      setSeatLimitError("");
    }

    const formData = {
      classId: cid,
      groupName,
      seatLimit,
      students: selectedStudents?.map((student) => student._id),
      leader: leader ? leader._id : null,
    };

    try {
      if (isUpdate) {
        await dispatch(updateGroup({ groupId, formData }));
      } else {
        await dispatch(createGroup(formData));
        setGroupName("");
        setSeatLimit(5); // Reset seat limit
        setSelectedStudents([]);
        setLeader(null);
      }
      onClose();
      dispatch(fetchSectionsByClass(cid)); // Fetch sections again after adding or editing
      dispatch(fetchGroupsByClass(cid));
      dispatch(fetchUnassignedStudents(cid));
    } catch (err) {
      toast.error(err.message || t("Something went wrong"));
    }
  };

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <div className="bg-white h-[80%] overflow-y-auto rounded-lg p-4 w-full max-w-md">
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("Group Name")}
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("Max. Number Of Students")}
            </label>
            <input
              type="number"
              value={seatLimit}
              onChange={(e) => setSeatLimit(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
            {seatLimitError && (
              <p className="text-red-500 text-sm">{seatLimitError}</p>
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              {t("Select Students")}
            </label>
            <div className="border border-gray-300 rounded-md p-3 flex flex-wrap">
              {selectedStudents?.map((student) => (
                <div
                  key={student._id}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md px-2 py-1 m-1 flex items-center space-x-1 truncate"
                >
                  <span>
                    {student.firstName} {student.lastName}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStudent(student._id)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="ml-auto flex items-center"
              >
                <FaChevronDown />
              </button>
            </div>
            {isDropdownOpen && (
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {studentsList?.length === 0 ? (
                  <div className="text-center p-4">
                    <FaUserSlash className="text-2xl text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-500">
                      {t("No students available in this class.")}
                    </p>
                  </div>
                ) : (
                  studentsList?.map((student) => (
                    <button
                      key={student._id}
                      type="button"
                      onClick={() => handleStudentSelect(student._id)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {student.firstName} {student.lastName}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("Name Of Team Leader (Optional)")}
            </label>
            {leader && (
              <div className="flex items-center space-x-2 bg-gradient-to-r rounded-lg text-white from-pink-500 to-purple-500">
                <GiImperialCrown className="text-yellow-400" />
                <span>
                  {leader.firstName} {leader.lastName}
                </span>
                <button type="button" onClick={handleRemoveLeader}>
                  <FaTimes />
                </button>
              </div>
            )}
            <div className="flex flex-wrap mt-2">
              {selectedStudents?.map((student) => (
                <div
                  key={student._id}
                  className={`px-2 py-1 rounded-lg cursor-pointer ${
                    leader && leader._id === student._id
                      ? "border border-pink-500"
                      : ""
                  }`}
                  onClick={() => handleLeaderClick(student)}
                >
                  {student.firstName} {student.lastName}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto mb-8">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md"
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
  );
};

export default React.memo(AddGroup);
