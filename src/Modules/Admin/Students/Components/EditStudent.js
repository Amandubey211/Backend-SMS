import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useAssignStudentToGroup from '../../../../Hooks/AuthHooks/Staff/Admin/Students/useAssignStudentToGroup ';

const EditStudent = ({ studentId, onClose, fetchGroups }) => {
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const { editStudent, loading, error } = useAssignStudentToGroup();

  // Access sectionsList from Redux store
  const sections = useSelector((state) => state.Class.sectionsList);
  const groups = useSelector((state) => state.Class.groupsList)

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await editStudent(studentId,selectedGroup, selectedSection);
      fetchGroups();
      onClose();
    } catch (err) {
      console.error('Error moving student to section:', err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="section" className="block text-sm font-medium text-gray-700">
            Select Section
          </label>
          <select
            id="section"
            value={selectedSection}
            onChange={handleSectionChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select</option>
            {sections.map((section) => (
              <option key={section._id} value={section._id}>
                {section.sectionName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="section" className="block text-sm font-medium text-gray-700">
            Select Group
          </label>
          <select
            id="group"
            value={selectedGroup}
            onChange={handleGroupChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select</option>
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.groupName}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {loading ? 'Updating...' : 'Update Student'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default EditStudent;
