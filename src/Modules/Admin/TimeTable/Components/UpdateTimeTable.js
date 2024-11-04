// UpdateTimeTable.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Button,
  Popconfirm,
  message,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import {
  updateTimetable,
} from '../../../../Store/Slices/Admin/TimeTable/timetable.action';
import { fetchSubjects } from '../../../../Store/Slices/Admin/Class/Subject/subjectThunks';
import {
  fetchSectionsByClass,
  fetchGroupsByClass,
} from '../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks';
import {
  clearSectionsList,
  clearGroupsList,
} from '../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionSlice';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;

// Days of the week for the dropdown
const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const UpdateTimeTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Accessing timetables from Redux store
  const timetables = useSelector((state) => state.admin.timetable.timetables);

  // Find the timetable to edit
  const timetable = timetables.find((tt) => tt._id === id);

  console.log('Timetable fetched from Redux:', timetable); // Debugging

  // Accessing classes, subjects, sections, and groups from Redux store
  const classes = useSelector((state) => state.admin.class.classes);
  const subjects = useSelector((state) => state.admin.subject.subjects);
  const sectionsList = useSelector(
    (state) => state.admin.group_section.sectionsList
  );
  const groupsList = useSelector(
    (state) => state.admin.group_section.groupsList
  );

  const [formData, setFormData] = useState({
    name: timetable?.name || '',
    classId: timetable?.classId?._id || timetable?.classId || '',
    sectionId: timetable?.sectionId?._id || timetable?.sectionId || '',
    groupId: timetable?.groupId?._id || timetable?.groupId || '',
    startDate: timetable?.validity?.startDate
      ? moment(timetable.validity.startDate).format('YYYY-MM-DD')
      : '',
    endDate: timetable?.validity?.endDate
      ? moment(timetable.validity.endDate).format('YYYY-MM-DD')
      : '',
    type: timetable?.type || 'weekly',
  });

  const [isActive, setIsActive] = useState(false);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [deletedRowsStack, setDeletedRowsStack] = useState([]);

  // ID Counter using useRef
  const idCounterRef = useRef(1);

  // Fetch isActive and academicYear from localStorage or timetable data
  const [academicYear, setAcademicYear] = useState(null);

  useEffect(() => {
    const authData = localStorage.getItem('persist:auth');
    let academicYearData = null;
    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData);
        academicYearData = parsedAuth.AcademicYear
          ? JSON.parse(parsedAuth.AcademicYear)
          : null;
        setIsActive(academicYearData?.isActive || false);
        console.log('Academic Year from localStorage:', academicYearData); // Debugging
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }

    if (academicYearData && academicYearData._id) {
      setAcademicYear(academicYearData._id);
    } else if (timetable && timetable.academicYear && timetable.academicYear._id) {
      setAcademicYear(timetable.academicYear._id);
      console.log('Academic Year from timetable:', timetable.academicYear); // Debugging
    } else {
      console.warn('Academic Year is not available.');
    }
  }, [timetable]);

  // Fetch subjects, sections, and groups when classId changes
  useEffect(() => {
    if (formData.classId) {
      dispatch(clearSectionsList());
      dispatch(clearGroupsList());

      dispatch(fetchSubjects(formData.classId));
      dispatch(fetchSectionsByClass(formData.classId));
      dispatch(fetchGroupsByClass(formData.classId));
    } else {
      dispatch(clearSectionsList());
      dispatch(clearGroupsList());
      setFormData((prev) => ({
        ...prev,
        sectionId: '',
        groupId: '',
      }));
    }
  }, [formData.classId, dispatch]);

  // Pre-fill dataSource if timetable is provided
  useEffect(() => {
    if (timetable && timetable.days && timetable.days.length > 0) {
      const newDataSource = [];
      idCounterRef.current = 1;
      timetable.days.forEach((day, dayIndex) => {
        console.log(`Processing day ${dayIndex + 1}:`, day); // Debugging
        day.slots.forEach((slot, slotIndex) => {
          console.log(`Processing slot ${slotIndex + 1}:`, slot); // Debugging
          const newRow = { key: idCounterRef.current, id: idCounterRef.current };
          if (timetable.type === 'others') {
            newRow.heading = slot.heading || ''; // Extract heading from slot.name
            newRow.subjectId = slot.subjectId?._id || slot.subjectId || '';
            newRow.startTime = slot.startTime || '';
            newRow.endTime = slot.endTime || '';
            newRow.description = slot.description || '';
          } else if (timetable.type === 'weekly') {
            newRow.subjectId = slot.subjectId?._id || slot.subjectId || '';
            newRow.day = day.day || '';
            newRow.startTime = slot.startTime || '';
            newRow.endTime = slot.endTime || '';
            newRow.description = slot.description || '';
          } else if (timetable.type === 'exam') {
            newRow.subjectId = slot.subjectId?._id || slot.subjectId || '';
            newRow.date = day.date
              ? moment(day.date).format('YYYY-MM-DD')
              : '';
            newRow.startTime = slot.startTime || '';
            newRow.endTime = slot.endTime || '';
            newRow.description = slot.description || '';
          } else if (timetable.type === 'event') {
            newRow.eventName = slot.eventName || ''; // Extract event name from slot.name
            newRow.date = day.date
              ? moment(day.date).format('YYYY-MM-DD')
              : '';
            newRow.startTime = slot.startTime || '';
            newRow.endTime = slot.endTime || '';
            newRow.description = slot.description || '';
          }
          newDataSource.push(newRow);
          idCounterRef.current += 1;
        });
      });
      console.log('Pre-filled dataSource:', newDataSource); // Debugging
      setDataSource(newDataSource);
    } else {
      console.warn('Timetable data is incomplete or missing days.'); // Debugging
    }
  }, [timetable]);

  // Handle cell value changes using row key
  const handleCellChange = (value, key, dataIndex) => {
    setDataSource((prevData) => {
      const newData = [...prevData];
      const index = newData.findIndex((item) => item.key === key);
      if (index > -1) {
        newData[index] = { ...newData[index], [dataIndex]: value };
        return newData;
      }
      return prevData;
    });
  };

  // Render functions
  const renderEditableCell = (text, record, dataIndex) => (
    <Input
      value={text}
      onChange={(e) => handleCellChange(e.target.value, record.key, dataIndex)}
      required
    />
  );

  const renderDayDropdown = (text, record, dataIndex) => (
    <Select
      value={text || undefined}
      onChange={(value) => handleCellChange(value, record.key, dataIndex)}
      style={{ width: '100%' }}
      placeholder="Select Day"
    >
      {daysOfWeek.map((day) => (
        <Option key={day} value={day}>
          {day}
        </Option>
      ))}
    </Select>
  );

  const renderTimePicker = (text, record, dataIndex) => (
    <TimePicker
      value={text ? moment(text, 'HH:mm') : null}
      format="HH:mm"
      onChange={(time, timeString) =>
        handleCellChange(timeString, record.key, dataIndex)
      }
    />
  );

  const renderDatePicker = (text, record, dataIndex) => (
    <DatePicker
      value={text ? moment(text, 'YYYY-MM-DD') : null}
      format="YYYY-MM-DD"
      onChange={(date, dateString) =>
        handleCellChange(dateString, record.key, dataIndex)
      }
    />
  );

  const renderSubjectDropdown = (text, record, dataIndex) => {
    const isDisabled = !formData.classId || !(subjects && subjects.length > 0);

    return (
      <Select
        value={text || undefined}
        onChange={(value) => handleCellChange(value, record.key, dataIndex)}
        style={{ width: '100%' }}
        placeholder="Select Subject"
        disabled={isDisabled}
      >
        {subjects && subjects.length > 0 ? (
          subjects.map((subject, index) => {
            const subjectId =
              subject._id || subject.id || subject.subjectId;
            if (!subjectId) {
              console.warn(`Subject at index ${index} is missing an ID.`);
              return null;
            }
            return (
              <Option key={subjectId} value={subjectId}>
                {subject.subjectName}
              </Option>
            );
          })
        ) : (
          <Option value="" disabled>
            No subjects available
          </Option>
        )}
      </Select>
    );
  };

  const renderDescription = (text, record, dataIndex) => (
    <Input
      value={text}
      onChange={(e) => handleCellChange(e.target.value, record.key, dataIndex)}
      placeholder="Enter Description"
      required
    />
  );

  // Generate columns based on type
  const getColumnsByType = () => {
    const commonColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 70,
        fixed: 'left',
      },
    ];

    if (formData.type === 'weekly') {
      return [
        ...commonColumns,
        {
          title: 'Subject',
          dataIndex: 'subjectId',
          width: 200,
          render: (text, record) =>
            renderSubjectDropdown(text, record, 'subjectId'),
        },
        {
          title: 'Day',
          dataIndex: 'day',
          width: 150,
          render: (text, record) => renderDayDropdown(text, record, 'day'),
        },
        {
          title: 'Start Time',
          dataIndex: 'startTime',
          width: 150,
          render: (text, record) =>
            renderTimePicker(text, record, 'startTime'),
        },
        {
          title: 'End Time',
          dataIndex: 'endTime',
          width: 150,
          render: (text, record) =>
            renderTimePicker(text, record, 'endTime'),
        },
        {
          title: 'Description',
          dataIndex: 'description',
          width: 250,
          render: (text, record) =>
            renderDescription(text, record, 'description'),
        },
      ];
    } else if (formData.type === 'exam') {
      return [
        ...commonColumns,
        {
          title: 'Subject',
          dataIndex: 'subjectId',
          width: 200,
          render: (text, record) =>
            renderSubjectDropdown(text, record, 'subjectId'),
        },
        {
          title: 'Start Time',
          dataIndex: 'startTime',
          width: 150,
          render: (text, record) =>
            renderTimePicker(text, record, 'startTime'),
        },
        {
          title: 'End Time',
          dataIndex: 'endTime',
          width: 150,
          render: (text, record) =>
            renderTimePicker(text, record, 'endTime'),
        },
        {
          title: 'Date',
          dataIndex: 'date',
          width: 150,
          render: (text, record) => renderDatePicker(text, record, 'date'),
        },
        {
          title: 'Description',
          dataIndex: 'description',
          width: 250,
          render: (text, record) =>
            renderDescription(text, record, 'description'),
        },
      ];
    } else if (formData.type === 'event') {
      return [
        ...commonColumns,
        {
          title: 'Event Name',
          dataIndex: 'eventName',
          width: 200,
          render: (text, record) =>
            renderEditableCell(text, record, 'eventName'),
        },
        {
          title: 'Start Time',
          dataIndex: 'startTime',
          width: 150,
          render: (text, record) =>
            renderTimePicker(text, record, 'startTime'),
        },
        {
          title: 'End Time',
          dataIndex: 'endTime',
          width: 150,
          render: (text, record) =>
            renderTimePicker(text, record, 'endTime'),
        },
        {
          title: 'Date',
          dataIndex: 'date',
          width: 150,
          render: (text, record) => renderDatePicker(text, record, 'date'),
        },
        {
          title: 'Description',
          dataIndex: 'description',
          width: 250,
          render: (text, record) =>
            renderDescription(text, record, 'description'),
        },
      ];
    } else if (formData.type === 'others') {
      return [
        ...commonColumns,
        {
          title: 'Heading',
          dataIndex: 'heading',
          width: 200,
          render: (text, record) =>
            renderEditableCell(text, record, 'heading'),
        },
        {
          title: 'Subject',
          dataIndex: 'subjectId',
          width: 200,
          render: (text, record) =>
            renderSubjectDropdown(text, record, 'subjectId'),
        },
        {
          title: 'Start Time',
          dataIndex: 'startTime',
          width: 150,
          render: (text, record) =>
            renderTimePicker(text, record, 'startTime'),
        },
        {
          title: 'End Time',
          dataIndex: 'endTime',
          width: 150,
          render: (text, record) =>
            renderTimePicker(text, record, 'endTime'),
        },
        {
          title: 'Description',
          dataIndex: 'description',
          width: 250,
          render: (text, record) =>
            renderDescription(text, record, 'description'),
        },
      ];
    } else {
      return commonColumns;
    }
  };

  // Update columns when formData.type or subjects change
  useEffect(() => {
    const cols = getColumnsByType();
    setColumns(cols);
  }, [formData.type, subjects]);

  // Reset dataSource and ID counter when formData.type changes
  useEffect(() => {
    // Only reset if it's a new timetable
    if (!timetable) {
      setDataSource([]);
      idCounterRef.current = 1;
      handleAddRow();
    }
  }, [formData.type, timetable]);

  // Add a new row
  const handleAddRow = () => {
    setDataSource((prevData) => {
      const newId = idCounterRef.current;
      const newRow = { key: newId, id: newId };

      if (formData.type === 'weekly') {
        newRow.subjectId = '';
        newRow.day = '';
        newRow.startTime = '';
        newRow.endTime = '';
        newRow.description = '';
      } else if (formData.type === 'exam') {
        newRow.subjectId = '';
        newRow.startTime = '';
        newRow.endTime = '';
        newRow.date = '';
        newRow.description = '';
      } else if (formData.type === 'event') {
        newRow.eventName = '';
        newRow.startTime = '';
        newRow.endTime = '';
        newRow.date = '';
        newRow.description = '';
      } else if (formData.type === 'others') {
        newRow.heading = '';
        newRow.subjectId = '';
        newRow.startTime = '';
        newRow.endTime = '';
        newRow.description = '';
      }

      idCounterRef.current += 1;

      return [...prevData, newRow];
    });
  };

  // Delete selected rows
  const handleDeleteRows = () => {
    if (selectedRowKeys.length === 0) return;

    setDataSource((prevData) => {
      const newData = [...prevData];
      const rowsToDelete = [];

      selectedRowKeys.forEach((key) => {
        const index = newData.findIndex((item) => item.key === key);
        if (index > -1) {
          rowsToDelete.push({ ...newData[index], originalIndex: index });
        }
      });

      setDeletedRowsStack((prevStack) => [...prevStack, rowsToDelete]);

      const updatedData = newData.filter(
        (item) => !selectedRowKeys.includes(item.key)
      );
      return updatedData;
    });

    setSelectedRowKeys([]);
  };

  // Undo delete rows
  const handleUndoDelete = () => {
    if (deletedRowsStack.length === 0) return;

    setDataSource((prevData) => {
      let newData = [...prevData];
      const rowsToRestore = deletedRowsStack.slice(-1)[0];

      rowsToRestore.forEach((row) => {
        const { originalIndex } = row;
        newData.splice(originalIndex, 0, row);
      });

      setDeletedRowsStack((prevStack) => prevStack.slice(0, -1));

      return newData;
    });
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

    if (
      (formData.type === 'exam' || formData.type === 'event') &&
      !formData.endDate
    ) {
      errors.push('End date is required for exam or event.');
    }

    if (dataSource.length === 0) {
      errors.push('At least one row must be added to the timetable.');
    }

    dataSource.forEach((row, index) => {
      if (formData.type === 'weekly') {
        if (!row.subjectId || row.subjectId.trim() === '') {
          errors.push(`Subject is required for row ${index + 1}.`);
        }
        if (!row.day || row.day.trim() === '') {
          errors.push(`Day is required for row ${index + 1}.`);
        }
        if (!row.startTime || !row.endTime) {
          errors.push(`Start and end time are required for row ${index + 1}.`);
        }
        if (!row.description || row.description.trim() === '') {
          errors.push(`Description is required for row ${index + 1}.`);
        }
      } else if (formData.type === 'exam') {
        if (!row.subjectId || row.subjectId.trim() === '') {
          errors.push(`Subject is required for row ${index + 1}.`);
        }
        if (!row.startTime || !row.endTime) {
          errors.push(`Start and end time are required for row ${index + 1}.`);
        }
        if (!row.date || row.date.trim() === '') {
          errors.push(`Date is required for row ${index + 1}.`);
        }
        if (!row.description || row.description.trim() === '') {
          errors.push(`Description is required for row ${index + 1}.`);
        }
      } else if (formData.type === 'event') {
        if (!row.eventName || row.eventName.trim() === '') {
          errors.push(`Event name is required for row ${index + 1}.`);
        }
        if (!row.startTime || !row.endTime) {
          errors.push(`Start and end time are required for row ${index + 1}.`);
        }
        if (!row.date || row.date.trim() === '') {
          errors.push(`Date is required for row ${index + 1}.`);
        }
        if (!row.description || row.description.trim() === '') {
          errors.push(`Description is required for row ${index + 1}.`);
        }
      } else if (formData.type === 'others') {
        if (!row.heading || row.heading.trim() === '') {
          errors.push(`Heading is required for row ${index + 1}.`);
        }
        if (!row.subjectId || row.subjectId.trim() === '') {
          errors.push(`Subject is required for row ${index + 1}.`);
        }
        if (!row.startTime || !row.endTime) {
          errors.push(`Start and end time are required for row ${index + 1}.`);
        }
        if (!row.description || row.description.trim() === '') {
          errors.push(`Description is required for row ${index + 1}.`);
        }
      }
    });

    if (errors.length > 0) {
      message.error(errors.join('\n'));
      return;
    }

    const timetableData = {
      name: formData.name,
      classId: formData.classId,
      sectionId: formData.sectionId || null,
      groupId: formData.groupId || null,
      type: formData.type,
      validity: {
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString()
          : undefined,
      },
      status: isActive ? 'active' : 'inactive',
      academicYear: academicYear, // Include academicYear as ObjectId
      days: [], // We will populate this below
    };

    // Organize dataSource into days and slots
    if (formData.type === 'weekly') {
      const dayMap = {};
      dataSource.forEach((row) => {
        if (!dayMap[row.day]) {
          dayMap[row.day] = [];
        }
        dayMap[row.day].push({
          subjectId: row.subjectId,
          startTime: row.startTime,
          endTime: row.endTime,
          description: row.description,
        });
      });
      timetableData.days = Object.keys(dayMap).map((day) => ({
        day,
        slots: dayMap[day],
      }));
    } else if (formData.type === 'exam') {
      const dateMap = {};
      dataSource.forEach((row) => {
        const formattedDate = moment(row.date, 'YYYY-MM-DD').toISOString();
        if (!dateMap[formattedDate]) {
          dateMap[formattedDate] = [];
        }
        const slotData = {
          subjectId: row.subjectId,
          startTime: row.startTime,
          endTime: row.endTime,
          description: row.description,
        };
        dateMap[formattedDate].push(slotData);
      });
      timetableData.days = Object.keys(dateMap).map((date) => ({
        date,
        slots: dateMap[date],
      }));
    } else if (formData.type === 'event') {
      const dateMap = {};
      dataSource.forEach((row) => {
        const formattedDate = moment(row.date, 'YYYY-MM-DD').toISOString();
        if (!dateMap[formattedDate]) {
          dateMap[formattedDate] = [];
        }
        const slotData = {
          eventName: row.eventName, // Use 'name' for event name
          startTime: row.startTime,
          endTime: row.endTime,
          description: row.description,
        };
        dateMap[formattedDate].push(slotData);
      });
      timetableData.days = Object.keys(dateMap).map((date) => ({
        date,
        slots: dateMap[date],
      }));
    } else if (formData.type === 'others') {
      // Since heading is in slots, we can group all slots under a single day
      const day = {
        slots: dataSource.map((row) => ({
          heading: row.heading, // Use 'name' for heading
          subjectId: row.subjectId,
          startTime: row.startTime,
          endTime: row.endTime,
          description: row.description,
        })),
      };
      timetableData.days.push(day);
    }

    console.log('Timetable data to be sent:', timetableData); // Debugging

    // Dispatch the action to update the timetable
    dispatch(updateTimetable({ id: timetable._id, data: timetableData }))
      .unwrap()
      .then(() => {
        message.success('Timetable updated successfully!');
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/noticeboard/timetable');
        }, 1500);
      })
      .catch((error) => {
        message.error(error || 'Failed to update timetable.');
      });
  };

  // Row Selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
  };

  if (!timetable) {
    return (
      <div className="flex flex-col items-center justify-center w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Timetable Not Found</h2>
        <p>The timetable you're trying to edit does not exist.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start w-full p-6">
      <h2 className="text-xl font-semibold mb-4">Edit TimeTable</h2>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {/* Form Inputs */}
        <div className="flex flex-wrap -mx-2">
          {/* Name */}
          <div className="w-full md:w-1/5 px-2 mb-4">
            <label className="block mb-1">Name</label>
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          {/* Start Date */}
          <div className="w-full md:w-1/5 px-2 mb-4">
            <label className="block mb-1">Start Date</label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              required
            />
          </div>
          {/* End Date */}
          <div className="w-full md:w-1/5 px-2 mb-4">
            <label className="block mb-1">End Date</label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              required={formData.type === 'exam' || formData.type === 'event'}
              disabled={
                !(formData.type === 'exam' || formData.type === 'event')
              }
            />
          </div>
          {/* Select Class */}
          <div className="w-full md:w-1/5 px-2 mb-4">
            <label className="block mb-1">Select Class</label>
            <Select
              value={formData.classId || ''}
              onChange={(value) => {
                setFormData({
                  ...formData,
                  classId: value,
                  sectionId: '',
                  groupId: '',
                });
              }}
              style={{ width: '100%' }}
              required
              placeholder="Select Class"
            >
              <Option value="">Select Class</Option>
              {classes.map((classItem) => (
                <Option key={classItem._id} value={classItem._id}>
                  {classItem.className}
                </Option>
              ))}
            </Select>
          </div>
          {/* Select Section */}
          <div className="w-full md:w-1/5 px-2 mb-4">
            <label className="block mb-1">Select Section</label>
            <Select
              value={formData.sectionId || ''}
              onChange={(value) =>
                setFormData({ ...formData, sectionId: value })
              }
              style={{ width: '100%' }}
              placeholder="Select Section"
              disabled={!formData.classId || sectionsList.length === 0}
            >
              <Option value="">Select Section</Option>
              {sectionsList.length > 0 ? (
                sectionsList.map((section) => (
                  <Option key={section._id} value={section._id}>
                    {section.sectionName}
                  </Option>
                ))
              ) : (
                <Option value="" disabled>
                  No sections available
                </Option>
              )}
            </Select>
          </div>
          {/* Select Group */}
          <div className="w-full md:w-1/5 px-2 mb-4">
            <label className="block mb-1">Select Group</label>
            <Select
              value={formData.groupId || ''}
              onChange={(value) =>
                setFormData({ ...formData, groupId: value })
              }
              style={{ width: '100%' }}
              placeholder="Select Group"
              disabled={!formData.classId || groupsList.length === 0}
            >
              <Option value="">Select Group</Option>
              {groupsList.length > 0 ? (
                groupsList.map((group) => (
                  <Option key={group._id} value={group._id}>
                    {group.groupName}
                  </Option>
                ))
              ) : (
                <Option value="" disabled>
                  No groups available
                </Option>
              )}
            </Select>
          </div>
          {/* Table Type */}
          <div className="w-full md:w-1/5 px-2 mb-4">
            <label className="block mb-1">Table Type</label>
            <Select
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value })}
              style={{ width: '100%' }}
              required
            >
              <Option value="weekly">Weekly</Option>
              <Option value="exam">Exam</Option>
              <Option value="event">Event</Option>
              <Option value="others">Others</Option>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="w-full mb-4">
          {/* Action Buttons */}
          <div className="flex justify-between mb-2">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddRow}
              disabled={!formData.classId}
            >
              Add Row
            </Button>
            <div className="flex space-x-2">
              {deletedRowsStack.length > 0 && (
                <Button icon={<UndoOutlined />} onClick={handleUndoDelete}>
                  Undo Delete
                </Button>
              )}
              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  title="Are you sure you want to delete selected rows?"
                  onConfirm={handleDeleteRows}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger icon={<DeleteOutlined />}>
                    Delete Rows
                  </Button>
                </Popconfirm>
              )}
            </div>
          </div>

          {/* Table Component */}
          <Table
            columns={columns}
            dataSource={dataSource}
            rowSelection={rowSelection}
            pagination={false}
            scroll={{ x: 'max-content' }}
            style={{ width: '100%' }}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button onClick={() => navigate('/noticeboard/timetable')}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTimeTable;
