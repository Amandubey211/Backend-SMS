import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid'; 
import { TextField } from '@mui/material';
import { createTimetable, updateTimetable } from '../../../../Store/Slices/Admin/TimeTable/timetable.action';
import DashLayout from '../../../../Components/Admin/AdminDashLayout'; // Sidebar and navbar
import Layout from '../../../../Components/Common/Layout';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import PlayForWorkOutlinedIcon from '@mui/icons-material/PlayForWorkOutlined';

const CreateTimeTablePage = ({ timetable = {}, onClose }) => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.admin.class);

  const [columns, setColumns] = useState([
    { field: 'id', headerName: 'ID', width: 50, editable: false }, // ID column is not editable
    { field: 'day', headerName: 'Day', editable: true },
    { field: 'timeSlot', headerName: 'Time Slot', editable: true },
    { field: 'subjectId', headerName: 'Subject ID', editable: true },
    { field: 'teacherId', headerName: 'Teacher ID', editable: true },
  ]);

  const [rows, setRows] = useState([]);

  // State to track which column header is being edited
  const [editingHeaderField, setEditingHeaderField] = useState(null);
  const [headerInputValue, setHeaderInputValue] = useState('');

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
    const newColumnKey = `column${columns.length + 1}`;
    const newColumn = {
      field: newColumnKey,
      headerName: `Column ${columns.length + 1}`,
      editable: true,
      renderHeader: (params) => renderEditableHeader(params),
    };
    setColumns([...columns, newColumn]);
    setRows(rows.map((row) => ({ ...row, [newColumnKey]: '' }))); // Ensure all existing rows have the new column key
  };

  // Handle cell edit commit
  const handleCellEditCommit = (params) => {
    const { id, field, value } = params;
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // Handle header edit start
  const handleHeaderDoubleClick = (field, headerName) => {
    setEditingHeaderField(field);
    setHeaderInputValue(headerName);
  };

  // Handle header name change
  const handleHeaderInputChange = (e) => {
    setHeaderInputValue(e.target.value);
  };

  // Handle header edit end
  const handleHeaderInputBlur = () => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.field === editingHeaderField ? { ...col, headerName: headerInputValue } : col
      )
    );
    setEditingHeaderField(null);
    setHeaderInputValue('');
  };

  // Render editable header
  const renderEditableHeader = (params) => {
    const { field, colDef } = params;
    if (field === editingHeaderField) {
      return (
        <TextField
          value={headerInputValue}
          onChange={handleHeaderInputChange}
          onBlur={handleHeaderInputBlur}
          autoFocus
          size="small"
          variant="standard"
        />
      );
    }
    return (
      <span onDoubleClick={() => handleHeaderDoubleClick(field, colDef.headerName)}>
        {colDef.headerName}
      </span>
    );
  };

  // Update columns to include renderHeader
  const columnsWithRenderHeader = columns.map((col) => ({
    ...col,
    renderHeader: (params) => renderEditableHeader(params),
  }));

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
            <div className="w-full mb-4 grid-container">
              {/* Action Buttons */}
              <div className="flex justify-between mb-2">
                <button
                  type="button"
                  onClick={handleAddColumn}
                  className="bg-blue-500 text-white px-2 py-2 rounded-md flex items-center"
                >
                  <AddBoxOutlinedIcon style={{ color: 'white', marginRight: '4px' }} />
                  Add Column
                </button>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                >
                  <PlayForWorkOutlinedIcon style={{ color: 'white', marginRight: '4px' }} />
                  Add Row
                </button>
              </div>

              {/* Data Grid Component */}
              <div style={{ height: '500px' }}>
                <DataGrid
                  columns={columnsWithRenderHeader}
                  rows={rows}
                  editMode="cell"
                  onCellEditCommit={handleCellEditCommit}
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

// Fix for ResizeObserver loop error
if (process.env.NODE_ENV === 'development') {
  const resizeObserverLoopErrSilenced = () => {
    let resizeObserverErr = false;
    const observerErrHandler = () => {
      resizeObserverErr = true;
    };
    window.addEventListener('error', observerErrHandler);
    const originalError = console.error;
    console.error = (...args) => {
      if (args[0] && args[0].startsWith('ResizeObserver loop limit exceeded')) {
        if (!resizeObserverErr) {
          return;
        }
        resizeObserverErr = false;
        return;
      }
      originalError.call(console, ...args);
    };
  };

  resizeObserverLoopErrSilenced();
}
