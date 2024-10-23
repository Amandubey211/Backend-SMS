import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css'; // Import the styles for the grid
import { createTimetable, updateTimetable } from "../../../../Store/Slices/Admin/TimeTable/timetable.action";
import DashLayout from "../../../../Components/Admin/AdminDashLayout"; // Sidebar and navbar
import Layout from "../../../../Components/Common/Layout";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import PlayForWorkOutlinedIcon from '@mui/icons-material/PlayForWorkOutlined';

const CreateTimeTablePage = ({ timetable = {}, onClose }) => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.admin.class);

  // Initialize formData with appropriate defaults
  const [formData, setFormData] = useState({
    name: timetable.name || '',
    classId: timetable.classId || '',
    startDate: timetable.startDate || '',
    endDate: timetable.endDate || '',
    rows: timetable.rows || [],
    columns: timetable.columns || [
      { key: 'id', name: 'ID', width: 50, resizable: true, frozen: true },
      { key: 'day', name: 'Day', editable: true, resizable: true },
      { key: 'timeSlot', name: 'Time Slot', editable: true, resizable: true },
      { key: 'subjectId', name: 'Subject ID', editable: true, resizable: true },
      { key: 'teacherId', name: 'Teacher ID', editable: true, resizable: true },
    ],
  });

  // Add a new row
  const handleAddRow = () => {
    const newRow = {
      id: formData.rows.length + 1,
      day: '',
      timeSlot: '',
      subjectId: '',
      teacherId: ''
    };
    setFormData(prevData => ({
      ...prevData,
      rows: [...prevData.rows, newRow],
    }));
  };

  // Add a new column
  const handleAddColumn = () => {
    const newColumnKey = `customField${formData.columns.length + 1}`;
    const newColumn = {
      key: newColumnKey,
      name: `Column ${formData.columns.length + 1}`,
      editable: true,
      resizable: true
    };
    setFormData(prevData => ({
      ...prevData,
      columns: [...prevData.columns, newColumn],
      rows: prevData.rows.map(row => ({ ...row, [newColumnKey]: '' })),
    }));
  };

  // Handle cell edits
  const handleRowsChange = (updatedRows) => {
    setFormData(prevData => ({
      ...prevData,
      rows: updatedRows,
    }));
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
      days: formData.rows.map(row => ({
        day: row.day,
        slots: [{
          startTime: row.timeSlot.split('-')[0],
          endTime: row.timeSlot.split('-')[1],
          subjectId: row.subjectId,
          teacherId: row.teacherId
        }]
      }))
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
          <h2 className="text-xl font-semibold mb-4">{timetable._id ? "Edit" : "Create"} TimeTable</h2>

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
                <button
                  type="button"
                  onClick={handleAddColumn}
                  className="bg-blue-500 text-white px-2 py-2 rounded-md flex items-center"
                >
                  <AddBoxOutlinedIcon style={{ color: "white", marginRight: "4px" }} />
                  Add Column
                </button>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                >
                  <PlayForWorkOutlinedIcon style={{ color: "white", marginRight: "4px" }} />
                  Add Row
                </button>
              </div>

              {/* Data Grid Component */}
              <div style={{ height: '500px' }}>
                <DataGrid
                  columns={formData.columns}
                  rows={formData.rows}
                  onRowsChange={handleRowsChange}
                  defaultColumnOptions={{
                    resizable: true,
                    sortable: true,
                  }}
                  rowKeyGetter={(row) => row.id}
                  className="rdg-light"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
                Cancel
              </button>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                {timetable._id ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default CreateTimeTablePage;
