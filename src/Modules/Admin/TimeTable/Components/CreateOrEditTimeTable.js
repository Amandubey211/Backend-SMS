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
  createTimetable,
  updateTimetable,
} from '../../../../Store/Slices/Admin/TimeTable/timetable.action';
import { fetchSubjects } from '../../../../Store/Slices/Admin/Class/Subject/subjectThunks';
import DashLayout from '../../../../Components/Admin/AdminDashLayout';
import Layout from '../../../../Components/Common/Layout';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

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

const CreateTimeTablePage = ({ timetable = {}, onClose = () => {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate

  // Accessing classes and subjects from Redux store
  const classes = useSelector((state) => state.admin.class.classes);
  const subjects = useSelector((state) => state.admin.subject.subjects);

  const [formData, setFormData] = useState({
    name: timetable.name || '',
    classId: timetable.classId || '',
    startDate: timetable.validity?.startDate
      ? timetable.validity.startDate.split('T')[0]
      : '',
    endDate: timetable.validity?.endDate
      ? timetable.validity.endDate.split('T')[0]
      : '',
    type: timetable.type || 'weekly',
  });

  const [isActive, setIsActive] = useState(false); // Initialize isActive state
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [deletedRowsStack, setDeletedRowsStack] = useState([]);

  // ID Counter using useRef
  const idCounterRef = useRef(1);

  // Fetch isActive from localStorage on component mount
  useEffect(() => {
    const authData = localStorage.getItem('persist:auth');
    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData);
        const academicYear = parsedAuth.AcademicYear
          ? JSON.parse(parsedAuth.AcademicYear)
          : [];
        setIsActive(academicYear[0]?.isActive || false); // Safely access isActive
        console.log('Fetched isActive:', academicYear[0]?.isActive || false);
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }
  }, []);

  // Debugging: Log subjects to verify data
  useEffect(() => {
    console.log('Fetched Subjects:', subjects);
  }, [subjects]);

  // Debugging: Log selected class
  useEffect(() => {
    console.log('Selected Class ID:', formData.classId);
  }, [formData.classId]);

  // Handle cell value changes
  const handleCellChange = (value, record, dataIndex) => {
    setDataSource((prevData) => {
      const newData = [...prevData];
      const index = newData.findIndex((item) => record.key === item.key);
      if (index > -1) {
        newData[index] = { ...newData[index], [dataIndex]: value };
        return newData;
      }
      return newData;
    });
  };

  // Render functions
  const renderEditableCell = (text, record, dataIndex) => (
    <Input
      value={text}
      onChange={(e) => handleCellChange(e.target.value, record, dataIndex)}
    />
  );

  const renderDayDropdown = (text, record, dataIndex) => (
    <Select
      value={text || undefined}
      onChange={(value) => handleCellChange(value, record, dataIndex)}
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
      onChange={(time, timeString) => handleCellChange(timeString, record, dataIndex)}
    />
  );

  const renderDatePicker = (text, record, dataIndex) => (
    <DatePicker
      value={text ? moment(text, 'YYYY-MM-DD') : null}
      format="YYYY-MM-DD"
      onChange={(date, dateString) => handleCellChange(dateString, record, dataIndex)}
    />
  );

  const renderSubjectDropdown = (text, record, dataIndex) => {
    const isDisabled = !formData.classId || !(subjects && subjects.length > 0);
    return (
      <Select
        value={text || undefined}
        onChange={(value) => handleCellChange(value, record, dataIndex)}
        style={{ width: '100%' }}
        placeholder="Select Subject"
        disabled={isDisabled}
      >
        {subjects && subjects.length > 0 ? (
          subjects.map((subject) => (
            <Option key={subject.subjectId} value={subject.subjectId}>
              {subject.subjectName}
            </Option>
          ))
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
      onChange={(e) => handleCellChange(e.target.value, record, dataIndex)}
      placeholder="Enter Description"
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
      // The rest of the columns will be appended based on type
    ];

    if (formData.type === 'weekly') {
      return [
        ...commonColumns,
        {
          title: 'Subject',
          dataIndex: 'subjectId',
          width: 200,
          render: (text, record) => renderSubjectDropdown(text, record, 'subjectId'),
        },
        {
          title: 'Day',
          dataIndex: 'day',
          width: 150,
          render: (text, record) => renderDayDropdown(text, record, 'day'), // Updated
        },
        {
          title: 'Start Time',
          dataIndex: 'startTime',
          width: 150,
          render: (text, record) => renderTimePicker(text, record, 'startTime'),
        },
        {
          title: 'End Time',
          dataIndex: 'endTime',
          width: 150,
          render: (text, record) => renderTimePicker(text, record, 'endTime'),
        },
      ];
    } else if (formData.type === 'exam') {
      return [
        ...commonColumns,
        {
          title: 'Subject',
          dataIndex: 'subjectId',
          width: 200,
          render: (text, record) => renderSubjectDropdown(text, record, 'subjectId'),
        },
        {
          title: 'Start Time',
          dataIndex: 'startTime',
          width: 150,
          render: (text, record) => renderTimePicker(text, record, 'startTime'),
        },
        {
          title: 'End Time',
          dataIndex: 'endTime',
          width: 150,
          render: (text, record) => renderTimePicker(text, record, 'endTime'),
        },
        {
          title: 'Date',
          dataIndex: 'date',
          width: 150,
          render: (text, record) => renderDatePicker(text, record, 'date'),
        },
      ];
    } else if (formData.type === 'event') {
      return [
        ...commonColumns,
        {
          title: 'Event Name',
          dataIndex: 'eventName',
          width: 200,
          render: (text, record) => renderEditableCell(text, record, 'eventName'),
        },
        {
          title: 'Start Time',
          dataIndex: 'startTime',
          width: 150,
          render: (text, record) => renderTimePicker(text, record, 'startTime'),
        },
        {
          title: 'End Time',
          dataIndex: 'endTime',
          width: 150,
          render: (text, record) => renderTimePicker(text, record, 'endTime'),
        },
        {
          title: 'Date',
          dataIndex: 'date',
          width: 150,
          render: (text, record) => renderDatePicker(text, record, 'date'),
        },
      ];
    } else if (formData.type === 'others') {
      return [
        ...commonColumns,
        {
          title: 'Other Title',
          dataIndex: 'otherTitle',
          width: 200,
          render: (text, record) => renderEditableCell(text, record, 'otherTitle'),
        },
        {
          title: 'Subject',
          dataIndex: 'subjectId',
          width: 200,
          render: (text, record) => renderSubjectDropdown(text, record, 'subjectId'),
        },
        {
          title: 'Start Time',
          dataIndex: 'startTime',
          width: 150,
          render: (text, record) => renderTimePicker(text, record, 'startTime'),
        },
        {
          title: 'End Time',
          dataIndex: 'endTime',
          width: 150,
          render: (text, record) => renderTimePicker(text, record, 'endTime'),
        },
        {
          title: 'Description',
          dataIndex: 'description',
          width: 250,
          render: (text, record) => renderDescription(text, record, 'description'),
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
    setDataSource([]);
    idCounterRef.current = 1; // Reset the ID counter
    handleAddRow(); // Add the first row with ID = 1
  }, [formData.type]);

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
      } else if (formData.type === 'exam') {
        newRow.subjectId = '';
        newRow.startTime = '';
        newRow.endTime = '';
        newRow.date = '';
      } else if (formData.type === 'event') {
        newRow.eventName = '';
        newRow.startTime = '';
        newRow.endTime = '';
        newRow.date = '';
      } else if (formData.type === 'others') {
        newRow.otherTitle = '';
        newRow.subjectId = '';
        newRow.startTime = '';
        newRow.endTime = '';
        newRow.description = '';
      }

      // Increment the ID counter
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
      const indicesToDelete = [];

      selectedRowKeys.forEach((key) => {
        const index = newData.findIndex((item) => item.key === key);
        if (index > -1) {
          rowsToDelete.push({ ...newData[index], originalIndex: index });
          indicesToDelete.push(index);
        }
      });

      // Store deleted rows with their original indices
      setDeletedRowsStack((prevStack) => [...prevStack, rowsToDelete]);

      // Remove the rows from dataSource
      return newData.filter((item) => !selectedRowKeys.includes(item.key));
    });

    setSelectedRowKeys([]);
  };

  // Undo delete rows
  const handleUndoDelete = () => {
    if (deletedRowsStack.length === 0) return;

    setDataSource((prevData) => {
      let newData = [...prevData];
      const rowsToRestore = deletedRowsStack.slice(-1)[0]; // Get the last deleted rows

      rowsToRestore.forEach((row) => {
        const { originalIndex } = row;
        newData.splice(originalIndex, 0, row); // Insert at original index
      });

      // Remove the last set of deleted rows from the stack
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

    if ((formData.type === 'exam' || formData.type === 'event') && !formData.endDate) {
      errors.push('End date is required for exam or event.');
    }

    if (formData.type === 'others' && !formData.description) {
      errors.push('Description is required for others type.');
    }

    if (dataSource.length === 0) {
      errors.push('At least one row must be added to the timetable.');
    }

    dataSource.forEach((row, index) => {
      if (formData.type === 'weekly') {
        if (!row.subjectId) {
          errors.push(`Subject is required for row ${index + 1}.`);
        }
        if (!row.day) {
          errors.push(`Day is required for row ${index + 1}.`);
        }
        if (!row.startTime || !row.endTime) {
          errors.push(`Start and end time are required for row ${index + 1}.`);
        }
      } else if (formData.type === 'exam') {
        if (!row.subjectId) {
          errors.push(`Subject is required for row ${index + 1}.`);
        }
        if (!row.startTime || !row.endTime) {
          errors.push(`Start and end time are required for row ${index + 1}.`);
        }
        if (!row.date) {
          errors.push(`Date is required for row ${index + 1}.`);
        }
      } else if (formData.type === 'event') {
        if (!row.eventName) {
          errors.push(`Event name is required for row ${index + 1}.`);
        }
        if (!row.startTime || !row.endTime) {
          errors.push(`Start and end time are required for row ${index + 1}.`);
        }
        if (!row.date) {
          errors.push(`Date is required for row ${index + 1}.`);
        }
      } else if (formData.type === 'others') {
        if (!row.otherTitle) {
          errors.push(`Other Title is required for row ${index + 1}.`);
        }
        if (!row.subjectId) {
          errors.push(`Subject is required for row ${index + 1}.`);
        }
        if (!row.startTime || !row.endTime) {
          errors.push(`Start and end time are required for row ${index + 1}.`);
        }
        if (!row.description) {
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
      type: formData.type,
      validity: {
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      },
      status: isActive ? 'active' : 'inactive', // Use isActive from state
      days: [],
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
        });
      });
      timetableData.days = Object.keys(dayMap).map((day) => ({
        day,
        slots: dayMap[day],
      }));
    } else if (formData.type === 'exam' || formData.type === 'event') {
      const dateMap = {};
      dataSource.forEach((row) => {
        const formattedDate = moment(row.date, 'YYYY-MM-DD').toISOString();
        if (!dateMap[formattedDate]) {
          dateMap[formattedDate] = [];
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
        dateMap[formattedDate].push(slotData);
      });
      timetableData.days = Object.keys(dateMap).map((date) => ({
        date,
        slots: dateMap[date],
      }));
    } else if (formData.type === 'others') {
      const titleMap = {};
      dataSource.forEach((row) => {
        const formattedTitle = row.otherTitle;
        if (!titleMap[formattedTitle]) {
          titleMap[formattedTitle] = [];
        }
        titleMap[formattedTitle].push({
          subjectId: row.subjectId,
          startTime: row.startTime,
          endTime: row.endTime,
          description: row.description,
        });
      });
      timetableData.days = Object.keys(titleMap).map((title) => ({
        otherTitle: title,
        slots: titleMap[title],
      }));
    }

    // Dispatch the action to create or update the timetable
    if (timetable._id) {
      dispatch(updateTimetable({ id: timetable._id, data: timetableData }));
      message.success('Timetable updated successfully!');

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/noticeboard/timetable');
      }, 1500);
    } else {
      dispatch(createTimetable(timetableData));
      message.success('Timetable created successfully!');

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/noticeboard/timetable');
      }, 1500);
    }

    // Close the form or perform any cleanup
    onClose();
  };

  // Fetch subjects when classId changes
  useEffect(() => {
    if (formData.classId) {
      dispatch(fetchSubjects(formData.classId));
    }
  }, [formData.classId, dispatch]);

  // Row Selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
  };

  return (
    <Layout title="Create TimeTable | Student Diwan">
      <DashLayout>
        <div className="flex flex-col items-center justify-start w-full p-6">
          <h2 className="text-xl font-semibold mb-4">
            {timetable._id ? 'Edit' : 'Create'} TimeTable
          </h2>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* Form Inputs */}
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/5 px-2 mb-4">
                <label className="block mb-1">Name</label>
                <Input
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="w-full md:w-1/5 px-2 mb-4">
                <label className="block mb-1">Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="w-full md:w-1/5 px-2 mb-4">
                <label className="block mb-1">End Date</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required={formData.type === 'exam' || formData.type === 'event'}
                  disabled={!(formData.type === 'exam' || formData.type === 'event')}
                />
              </div>
              <div className="w-full md:w-1/5 px-2 mb-4">
                <label className="block mb-1">Select Class</label>
                <Select
                  value={formData.classId || ''}
                  onChange={(value) => {
                    setFormData({ ...formData, classId: value });
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
                  disabled={!formData.classId} // Disable until class is selected
                >
                  Add Row
                </Button>
                <div className="flex space-x-2">
                  {deletedRowsStack.length > 0 && (
                    <Button
                      icon={<UndoOutlined />}
                      onClick={handleUndoDelete}
                    >
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
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                      >
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
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {timetable._id ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default CreateTimeTablePage;
