import React from 'react';
import { assignments } from '../../../Modules/Parents/GradeChild/DummyData/data';
import { Table, Tag, Collapse, Typography } from 'antd';
import 'tailwindcss/tailwind.css';

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

const subjects = [
  {
    key: '1',
    title: 'Business Planning System',
    icon: 'https://path-to-business-planning-icon',
  }
 
];

const AssignmentList = () => (
  <div className="p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-lg shadow-lg">
    <h1 className="text-4xl font-bold text-white mb-8 p-4 border-b-2 border-white">Assignments</h1>
    <Collapse
      accordion
      bordered={false}
      defaultActiveKey={['1']}
      ghost
      expandIconPosition="right"
      className="bg-transparent"
    >
      {subjects.map(subject => (
        <Panel
          header={
            <div className="flex items-center text-white">
              <img src={subject.icon} alt={subject.title} className="mr-4 w-10 h-10 rounded-full shadow-lg" />
              <Text className="text-lg font-semibold">{subject.title}</Text>
            </div>
          }
          key={subject.key}
          className="bg-white rounded-lg shadow-md p-4 mb-4"
        >
          <Table
            columns={columns}
            dataSource={assignments}
            pagination={false}
            bordered
            className="bg-gray-50 rounded-lg shadow-md"
          />
        </Panel>
      ))}
    </Collapse>
  </div>
);

export default AssignmentList;
