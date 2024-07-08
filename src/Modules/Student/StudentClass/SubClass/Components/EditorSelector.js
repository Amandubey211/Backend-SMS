import React, { useState } from 'react';
import { FaChevronDown, FaTimes } from 'react-icons/fa';

const dummyUsers = [
  { id: 1, name: 'Aman Dubey' },
  { id: 2, name: 'Akash' },
  { id: 3, name: 'Rahul ' },
  { id: 4, name: 'Huda salik ' },

];

const EditorSelector = ({ selectedUsers, setSelectedUsers }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleUserSelect = (user) => {
    if (!selectedUsers.some(selectedUser => selectedUser.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setDropdownOpen(false);
  };

  const handleUserRemove = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative w-full">
       <label
          htmlFor="who-can-edit"
          className="block text-sm font-medium text-gray-700"
        >
          
          Who Can Edit
        </label>
      <div className="border border-gray-300 rounded-md p-2 flex flex-wrap">
    
        {selectedUsers.map(user => (
          <div
            key={user.id}
            className="bg-purple-100 text-purple-700 rounded-md px-2 py-1 m-1 flex items-center space-x-1 truncate"
            style={{ maxWidth: '8rem' }}
          >
            <span className="truncate">{user.name}</span>
            <button onClick={() => handleUserRemove(user.id)}>
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
        id='who-can-edit'
          onClick={toggleDropdown}
          className="ml-auto flex items-center px-2 py-1"
        >
          <FaChevronDown className="w-4 h-4" />
        </button>
      </div>
      {isDropdownOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {dummyUsers.map(user => (
            <button
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {user.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditorSelector;
