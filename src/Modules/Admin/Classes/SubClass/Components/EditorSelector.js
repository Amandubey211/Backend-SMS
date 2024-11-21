import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';


const EditorSelector = ({ selectedUsers, setSelectedUsers, subject }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
 

  const AllTeachers = useSelector((store) => store.Teachers.allTeachers);

  const handleUserSelect = (teacher) => {
    if (!selectedUsers.some((user) => user._id === teacher._id)) {
      setSelectedUsers([...selectedUsers, teacher]);
    }
    setDropdownOpen(false);
  };

  const handleUserRemove = (teacherId) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== teacherId));
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  if (!subject) {
    return null; // Only render the component when subject is provided
  }

  return (
    <div className="relative w-full">
      <label
        htmlFor="who-can-edit"
        className="block text-sm font-medium text-gray-700"
      >
        Who Can Edit
      </label>
      <div className="border border-gray-300 rounded-md p-2 flex flex-wrap">
        {selectedUsers.map((user) => (
          <div
            key={user._id}
            className="bg-purple-100 text-purple-700 rounded-md px-2 py-1 m-1 flex items-center space-x-1 truncate"
            style={{ maxWidth: '8rem' }}
          >
            <span className="truncate">{user.fullName}</span>
            <button onClick={() => handleUserRemove(user._id)}>
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          id="who-can-edit"
          onClick={toggleDropdown}
          className="ml-auto flex items-center px-2 py-1"
        >
          <FaChevronDown className="w-4 h-4" />
        </button>
      </div>
      {isDropdownOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {AllTeachers.map((teacher) => (
            <button
              key={teacher._id}
              onClick={() => handleUserSelect(teacher)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {teacher.fullName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditorSelector;
