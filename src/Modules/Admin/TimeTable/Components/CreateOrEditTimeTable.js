import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { createTimetable, updateTimetable } from "../../../../Store/Slices/Admin/TimeTable/timetable.action";

const defaultDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const CreateTimeTablePage = ({ timetable = {}, onClose }) => {
  const dispatch = useDispatch();
  const { classes, loading: classLoading } = useSelector((state) => state.admin.class);

  // Initial state with form fields and time slots for each day
  const [formData, setFormData] = useState({
    name: timetable.name || '',
    classId: timetable.classId || '',
    startDate: timetable.startDate || '',
    endDate: timetable.endDate || '',
    days: timetable.days || defaultDays.map((day) => ({ day, timeSlots: [] })),
  });

  // Columns for the DataGrid (editable table)
  const columns = [
    { field: 'timeSlot', headerName: 'Time Slot', width: 150, editable: true },
    { field: 'subjectId', headerName: 'Subject ID', width: 150, editable: true },
    { field: 'teacherId', headerName: 'Teacher ID', width: 150, editable: true },
  ];

  // Handle input change for form fields
  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Handle adding a new time slot
  const handleAddTimeSlot = (dayIndex) => {
    setFormData((prevData) => {
      const newDays = [...prevData.days];
      newDays[dayIndex].timeSlots.push({ id: new Date().getTime(), timeSlot: '', subjectId: '', teacherId: '' });
      return { ...prevData, days: newDays };
    });
  };

  // Handle changes in DataGrid
  const handleEditRowsModelChange = (dayIndex, updatedRows) => {
    setFormData((prevData) => {
      const newDays = [...prevData.days];
      newDays[dayIndex].timeSlots = Object.values(updatedRows); // Update time slots for the day
      return { ...prevData, days: newDays };
    });
  };

  // Submit timetable
  const handleSubmit = (e) => {
    e.preventDefault();
    if (timetable._id) {
      dispatch(updateTimetable({ id: timetable._id, data: formData }));
    } else {
      dispatch(createTimetable(formData));
    }
    onClose(); // Close after submission
  };

  return (
    <div className="flex flex-col items-center justify-start w-full p-6">
      <h2 className="text-xl font-semibold mb-4">{timetable._id ? "Edit" : "Create"} TimeTable</h2>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {/* Form fields */}
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <select
            value={formData.classId}
            onChange={(e) => handleInputChange("classId", e.target.value)}
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

        {/* Render tables for each day */}
        {formData.days.map((day, dayIndex) => (
          <div key={dayIndex} className="w-full mb-4">
            <h3 className="text-lg font-semibold">{day.day}</h3>
            <DataGrid
              rows={day.timeSlots}
              columns={columns}
              onEditRowsModelChange={(updatedRows) => handleEditRowsModelChange(dayIndex, updatedRows)}
              pageSize={5}
              rowsPerPageOptions={[5]}
              autoHeight
            />
            <button
              type="button"
              onClick={() => handleAddTimeSlot(dayIndex)}
              className="text-blue-500 mt-2"
            >
              + Add Time Slot
            </button>
          </div>
        ))}

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{timetable._id ? "Update" : "Create"}</button>
        </div>
      </form>
    </div>
  );
};

export default CreateTimeTablePage;
