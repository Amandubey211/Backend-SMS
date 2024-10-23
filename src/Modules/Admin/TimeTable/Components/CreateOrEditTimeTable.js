import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { createTimetable, updateTimetable } from '../../../../Store/Slices/Admin/TimeTable/timetable.action';
import DashLayout from '../../../../Components/Admin/AdminDashLayout';
import Layout from '../../../../Components/Common/Layout';
import PlayForWorkOutlinedIcon from '@mui/icons-material/PlayForWorkOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import UndoIcon from '@mui/icons-material/Undo';

const CreateTimeTablePage = ({ timetable = {}, onClose }) => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.admin.class);

  const [formData, setFormData] = useState({
    name: timetable.name || '',
    classId: timetable.classId || '',
    startDate: timetable.validity?.startDate ? timetable.validity.startDate.split('T')[0] : '',
    endDate: timetable.validity?.endDate ? timetable.validity.endDate.split('T')[0] : '',
    type: timetable.type || 'weekly',
  });

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [deletedRowsStack, setDeletedRowsStack] = useState([]);

  // Generate columns based on type
  const getColumnsByType = (type) => {
    const commonColumns = [
      { field: 'id', headerName: 'ID', width: 70, editable: false },
      { field: 'startTime', headerName: 'Start Time', editable: true, flex: 1 },
      { field: 'endTime', headerName: 'End Time', editable: true, flex: 1 },
    ];

    if (type === 'weekly') {
      return [
        ...commonColumns,
        { field: 'day', headerName: 'Day', editable: true, flex: 1 },
        { field: 'subjectId', headerName: 'Subject ID', editable: true, flex: 1 },
      ];
    } else if (type === 'exam') {
      return [
        ...commonColumns,
        { field: 'date', headerName: 'Date', editable: true, flex: 1 },
        { field: 'subjectId', headerName: 'Subject ID', editable: true, flex: 1 },
      ];
    } else if (type === 'event') {
      return [
        ...commonColumns,
        { field: 'date', headerName: 'Date', editable: true, flex: 1 },
        { field: 'eventName', headerName: 'Event Name', editable: true, flex: 1 },
      ];
    } else {
      return commonColumns;
    }
  };

  // Update columns when formData.type changes
  useEffect(() => {
    const cols = getColumnsByType(formData.type);
    setColumns(cols);
    // Reset rows when type changes
    setRows([]);
  }, [formData.type]);

  // Handle cell edit commit
  const handleCellEditCommit = (params) => {
    const { id, field, value } = params;
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // Add a new row
  const handleAddRow = () => {
    const newRow = { id: Date.now() }; // Use timestamp as unique ID

    if (formData.type === 'weekly') {
      newRow.day = '';
      newRow.startTime = '';
      newRow.endTime = '';
      newRow.subjectId = '';
    } else if (formData.type === 'exam') {
      newRow.date = '';
      newRow.startTime = '';
      newRow.endTime = '';
      newRow.subjectId = '';
    } else if (formData.type === 'event') {
      newRow.date = '';
      newRow.startTime = '';
      newRow.endTime = '';
      newRow.eventName = '';
    }

    setRows((prevRows) => [...prevRows, newRow]);
  };

  // Delete selected rows
  const handleDeleteRows = () => {
    if (selectionModel.length === 0) return;

    const rowsToDelete = rows.filter((row) => selectionModel.includes(row.id));
    setDeletedRowsStack((prevStack) => [...prevStack, rowsToDelete]);

    setRows((prevRows) => prevRows.filter((row) => !selectionModel.includes(row.id)));
    setSelectionModel([]);
  };

  // Undo delete rows
  const handleUndoDelete = () => {
    if (deletedRowsStack.length === 0) return;

    const lastDeletedRows = deletedRowsStack[deletedRowsStack.length - 1];
    setRows((prevRows) => [...prevRows, ...lastDeletedRows]);
    setDeletedRowsStack((prevStack) => prevStack.slice(0, -1));
  };

  // Handle Ctrl+Z for undo
  const handleKeyDown = useCallback(
    (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndoDelete();
      }
    },
    [handleUndoDelete]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Submit the form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields before submitting
    const errors = [];

    if (!formData.name) {
      errors.push('Name is required.');
    }

    if (!formData.classId) {
      errors.push('Class is required.');
    }

    if (!formData.startDate) {
      errors.push('Start date is required.');
    }

    if ((formData.type === 'exam' || formData.type === 'event') && !formData.endDate) {
      errors.push('End date is required for exam or event.');
    }

    if (rows.length === 0) {
      errors.push('At least one row must be added to the timetable.');
    }

    rows.forEach((row, index) => {
      if (formData.type === 'weekly' && !row.day) {
        errors.push(`Day is required for row ${index + 1}.`);
      }
      if ((formData.type === 'exam' || formData.type === 'event') && !row.date) {
        errors.push(`Date is required for row ${index + 1}.`);
      }
      if (!row.startTime || !row.endTime) {
        errors.push(`Start and end time are required for row ${index + 1}.`);
      }
      if (formData.type !== 'event' && !row.subjectId) {
        errors.push(`Subject ID is required for row ${index + 1}.`);
      }
      if (formData.type === 'event' && !row.eventName) {
        errors.push(`Event name is required for row ${index + 1}.`);
      }
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    const timetableData = {
      name: formData.name,
      classId: formData.classId,
      type: formData.type,
      validity: {
        startDate: formData.startDate,
        endDate: formData.endDate,
      },
      status: 'inactive',
      days: [],
    };

    // Organize rows into days and slots
    if (formData.type === 'weekly') {
      const dayMap = {};
      rows.forEach((row) => {
        if (!dayMap[row.day]) {
          dayMap[row.day] = [];
        }
        dayMap[row.day].push({
          startTime: row.startTime,
          endTime: row.endTime,
          subjectId: row.subjectId,
        });
      });
      timetableData.days = Object.keys(dayMap).map((day) => ({
        day,
        slots: dayMap[day],
      }));
    } else if (formData.type === 'exam' || formData.type === 'event') {
      const dateMap = {};
      rows.forEach((row) => {
        if (!dateMap[row.date]) {
          dateMap[row.date] = [];
        }
        const slotData = {
          startTime: row.startTime,
          endTime: row.endTime,
        };
        if (formData.type === 'exam') {
          slotData.subjectId = row.subjectId;
        } else if (formData.type === 'event') {
          slotData.eventName = row.eventName;
        }
        dateMap[row.date].push(slotData);
      });
      timetableData.days = Object.keys(dateMap).map((date) => ({
        date,
        slots: dateMap[date],
      }));
    }

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
            <div className="flex flex-wrap space-x-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border p-2 rounded w-full md:w-1/5"
                required
              />
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="border p-2 rounded w-full md:w-1/5"
                required
              />
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="border p-2 rounded w-full md:w-1/5"
                required={formData.type === 'exam' || formData.type === 'event'}
                disabled={formData.type === 'weekly' || formData.type === 'others'}
              />
              <select
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                className="border p-2 rounded w-full md:w-1/5"
                required
              >
                <option value="">Select Class</option>
                {classes.map((classItem) => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.className}
                  </option>
                ))}
              </select>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="border p-2 rounded w-full md:w-1/5"
                required
              >
                <option value="weekly">Weekly</option>
                <option value="exam">Exam</option>
                <option value="event">Event</option>
                <option value="others">Others</option>
              </select>
            </div>

            {/* Data Grid */}
            <div className="w-full mb-4 grid-container">
              {/* Action Buttons */}
              <div className="flex justify-between mb-2">
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                >
                  <PlayForWorkOutlinedIcon style={{ color: 'white', marginRight: '4px' }} />
                  Add Row
                </button>
                <div className="flex space-x-2">
                  {deletedRowsStack.length > 0 && (
                    <button
                      type="button"
                      onClick={handleUndoDelete}
                      className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                    >
                      <UndoIcon style={{ color: 'white', marginRight: '4px' }} />
                      Undo Delete
                    </button>
                  )}
                  {selectionModel.length > 0 && (
                    <button
                      type="button"
                      onClick={handleDeleteRows}
                      className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
                    >
                      <DeleteOutlineIcon style={{ color: 'white', marginRight: '4px' }} />
                      Delete Rows
                    </button>
                  )}
                </div>
              </div>

              {/* Data Grid Component */}
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <DataGrid
                  columns={columns}
                  rows={rows}
                  editMode="cell"
                  onCellEditCommit={handleCellEditCommit}
                  autoHeight
                  checkboxSelection
                  onSelectionModelChange={(newSelection) => {
                    setSelectionModel(newSelection);
                  }}
                  selectionModel={selectionModel}
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
