import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { GiImperialCrown } from "react-icons/gi";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  createGroup,
  updateGroup,
  fetchUnassignedStudents,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { useParams } from "react-router-dom";
import { FaUserSlash } from "react-icons/fa"; // Import an icon for no students

const AddGroup = ({ group, isUpdate, groupId, onClose }) => {
  const [groupName, setGroupName] = useState(group?.groupName || "");
  const [seatLimit, setSeatLimit] = useState(group?.seatLimit || 5);
  const [selectedStudents, setSelectedStudents] = useState(
    group?.students || []
  );
  const [leader, setLeader] = useState(group?.leader || null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const unassignedStudents = useSelector(
    (store) => store.admin.group_section.unassignedStudentsList
  );
  const { loading, error } = useSelector((store) => store.admin.group_section);
  const dispatch = useDispatch();
  const { cid } = useParams();

  useEffect(() => {
    if (isUpdate && group) {
      setGroupName(group.groupName);
      setSeatLimit(group.seatLimit);
      setSelectedStudents(group.students);
      setLeader(group.leader);
    }
  }, [isUpdate, group]);

  useEffect(() => {
    dispatch(fetchUnassignedStudents(cid));
  }, [cid, dispatch]);

  const handleStudentSelect = useCallback(
    (studentId) => {
      const student = unassignedStudents.find((s) => s._id === studentId);
      if (student && !selectedStudents.some((s) => s._id === studentId)) {
        setSelectedStudents((prev) => [...prev, student]);
      }
      setDropdownOpen(false);
    },
    [unassignedStudents, selectedStudents]
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

    const formData = {
      classId: cid,
      groupName,
      seatLimit,
      students: selectedStudents.map((student) => student._id),
      leader: leader ? leader._id : null,
    };

    try {
      if (isUpdate) {
        await dispatch(updateGroup({ groupId, formData }));
        onClose();
      } else {
        await dispatch(createGroup(formData));
        setGroupName("");
        setSeatLimit("");
        setSelectedStudents([]);
        setLeader(null);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <div className="bg-white h-[80%] overflow-y-auto rounded-lg p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4"></div>
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Group Name
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
              Max. Number Of Students
            </label>
            <input
              type="number"
              value={seatLimit}
              onChange={(e) => setSeatLimit(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Select Students
            </label>
            <div className="border border-gray-300 rounded-md p-2 flex flex-wrap">
              {selectedStudents.map((student) => (
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
                {unassignedStudents.length === 0 ? (
                  <div className="text-center p-4">
                    <FaUserSlash className="text-2xl text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-500">
                      No students available in this class.
                    </p>
                  </div>
                ) : (
                  unassignedStudents.map((student) => (
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
              Name Of Team Leader (Optional)
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
              {selectedStudents.map((student) => (
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
          {loading ? "Saving..." : isUpdate ? "Update Group" : "Add Group"}
        </button>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </form>
  );
};

export default React.memo(AddGroup);
