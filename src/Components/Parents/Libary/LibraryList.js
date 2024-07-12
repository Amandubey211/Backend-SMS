import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import axios from 'axios';
import { format } from 'date-fns';

const LibraryTable = () => {
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('parent:token');
      try {
        const response = await axios.get('http://localhost:8080/parent/api/all/bookIssue', {
          headers: {
            Authentication: `${token}`
          }
        });

        const mappedData = response.data.books.map(book => ({
          ...book,
          issueDate: format(new Date(book.issueDate), 'dd/MM/yyyy'),
          returnDate: format(new Date(book.returnDate), 'dd/MM/yyyy'),
          bookName: book.bookId.name,
          bookCategory: book.bookId.category,
        }));
        console.log(mappedData);
        setData(mappedData);
      } catch (err) {
        setError(err.message);
        message.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (value) => {
    setStatusFilter(value);
  };

  const filteredData = data.filter((item) => {
    if (statusFilter === 'All') return true;
    return item.status === statusFilter;
  });

  const columns = [
    {
      title: 'Child',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Book Name',
      dataIndex: 'bookName',
      key: 'bookName',
    },
    {
      title: 'Category',
      dataIndex: 'bookCategory',
      key: 'bookCategory',
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Library Status</h1>
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
      <Table columns={columns} dataSource={filteredData} rowKey="_id" loading={loading} />
    </div>
  );
};

export default LibraryTable;
