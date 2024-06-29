import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spin, Alert } from 'antd';
import LibraryData  from '../../../Modules/Parents/dummyData/dummyData'; 

const LibraryTable = () => {
  const [books, setBooks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("parent:token");
      try {
        const response = await axios.get('http://localhost:8080/admin/all/book', {
          headers: {
            'Authentication': `${token}`,
            'Content-Type': 'application/json',
          },
        });

        setBooks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching books');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);
  const handleFilterChange = (value) => {
    setStatusFilter(value);
  };

  const filteredData = LibraryData.filter((item) => {
    if (statusFilter === 'All') return true;
    return item.status === statusFilter;
  });


  
  const columns = [
    {
      title: 'Issue Book',
      dataIndex: 'issueBook',
      key: 'issueBook',
    },
    {
      title: 'Devon Lane',
      dataIndex: 'devonLane',
      key: 'devonLane',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
    },
    {
      title: 'Return Date',
      dataIndex: 'returnDate',
      key: 'returnDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm ${
            status === 'Return' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {status}
        </span>
      ),
    },
  ];
  if (loading) {
    return <Spin size="large" className="flex justify-center items-center h-screen" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Status</h1>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              statusFilter === 'All' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => handleFilterChange('All')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              statusFilter === 'Pending' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => handleFilterChange('Pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              statusFilter === 'Return' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => handleFilterChange('Return')}
          >
            Return
          </button>
        </div>
      </div>
      <Table columns={columns} dataSource={filteredData} rowKey="id" />
    </div>
  );
};

export default LibraryTable;
