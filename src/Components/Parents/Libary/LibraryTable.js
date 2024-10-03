import React, { useEffect, useState, useMemo } from 'react';
import { Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLibraryBooks } from '../../../Store/Slices/Parent/Library/library.action'; // Redux Thunk for fetching data
import Spinner from "../../../Components/Common/Spinner"; // Importing Spinner
import { FaBookOpen } from "react-icons/fa"; // Importing an icon for no data or error messages
import { RiSignalWifiErrorFill } from "react-icons/ri";
import dayjs from 'dayjs'; // For formatting dates
import { useTranslation } from 'react-i18next'; // Import i18next hook

const LibraryTable = () => {
  const { t } = useTranslation('prtLibrary'); // Initialize i18next hook
  const dispatch = useDispatch();
  const { books = [], loading = false, error = null } = useSelector((state) => state?.Parent?.library || {}); // Optional chaining and default values
  const [statusFilter, setStatusFilter] = useState('All');

  // Fetch library books when the component mounts using Redux thunk
  useEffect(() => {
    dispatch(fetchLibraryBooks());
  }, [dispatch]);

  // Handle filter change
  const handleFilterChange = (value) => {
    setStatusFilter(value);
  };

  // Date formatting function for dd/mm/yy format
  const formatDate = (dateString) => {
    return dateString ? dayjs(dateString).format('DD/MM/YY') : t('N/A'); // Use translated 'N/A'
  };

  // Memoized filtered data to avoid unnecessary recalculations
  const filteredData = useMemo(() => {
    if (statusFilter === 'All') return books;
    return books.filter((item) => item?.status?.toLowerCase() === statusFilter.toLowerCase());
  }, [statusFilter, books]);

  const columns = [
    {
      title: t('Issue Book'), // Translation for 'Issue Book'
      dataIndex: 'bookName',
      key: 'bookName',
      render: (text, record) => (
        <div className="flex items-center">
          <img
            src={record?.bookId?.image || "/placeholder.png"} // Fallback for missing image
            alt={record?.bookName || t("Unknown Book")} // Translation for 'Unknown Book'
            className="h-12 w-12 rounded-full mr-4"
          />
          <span>{record?.bookName || t('Unknown')}</span> {/* Translation for 'Unknown' */}
        </div>
      ),
    },
    {
      title: t('Author Name'), // Translation for 'Author Name'
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: t('Category'), // Translation for 'Category'
      dataIndex: 'bookCategory',
      key: 'bookCategory',
    },
    {
      title: t('Issue Date'), // Translation for 'Issue Date'
      dataIndex: 'issueDate',
      key: 'issueDate',
      render: (date) => formatDate(date), // Formatting date to dd/mm/yy
    },
    {
      title: t('Return Date'), // Translation for 'Return Date'
      dataIndex: 'returnDate',
      key: 'returnDate',
      render: (date) => formatDate(date), // Formatting date to dd/mm/yy
    },
    {
      title: t('Status'), // Translation for 'Status'
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm ${status?.toLowerCase() === 'returned' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
        >
          {status}
        </span>
      ),
    },
  ];

  // Render Error Message
  const renderErrorMessage = () => {
    return (
      <tr>
        <td colSpan={columns.length} style={{ width: '88rem' }}>
          <div className="w-full flex flex-col items-center justify-center py-4" style={{"marginTop": '5rem', marginBottom: '10rem'}}>
            <RiSignalWifiErrorFill className="text-gray-400 text-8xl mb-6" />
            <p className="text-gray-600 text-lg text-center mt-2">{t('Error')}: {error} - {t('Unable to fetch Library data')}</p> {/* Translated error message */}
          </div>
        </td>
      </tr>
    );
  };

  // Render No Data Message
  const renderNoDataMessage = () => {
    return (
      <tr>
        <td colSpan={columns.length} style={{ width: '88rem' }}>
          <div className="w-full flex flex-col items-center justify-center py-4" style={{"marginTop": '5rem', marginBottom: '10rem'}}>
            <FaBookOpen className="text-gray-400 text-8xl mb-6" />
            <p className="text-gray-600 text-lg text-center mt-2">{t('No data available')}</p> {/* Translated no data message */}
          </div>
        </td>
      </tr>
    );
  };

  // Render Loading Spinner
  const renderLoading = () => {
    return (
      <tr>
        <td colSpan={columns.length} style={{ width: '88rem' }}>
          <div className="w-full flex justify-center py-4" style={{"marginTop": '5rem', marginBottom: '10rem'}}>
            <Spinner />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="p-6 pt-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{t('Library Status')}</h1> {/* Translated Library Status */}
        <div className="flex space-x-4">
          <span>{t('Status')}</span> {/* Translated Status */}
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
              {t('All')} {/* Translated 'All' */}
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '0',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  border: '2px solid #0D9755', // Green border for radio
                  borderRadius: '50%',
                  background: '#FFFFFF', // White background
                }}
              ></span>
              {statusFilter === 'All' && (
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '4px',
                    transform: 'translateY(-50%)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#0D9755', // Green dot inside
                  }}
                ></span>
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
              {t('Pending')} {/* Translated 'Pending' */}
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '0',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  border: '2px solid #0D9755', // Green border for radio
                  borderRadius: '50%',
                  background: '#FFFFFF', // White background
                }}
              ></span>
              {statusFilter === 'Pending' && (
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '4px',
                    transform: 'translateY(-50%)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#0D9755', // Green dot inside
                  }}
                ></span>
              )}
            </span>
          </label>
          <label className="radio-container" style={{ position: 'relative', paddingLeft: '32px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="status"
              value="Returned"
              checked={statusFilter === 'Returned'}
              onChange={() => handleFilterChange('Returned')}
              style={{ display: 'none' }}
            />
            <span style={{ position: 'relative', paddingLeft: '20px' }}>
              {t('Returned')} {/* Translated 'Returned' */}
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '0',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  border: '2px solid #0D9755', // Green border for radio
                  borderRadius: '50%',
                  background: '#FFFFFF', // White background
                }}
              ></span>
              {statusFilter === 'Returned' && (
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '4px',
                    transform: 'translateY(-50%)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#0D9755', // Green dot inside
                  }}
                ></span>
              )}
            </span>
          </label>
        </div>

      </div>

      {/* Render Table or Loading/Error/No Data */}
      <div className="relative">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          pagination={false} // Keeping the pagination off if not needed
          locale={{
            emptyText: loading ? renderLoading() : error ? renderErrorMessage() : renderNoDataMessage(),
          }}
        />
      </div>
    </div>
  );
};

export default LibraryTable;
