import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import PlayForWorkOutlinedIcon from '@mui/icons-material/PlayForWorkOutlined';
import { createTimetable, updateTimetable } from '../../../../Store/Slices/Admin/TimeTable/timetable.action';
import DashLayout from '../../../../Components/Admin/AdminDashLayout'; // Sidebar and navbar
import Layout from '../../../../Components/Common/Layout';

const CreateTimeTablePage = ({ timetable = {}, onClose }) => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.admin.class);

  const [columns, setColumns] = useState([
    { field: 'id', headerName: 'ID', width: 50, editable: false },
    { field: 'day', headerName: 'Day', width: 100, editable: true },
    { field: 'timeSlot', headerName: 'Time Slot', width: 150, editable: true },
    { field: 'subjectId', headerName: 'Subject ID', width: 150, editable: true },
    { field: 'teacherId', headerName: 'Teacher ID', width: 150, editable: true },
  ]);

  const [rows, setRows] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    name: timetable.name || '',
    classId: timetable.classId || '',
    startDate: timetable.startDate || '',
    endDate: timetable.endDate || '',
  });

  // Add a new row
  const handleAddRow = () => {
    const newRow = { id: rows.length + 1, day: '', timeSlot: '', subjectId: '', teacherId: '' };
    setRows([...rows, newRow]);
  };

  // Add a new column
  const handleAddColumn = () => {
    const newColumnField = `column${columns.length + 1}`;
    setColumns([...columns, { field: newColumnField, headerName: `Column ${columns.length + 1}`, width: 150, editable: true }]);
  };

  // Handle cell edits
  const processRowUpdate = (newRow) => {
    const updatedRows = rows.map((row) => (row.id === newRow.id ? newRow : row));
    setRows(updatedRows);
    return newRow;
  };

  // Submit the form
  const handleSubmit = (e) => {
    e.preventDefault();

    const timetableData = {
      name: formData.name,
      classId: formData.classId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      type: 'weekly',
      days: rows.map((row) => ({
        day: row.day,
        slots: [
          {
            startTime: row.timeSlot?.split('-')[0] || '',
            endTime: row.timeSlot?.split('-')[1] || '',
            subjectId: row.subjectId,
            teacherId: row.teacherId,
          },
        ],
      })),
    };

    if (timetable._id) {
      dispatch(updateTimetable({ id: timetable._id, data: timetableData }));
    } else {
      dispatch(createTimetable(timetableData));
    }

    onClose();
  };

  return (
    <Layout title="Create TimeTable | Student Diwan">
      <DashLayout>
        <div className="flex flex-col items-center justify-start w-full p-6">
          <h2 className="text-xl font-semibold mb-4">{timetable._id ? 'Edit' : 'Create'} TimeTable</h2>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* Form Inputs */}
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="border p-2 rounded w-full"
                required
              />
              <select
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Class</option>
                {classes.map((classItem) => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.className}
                  </option>
                ))}
              </select>
            </div>

            {/* Data Grid */}
            <div className="w-full mb-4">
              {/* Action Buttons */}
              <div className="flex justify-between mb-2">
                <Button variant="contained" onClick={handleAddColumn} startIcon={<AddBoxOutlinedIcon />}>
                  Add Column
                </Button>
                <Button variant="contained" onClick={handleAddRow} startIcon={<PlayForWorkOutlinedIcon />}>
                  Add Row
                </Button>
              </div>

              {/* Data Grid Component */}
              <div style={{ height: '500px', width: '100%' }}>
                <DataGrid
                  columns={columns}
                  rows={rows}
                  processRowUpdate={processRowUpdate}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  experimentalFeatures={{ newEditingApi: true }}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
                Cancel
              </button>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                {timetable._id ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default CreateTimeTablePage;
