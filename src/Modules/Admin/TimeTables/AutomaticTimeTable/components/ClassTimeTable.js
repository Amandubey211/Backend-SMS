import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Drawer, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { updateTimeTable, deleteTimeTable, fetchTimeTablesForClass } from '../../../../../Store/Slices/Admin/asctimetable/asctimetablethunk'; // Adjust the import path as needed
import TimeTableForm from '../../Components/TimeTableForm'; // Adjust the import path as needed
const ClassTimeTable = ({ selectedClass, selectedSection }) => {
  // console.log('Selected Class:', selectedClass);
  // console.log('Selected Class:', selectedSection);
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchTimeTablesForClass(selectedClass, selectedSection));
        console.log('Fetched Timetable Data:', response.data);
        setData(response.data);

      }
      catch (error) {
        console.error('Failed to fetch timetable data:', error);
        message.error('Failed to fetch timetable data');
      }
    }
    fetchData();
  }, [selectedClass, selectedSection,dispatch]);
  const handleEdit = (record) => {
    setEditingTimetable(record);
    console.log('Editing record:', record);
    setIsDrawerOpen(true);
  };

  const handleDelete = (record) => {
    dispatch(deleteTimeTable({ id: record.id }))
      .unwrap()
      .then(() => {
        message.success('Timetable deleted successfully');
        setData(data.filter(item => item.id !== record.id));
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
        setData(data.map(item => item.id === values.id ? values : item));
        setIsDrawerOpen(false);
      })
      .catch((error) => {
        message.error('Failed to update timetable');
        console.error('Failed to update timetable:', error);
      });
  };

  const onClose = () => {
    setIsDrawerOpen(false);
    setEditingTimetable(null);
  };

  return (
    <>
    Class 
    </>
    // <div className="p-4">
    //   <div className="flex justify-between items-center mb-4">
    //     <h2 className="text-xl font-bold">
    //       {data.className} - Section {data.sectionName}
    //     </h2>
    //     <div className="flex space-x-4">
    //       <button
    //         className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    //         onClick={() => handleEdit(data)}
    //       >
    //         <FaEdit className="mr-2" /> Edit
    //       </button>
    //       <button
    //         className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    //         onClick={() => handleDelete(data)}
    //       >
    //         <FaTrashAlt className="mr-2" /> Delete
    //       </button>
    //     </div>
    //   </div>
    //   <table className="w-full border border-gray-300 shadow-md">
    //     <thead>
    //       <tr className="bg-gray-100">
    //         <th className="border px-4 py-2">Timing</th>
    //         <th className="border px-4 py-2">Subject</th>
    //         <th className="border px-4 py-2">Teacher</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {data.timetable.map((item, index) => (
    //         <tr key={index} className="hover:bg-gray-50">
    //           <td className="border px-4 py-2">{item.time}</td>
    //           <td className="border px-4 py-2">{item.subject}</td>
    //           <td className="border px-4 py-2">{item.teacher}</td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    //   <Drawer
    //     title="Edit Timetable"
    //     width={720}
    //     onClose={onClose}
    //     visible={isDrawerOpen}
    //     bodyStyle={{ paddingBottom: 80 }}
    //     footer={
    //       <div style={{ textAlign: 'right' }}>
    //         <Button onClick={onClose} style={{ marginRight: 8 }}>
    //           Cancel
    //         </Button>
    //       </div>
    //     }
    //   >
    //     <TimeTableForm
    //       editingTimetable={editingTimetable}
    //       onSubmit={handleSave}
    //       onClose={onClose}
    //       Type={"automatic"}
    //     />
    //   </Drawer>
    // </div>
  );
};

export default ClassTimeTable;
