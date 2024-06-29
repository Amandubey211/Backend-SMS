import React from 'react';
import { assignments } from '../../../Modules/Parents/GradeChild/DummyData/data';
import { Table, Tag, Space } from 'antd';

const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}<br/><small>Group Assignment</small></a>,
    },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
      render: text => <span>{text}<br/><small color='#0D9755'>Chapter 2</small></span>,
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
  
  const AssignmentList = () => (
    <div>
        <h1 className='text-2xl font-bold text-gradient mb-4 p-4'>Assignment</h1>
    <Table
      columns={columns}
      dataSource={assignments}
      pagination={false}
      bordered
    />
    </div>
  );
export default AssignmentList;
