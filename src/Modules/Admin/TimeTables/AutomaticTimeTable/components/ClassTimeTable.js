import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Drawer, Button, message, Switch, Modal, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateTimeTable, deleteTimeTable, getClassTimeTable } from '../../../../../Store/Slices/Admin/asctimetable/asctimetablethunk';
import TimeTableForm from '../../Components/TimeTableForm';
import { setRole } from '../../../../../Store/Slices/Common/Auth/reducers/authSlice';

const ClassTimeTable = ({ selectedClass, selectedSection, selectedClassName, selectedSectionName }) => {
  const dispatch = useDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [reloadTable, setReloadTable] = useState(false);
  const role = useSelector((store) => store.common.auth.role);
  const { ascClassTimeTableData, loading } = useSelector(
    (state) => state.admin.ascTimeTable
  );

  useEffect(() => {
    dispatch(
      getClassTimeTable({
        classId: selectedClass,
        sectionId: selectedSection,
      })
    );
    setReloadTable(false);

  }, [dispatch, selectedClass, selectedSection, reloadTable]);



  // Function to convert time string to minutes for sorting
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return Infinity;

    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes; // Convert hours and minutes to total minutes
  };


  // Function to sort timetable entries
  const sortTimetable = (timetable) => {
    if (!timetable || !timetable.generatedTimeTabel) return [];

    return [...timetable.generatedTimeTabel].sort((a, b) => {
      const aStart = a?.timing?.startTime ? timeToMinutes(a.timing.startTime) : Infinity;
      const bStart = b?.timing?.startTime ? timeToMinutes(b.timing.startTime) : Infinity;

      return aStart - bStart;
    });
  };


  const handleEdit = (record) => {
    setEditingTimetable(record);
    setIsDrawerOpen(true);
  };

  const handleDeleteConfirmation = (record) => {
    setRecordToDelete(record);
    setDeleteModalVisible(true);
  };

  const handleDelete = () => {
    dispatch(deleteTimeTable({ id: recordToDelete._id }))
      .unwrap()
      .then(() => {
        message.success('Timetable deleted successfully');
        setDeleteModalVisible(false);
        setReloadTable(true);
      })
      .catch((error) => {
        message.error('Failed to delete timetable');
        console.error('Failed to delete timetable:', error);
      });
  };

  const handleSave = (values) => {
    dispatch(updateTimeTable({ timetableData: values }))
      .unwrap()
      .then(() => {
        message.success('Timetable updated successfully');
        setIsDrawerOpen(false);
      })
      .catch((error) => {
        message.error('Failed to update timetable');
        console.error('Failed to update timetable:', error);
      });
  };

  const handleTogglePublish = (id, currentStatus) => {
    const newPublishStatus = !currentStatus;
    dispatch(
      updateTimeTable({
        timetableData: { id, publish: newPublishStatus },
      })
    )
      .unwrap()
      .then(() => {
        setReloadTable(true)
        message.success(`Timetable ${newPublishStatus ? 'published' : 'unpublished'} successfully`);
      })
      .catch((error) => {
        message.error('Failed to update publish status');
        console.error('Failed to update publish status:', error);
      });
  };

  const onClose = () => {
    setIsDrawerOpen(false);
    setEditingTimetable(null);
  };

  const getColorForTeachers = (item) => {
    if ((!item?.teacherName || item?.teacherName.length === 0) && item?.subjectId) return 'bg-red-300';
    return 'bg-white';
  };

  const AllData = ascClassTimeTableData || [];

  return (
    <div className=" min-h-screen">
      {AllData?.length >= 1 ? (
        AllData.map((data, index) => {
          // Sort the timetable entries
          const sortedTimetable = sortTimetable(data);

          return (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md mb-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-xl font-semibold text-gray-800 mb-1">
                    {selectedClassName ? selectedClassName + " " : ""}{selectedSectionName ? selectedSectionName + " " : ""} Timetable
                  </p>
                  <p className="text-gray-500">
                    Timings: <span className="font-medium">{data.startTime || 'N/A'}</span> to{' '}
                    <span className="font-medium">{data.endTime || 'N/A'}</span>
                  </p>
                  <div className="mt-2">
                    {data?.days?.map((day, index) => (
                      <Tag key={index} color="blue" className="mb-1">
                        {day.toUpperCase()}
                      </Tag>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    {(role === 'admin' || role === 'teacher') ? (
                      <div
                        className={`relative inline-flex items-center py-2 px-3 rounded-md text-sm font-medium cursor-pointer ${data.publish ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        onClick={() => handleTogglePublish(data._id, data.publish)}
                      >
                        {data?.publish ? 'Published' : 'Unpublished'}
                        <span className="ml-2 inline-block w-8 h-4 rounded-full bg-white relative">
                          <span
                            className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${data.publish ? 'left-4 bg-green-500' : 'left-0.5 bg-gray-500'}`}
                          />
                        </span>
                      </div>
                    ) : (
                      <Tag
                        color={data?.publish ? 'green' : 'red'}
                        className="py-1 px-3 rounded-md text-sm font-medium"
                      >
                        {data?.publish ? 'Published' : 'Unpublished'}
                      </Tag>
                    )}
                  </div>
                  {
                    (role === 'admin' || role === 'teacher') && <button
                      className="flex items-center bg-red-400 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => handleDeleteConfirmation(data)}
                    >
                      <FaTrashAlt className="mr-2" /> Delete
                    </button>
                  }

                </div>
              </div>

              <table className="w-full table-auto border border-gray-300 rounded-md">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-left">
                    <th className="px-4 py-2 border text-start">Time</th>
                    <th className="px-4 py-2 border text-start">Subject</th>
                    <th className="px-4 py-2 border text-start">Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTimetable.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                      <td className="px-4 py-2 border text-start">
                        {item?.timing?.startTime || ''} - {item?.timing?.endTime || ''}
                      </td>
                      <td className="px-4 py-2 border text-start">{item?.subjectName || '-'}</td>
                      <td className={`px-4 py-2 border text-start ${getColorForTeachers(item)}`}>
                        {item?.teacherName ? item?.teacherName : (item.subjectId ? 'Not Assigned' : 'Break')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Modal
                title="Confirm Deletion"
                visible={deleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setDeleteModalVisible(false)}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <p>Are you sure you want to delete this timetable?</p>
              </Modal>
            </div>
          );
        })
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-full h-full p-8 bg-white rounded-lg shadow-md flex flex-col items-center">
            <span className="text-6xl mb-4">📜</span>
            <p className="text-lg font-medium text-gray-700">Timetable Not Available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassTimeTable;