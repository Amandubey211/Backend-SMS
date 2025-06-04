import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Drawer, Button, message, Switch, Modal, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateTimeTable, deleteTimeTable, getClassTimeTable } from '../../../../../Store/Slices/Admin/asctimetable/asctimetablethunk'; // Adjust the import path as needed
import TimeTableForm from '../../Components/TimeTableForm';

const ClassTimeTable = ({ selectedClass, selectedSection }) => {
  const dispatch = useDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

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
  }, [dispatch, selectedClass, selectedSection]);

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

  const handleTogglePublish = () => {
    const newPublishStatus = !isPublished;
    setIsPublished(newPublishStatus);

    dispatch(
      updateTimeTable({
        timetableData: { ...ascClassTimeTableData, isPublished: newPublishStatus },
      })
    )
      .unwrap()
      .then(() => {
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

  const getColorForTeachers = (teachers) => {
    if (!teachers || teachers.length === 0) return 'bg-red-300';
    return 'bg-white';
  };

  const AllData = ascClassTimeTableData || [];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {AllData?.length >= 1 ? (
        AllData.map((data, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-lg shadow-md mb-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xl font-semibold text-gray-800 mb-1">
                  Class Timetable
                </p>
                <p className="text-gray-500">
                  Timings: <span className="font-medium">{data.startTime || 'N/A'}</span> to{' '}
                  <span className="font-medium">{data.endTime || 'N/A'}</span>
                </p>
                <div className="mt-2">
                  {data?.days?.map((day, index) => (
                    <Tag key={index} color="blue" className="mb-1">
                      {day}
                    </Tag>
                  ))}
                </div>
              </div>
              <div className="flex space-x-4">
                <Tag
                  color={isPublished ? 'green' : 'red'}
                  className="py-1 px-3 rounded-md text-sm"
                >
                  {isPublished ? 'Published' : 'Unpublished'}
                </Tag>
                <Switch
                  checked={isPublished}
                  onChange={handleTogglePublish}
                  checkedChildren="On"
                  unCheckedChildren="Off"
                />
                <Button
                  icon={<FaTrashAlt />}
                  type="primary"
                  danger
                  onClick={() => handleDeleteConfirmation(data)}
                >
                  Delete
                </Button>
              </div>
            </div>

            <table className="w-full table-auto border border-gray-300 rounded-md">
              <thead>
                <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-left">
                  <th className="px-4 py-2 border text-center">Time</th>
                  <th className="px-4 py-2 border text-center">Subject</th>
                  <th className="px-4 py-2 border text-center">Teacher</th>
                </tr>
              </thead>
              <tbody>
                {data?.generatedTimeTabel?.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-4 py-2 border text-center">{item?.timing?.startTime || ''} - {item?.timing?.endTime || ''}</td>
                    <td className="px-4 py-2 border text-center">{item?.subjectName || '-'}</td>
                    <td className={`px-4 py-2 border text-center ${getColorForTeachers(item?.teacherName)}`}>
                      {item?.teacherName || 'Not Assigned'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-full p-8 bg-white rounded-lg shadow-md flex flex-col items-center">
            <span className="text-6xl mb-4">📜</span>
            <p className="text-lg font-medium text-gray-700">Timetable Not Available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassTimeTable;
