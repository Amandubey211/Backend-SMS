import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Drawer, Button, message, Switch } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateTimeTable, deleteTimeTable, getClassTimeTable } from '../../../../../Store/Slices/Admin/asctimetable/asctimetablethunk'; // Adjust the import path as needed
import TimeTableForm from '../../Components/TimeTableForm';

const ClassTimeTable = ({ selectedClass, selectedSection }) => {
  const dispatch = useDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [isPublished, setIsPublished] = useState(false);

  const { ascClassTimeTableData, loading, error } = useSelector(
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

  const handleDelete = (record) => {
    dispatch(deleteTimeTable({ id: record._id }))
      .unwrap()
      .then(() => {
        message.success('Timetable deleted successfully');
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

    // Dispatch the publish/unpublish action
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
    if (!teachers || teachers.length === 0) return 'bg-yellow-300';
    return 'bg-white';
  };

  const data = ascClassTimeTableData || {};

  return (<> {data?.startTime ?<div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">
            Timings: <span className="font-medium">{data.startTime || 'N/A'}</span> to{' '}
            <span className="font-medium">{data.endTime || 'N/A'}</span>
          </p>
          <p className="text-gray-500 mt-2">
            Applicable for:{' '}
            {data?.days?.map((day, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-600 rounded px-2 py-1 text-sm mr-2"
              >
                {day}
              </span>
            ))}
          </p>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">Publish:</span>
            <Switch
              checked={isPublished}
              onChange={handleTogglePublish}
              checkedChildren="On"
              unCheckedChildren="Off"
            />
          </div>

          <button
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => handleDelete(data)}
          >
            <FaTrashAlt className="mr-2" /> Delete
          </button>
        </div>
      </div>

      <table className="w-full border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Time</th>
            <th className="border px-4 py-2">Subject</th>
            <th className="border px-4 py-2">Teacher</th>
          </tr>
        </thead>
        <tbody>
          {data?.generatedTimeTabel?.map((item, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{item?.timing?.startTime || ''} - {item?.timing?.endTime || ''}</td>
              <td className="border px-4 py-2 text-center">{item?.subjectName || '-'}</td>
              <td
                className={`border px-4 py-2 text-center ${getColorForTeachers(item?.teacherName)}`}
              >
                {item?.teacherName || 'Not Assigned'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Drawer
        title="Edit Timetable"
        width={720}
        onClose={onClose}
        open={isDrawerOpen}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
          </div>
        }
      >
        <TimeTableForm
          editingTimetable={editingTimetable}
          onSubmit={handleSave}
          onClose={onClose}
          Type={data.type || 'automatic'}
        />
      </Drawer>
    </div>:<div className="flex items-center justify-center w-full h-full">
      <div className="p-8 rounded-lg flex flex-col items-center">
        <span className="text-6xl mb-4">📜</span>
        <p className="text-lg font-medium text-gray-700">TimeTable Not Available</p>
      </div>
    </div>}
  </>
   
  );
};

export default ClassTimeTable;
