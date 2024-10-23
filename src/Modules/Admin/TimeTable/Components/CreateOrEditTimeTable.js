import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { createTimetable, updateTimetable } from "../../../../Store/Slices/Admin/TimeTable/timetable.action";
import DashLayout from "../../../../Components/Admin/AdminDashLayout"; // Sidebar and navbar
import Layout from "../../../../Components/Common/Layout";

const CreateTimeTablePage = ({ timetable = {}, onClose }) => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.admin.class);

  // Initial state for the timetable
  const [formData, setFormData] = useState({
    name: timetable.name || '',
    classId: timetable.classId || '',
    startDate: timetable.startDate || '',
    endDate: timetable.endDate || '',
    rows: timetable.rows || [], // Rows for the grid
    columns: timetable.columns || [
      { field: 'day', headerName: 'Day', width: 150, editable: true },
      { field: 'timeSlot', headerName: 'Time Slot', width: 150, editable: true },
      { field: 'subjectId', headerName: 'Subject ID', width: 150, editable: true },
      { field: 'teacherId', headerName: 'Teacher ID', width: 150, editable: true },
    ],
  });

  // Add a new row dynamically
  const handleAddRow = () => {
    setFormData((prevData) => ({
      ...prevData,
      rows: [
        ...prevData.rows,
        { id: prevData.rows.length + 1, day: '', timeSlot: '', subjectId: '', teacherId: '' },
      ]
    }));
  };

  // Add a new column dynamically
  const handleAddColumn = () => {
    const newColumnId = `customField${formData.columns.length + 1}`;
    setFormData((prevData) => ({
      ...prevData,
      columns: [
        ...prevData.columns,
        { field: newColumnId, headerName: `Column ${formData.columns.length + 1}`, width: 150, editable: true }
      ],
    }));
  };

  // Handle cell edits
  const handleCellEditCommit = (params) => {
    const { id, field, value } = params;
    setFormData((prevData) => {
      const newRows = prevData.rows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      );
      return { ...prevData, rows: newRows };
    });
  };

  // Submit the form (Save timetable)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (timetable._id) {
      dispatch(updateTimetable({ id: timetable._id, data: formData }));
    } else {
      dispatch(createTimetable(formData));
    }
    onClose(); // Close the form after submission
  };

  return (
    <Layout title="Create TimeTable | Student Diwan">
      <DashLayout>
        <div className="flex flex-col items-center justify-start w-full p-6">
          <h2 className="text-xl font-semibold mb-4">{timetable._id ? "Edit" : "Create"} TimeTable</h2>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* Form inputs for timetable name, start date, end date, and class */}
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

            {/* Editable DataGrid for timetable */}
            <div className="w-full mb-4">
              <DataGrid
                rows={formData.rows}
                columns={formData.columns}
                pageSize={10}
                onCellEditCommit={handleCellEditCommit}
                rowsPerPageOptions={[10]}
                autoHeight
                checkboxSelection={false}
              />
              {/* Add row and column buttons */}
              <div className="flex space-x-4 mt-4">
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  + Add Row
                </button>
                <button
                  type="button"
                  onClick={handleAddColumn}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  + Add Column
                </button>
              </div>
            </div>

            {/* Buttons for submission */}
            <div className="flex justify-end space-x-4">
              <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{timetable._id ? "Update" : "Create"}</button>
            </div>
          </form>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default CreateTimeTablePage;
