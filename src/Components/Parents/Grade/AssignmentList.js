import React, { useEffect, useState } from 'react';
import { Table, Tag, Collapse, Typography, message } from 'antd';
import axios from 'axios';

const { Panel } = Collapse;
const { Text } = Typography;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => (
      <a className="text-blue-600 hover:text-blue-800">
        {text}
        <br />
        <small className="text-gray-500">Group Assignment</small>
      </a>
    ),
  },
  {
    title: 'Module',
    dataIndex: 'module',
    key: 'module',
    render: text => (
      <span>
        {text}
        <br />
        <small className="text-green-600">Chapter 2</small>
      </span>
    ),
  },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
    key: 'dueDate',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: status => {
      let color = status === 'Submit' ? 'green' : status === 'Missing' ? 'red' : 'orange';
      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
  },
];

const AssignmentList = () => {
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const childrenData = JSON.parse(localStorage.getItem('childrenData'));
        const studentId = childrenData[0].id;
        const token = localStorage.getItem('parent:token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await axios.get(`http://localhost:8080/api/studentDashboard/subjects/${studentId}`, {
          headers: { Authentication: token }
        });

        setSubjects(response.data.subjects);
        setLoading(false);
      } catch (err) {
        setError('Failed to load subjects');
        setLoading(false);
        console.error('Error fetching subjects:', err);
      }
    };

    fetchSubjects();
  }, []);

  const handlePanelClick = async (subjectId) => {
    setLoading(true);
    try {
      const childrenData = JSON.parse(localStorage.getItem('childrenData'));
      const studentId = childrenData[0].id;
      const classId = childrenData[0].classId;
      const token = localStorage.getItem('parent:token');
      const url = `http://localhost:8080/parent/api/grades?studentId=${studentId}&classId=${classId}&subjectId=${subjectId}`;

      const response = await axios.get(url, {
        headers: { Authentication: token }
      });

      setAssignments(response.data.assignments);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch assignments');
      setLoading(false);
      message.error('Failed to fetch assignments');
      console.error('Error fetching assignments:', err);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-white mb-8 p-4 border-b-2 border-white">Assignments</h1>
      {error && <p className="text-red-500">{error}</p>}
      <Collapse
        accordion
        bordered={false}
        defaultActiveKey={['1']}
        ghost
        expandIconPosition="right"
        className="bg-transparent"
        onChange={(key) => handlePanelClick(key)}
      >
        {subjects.map(subject => (
          <Panel
            header={
              <div className="flex items-center text-white">
                <Text className="text-lg font-semibold">{subject.name}</Text>
              </div>
            }
            key={subject._id}
            className="bg-white rounded-lg shadow-md p-4 mb-4"
          >
            {loading ? <p>Loading...</p> : (
              <Table
                columns={columns}
                dataSource={assignments}
                pagination={false}
                bordered
                className="bg-gray-50 rounded-lg shadow-md"
              />
            )}
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default AssignmentList;
