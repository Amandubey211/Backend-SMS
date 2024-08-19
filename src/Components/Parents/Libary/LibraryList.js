import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import axios from 'axios';
import { format } from 'date-fns';
import { baseUrl } from '../../../config/Common';
import Spinner from "../../../Components/Common/Spinner"; // Importing Spinner
import { FaBookOpen } from "react-icons/fa"; // Importing an icon for no data or error messages

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
        const response = await axios.get(`${baseUrl}/parent/all/bookIssue`, {
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

      title: 'Issue Book',
      dataIndex: 'bookName',
      key: 'bookName',
      render: (text, record) => (
        <div className="flex items-center">
          <img
            src={record.image}
            alt={record.bookName}
            className="h-12 w-12 rounded-full mr-4"
          />
          <span>{record.bookName}</span>
        </div>
      ),
    },
    {
      title: 'Author Name',
      dataIndex: 'author',
      key: 'author',
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
          Status
          <label className="radio-container" style={{ position: 'relative', paddingLeft: '32px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="status"
              value="All"
              checked={statusFilter === 'All'}
              onChange={() => handleFilterChange('All')}
              style={{ display: 'none' }}
            />
            <span style={{ position: 'relative', paddingLeft: '20px' }}>
              All
              <span style={{
                content: '',
                position: 'absolute',
                top: '50%',
                left: '0',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                border: '2px solid #0D9755', /* Green border */
                borderRadius: '50%',
                background: '#FFFFFF', /* White background */
              }}></span>
              {statusFilter === 'All' && (
                <span style={{
                  position: 'absolute',
                  top: '50%',
                  left: '4px',
                  transform: 'translateY(-50%)',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#0D9755', /* Green color when checked */
                }}></span>
              )}
            </span>
          </label>
          <label className="radio-container" style={{ position: 'relative', paddingLeft: '32px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="status"
              value="Pending"
              checked={statusFilter === 'Pending'}
              onChange={() => handleFilterChange('Pending')}
              style={{ display: 'none' }}
            />
            <span style={{ position: 'relative', paddingLeft: '20px' }}>
              Pending
              <span style={{
                content: '',
                position: 'absolute',
                top: '50%',
                left: '0',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                border: '2px solid #0D9755', /* Green border */
                borderRadius: '50%',
                background: '#FFFFFF', /* White background */
              }}></span>
              {statusFilter === 'Pending' && (
                <span style={{
                  position: 'absolute',
                  top: '50%',
                  left: '4px',
                  transform: 'translateY(-50%)',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#0D9755', /* Green color when checked */
                }}></span>
              )}
            </span>
          </label>
          <label className="radio-container" style={{ position: 'relative', paddingLeft: '32px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="status"
              value="Return"
              checked={statusFilter === 'Return'}
              onChange={() => handleFilterChange('Return')}
              style={{ display: 'none' }}
            />
            <span style={{ position: 'relative', paddingLeft: '20px' }}>
              Return
              <span style={{
                content: '',
                position: 'absolute',
                top: '50%',
                left: '0',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                border: '2px solid #0D9755', /* Green border */
                borderRadius: '50%',
                background: '#FFFFFF', /* White background */
              }}></span>
              {statusFilter === 'Return' && (
                <span style={{
                  position: 'absolute',
                  top: '50%',
                  left: '4px',
                  transform: 'translateY(-50%)',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#0D9755', /* Green color when checked */
                }}></span>
              )}
            </span>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <FaBookOpen className="text-gray-400 text-6xl mb-4" />
          <p className="text-gray-600 text-lg">Failed to fetch library data</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <FaBookOpen className="text-gray-400 text-6xl mb-4" />
          <p className="text-gray-600 text-lg">No Library Data Found</p>
        </div>
      ) : (
        <Table columns={columns} dataSource={filteredData} rowKey="_id" />
      )}
    </div>
  );
};

export default LibraryTable;
