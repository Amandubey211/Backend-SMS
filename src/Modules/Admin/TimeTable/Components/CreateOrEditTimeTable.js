import React, { useState, useEffect, useCallback } from 'react';
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

const { Option } = Select;

const CreateTimeTablePage = ({ timetable = {}, onClose = () => {} }) => {
  const dispatch = useDispatch();
  
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

  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [deletedRowsStack, setDeletedRowsStack] = useState([]);
  
  // ID Counter to manage row IDs
  const [idCounter, setIdCounter] = useState(1);

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

  // Generate columns based on type
  const getColumnsByType = () => {
    const commonColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 70,
        fixed: 'left',
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

    if (formData.type === 'weekly') {
      return [
        ...commonColumns,
        {
          title: 'Day',
          dataIndex: 'day',
          width: 150,
          render: (text, record) => renderEditableCell(text, record, 'day'),
        },
        {
          title: 'Subject',
          dataIndex: 'subjectId',
          width: 200,
          render: (text, record) => renderSubjectDropdown(text, record, 'subjectId'),
        },
      ];
    } else if (formData.type === 'exam') {
      return [
        ...commonColumns,
        {
          title: 'Date',
          dataIndex: 'date',
          width: 150,
          render: (text, record) => renderDatePicker(text, record, 'date'),
        },
        {
          title: 'Subject',
          dataIndex: 'subjectId',
          width: 200,
          render: (text, record) => renderSubjectDropdown(text, record, 'subjectId'),
        },
      ];
    } else if (formData.type === 'event') {
      return [
        ...commonColumns,
        {
          title: 'Date',
          dataIndex: 'date',
          width: 150,
          render: (text, record) => renderDatePicker(text, record, 'date'),
        },
        {
          title: 'Event Name',
          dataIndex: 'eventName',
          width: 200,
          render: (text, record) => renderEditableCell(text, record, 'eventName'),
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
    setIdCounter(1);
    handleAddRow();
  }, [formData.type]);

  // Add a new row
  const handleAddRow = () => {
    setDataSource((prevData) => {
      const newId = idCounter;
      const newRow = { key: newId, id: newId };

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

      // Increment the ID counter
      setIdCounter((prevId) => prevId + 1);

      return [...prevData, newRow];
    });
  };

  // Delete selected rows
  const handleDeleteRows = () => {
    if (selectedRowKeys.length === 0) return;

    const rowsToDelete = dataSource.filter((row) => selectedRowKeys.includes(row.key));
    setDeletedRowsStack((prevStack) => [...prevStack, rowsToDelete]);

    setDataSource((prevData) => prevData.filter((row) => !selectedRowKeys.includes(row.key)));
    setSelectedRowKeys([]);
  };

  // Undo delete rows
  const handleUndoDelete = () => {
    if (deletedRowsStack.length === 0) return;

    const lastDeletedRows = deletedRowsStack[deletedRowsStack.length - 1];
    setDataSource((prevData) => [...prevData, ...lastDeletedRows]);
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

    if (dataSource.length === 0) {
      errors.push('At least one row must be added to the timetable.');
    }

    dataSource.forEach((row, index) => {
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
        errors.push(`Subject is required for row ${index + 1}.`);
      }
      if (formData.type === 'event' && !row.eventName) {
        errors.push(`Event name is required for row ${index + 1}.`);
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
      status: 'inactive',
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
    }

    // Dispatch the action to create or update the timetable
    if (timetable._id) {
      dispatch(updateTimetable({ id: timetable._id, data: timetableData }));
      message.success('Timetable updated successfully!');
    } else {
      dispatch(createTimetable(timetableData));
      message.success('Timetable created successfully!');
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
