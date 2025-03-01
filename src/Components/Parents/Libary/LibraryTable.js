import React, { useEffect, useState, useMemo } from 'react';
import { Table, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLibraryBooks } from '../../../Store/Slices/Parent/Library/library.action';
import { FaBookOpen } from 'react-icons/fa';
import { RiSignalWifiErrorFill } from 'react-icons/ri';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { LibraryRowSkeleton } from '../../../Modules/Parents/Skeletons';
import bookNew from '../../../Assets/ParentAssets/images/book_new.png'; // Import fallback book image

const { Option } = Select;

// Fallback image URL for user profile
const fallbackProfile = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const LibraryTable = () => {
  const { t } = useTranslation('prtLibrary');
  const dispatch = useDispatch();

  // Redux state
  const {
    books = [],
    loading = false,
    error = null,
  } = useSelector((state) => state?.Parent?.library || {});

  // Local state for filtering & pagination
  const [childFilter, setChildFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchLibraryBooks());
  }, [dispatch]);

  /**
   * 1. Build dropdown options from studentId
   *    - Each unique student => { _id, fullName, profile }
   */
  const childrenOptions = useMemo(() => {
    const map = {};
    books.forEach((item) => {
      const student = item?.studentId;
      if (student && student._id && !map[student._id]) {
        const fallbackName = [student?.firstName, student?.lastName]
          .filter(Boolean)
          .join(' ');
        map[student._id] = {
          _id: student._id,
          fullName: student?.fullName || (fallbackName ? fallbackName : 'N/A'),
          profile: student?.profile || fallbackProfile,
        };
      }
    });
    return Object.values(map);
  }, [books]);

  /**
   * 2. Date Formatting
   */
  const formatDate = (dateString) => {
    return dateString ? dayjs(dateString).format('DD/MM/YY') : 'N/A';
  };

  /**
   * 3. Filter Logic (child + status)
   */
  const filteredData = useMemo(() => {
    let data = [...books];
    if (childFilter !== 'All') {
      data = data.filter((item) => item?.studentId?._id === childFilter);
    }
    if (statusFilter !== 'All') {
      data = data.filter(
        (item) => (item?.status || '').toLowerCase() === statusFilter.toLowerCase()
      );
    }
    return data;
  }, [books, childFilter, statusFilter]);

  /**
   * 4. Pagination
   */
  const handlePageChange = (page) => setCurrentPage(page);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  /**
   * 5. Table Columns
   */
  const columns = [
    // Child
    {
      title: t('Child'),
      key: 'child',
      render: (_, record) => {
        const student = record?.studentId || {};
        const fallbackName = [student?.firstName, student?.lastName]
          .filter(Boolean)
          .join(' ');
        const displayName =
          student?.fullName || (fallbackName ? fallbackName : 'N/A');
        return (
          <div className="flex items-center">
            <img
              src={student?.profile || fallbackProfile}
              alt={displayName}
              className="h-10 w-10 rounded-full mr-2 object-cover"
            />
            <span>{displayName}</span>
          </div>
        );
      },
    },
    // Book
    {
      title: t('Issue Book'),
      key: 'book',
      render: (_, record) => {
        const book = record?.bookId;
        const bookName = book?.name || 'N/A';
        const bookImage = book?.image || bookNew;
        return (
          <div className="flex items-center">
            <img
              src={bookImage}
              alt={bookName}
              className="h-12 w-12 rounded-full mr-4 object-cover"
            />
            <span>{bookName}</span>
          </div>
        );
      },
    },
    // Author
    {
      title: t('Author Name'),
      key: 'author',
      render: (_, record) => {
        const book = record?.bookId;
        return <span>{book?.author || record?.author || 'N/A'}</span>;
      },
    },
    // Category
    {
      title: t('Category'),
      key: 'category',
      render: (_, record) => {
        const book = record?.bookId;
        return <span>{book?.category || 'N/A'}</span>;
      },
    },
    // Issue Date
    {
      title: t('Issue Date'),
      dataIndex: 'issueDate',
      key: 'issueDate',
      render: (date) => formatDate(date),
    },
    // Return Date
    {
      title: t('Return Date'),
      dataIndex: 'returnDate',
      key: 'returnDate',
      render: (date) => formatDate(date),
    },
    // Status
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const isReturned = (status || '').toLowerCase() === 'returned';
        return (
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm ${
              isReturned
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {status || 'N/A'}
          </span>
        );
      },
    },
  ];

  /**
   * 6. Loading / No-Data / Error states
   */
  const renderLoading = () => <LibraryRowSkeleton rows={3} />;


  const renderErrorMessage = () => (
    <tr>
      <td colSpan={columns.length}>
        <div
          className="flex flex-col items-center justify-center text-center py-4"
          style={{
            width: '100%',
            height: '200px',
          }}
        >
          <RiSignalWifiErrorFill className="text-gray-400 text-8xl mb-6" />
          <p className="text-gray-600 text-lg mt-2">
            {t('Error')}: {error} — {t('Unable to fetch Library data')}
          </p>
        </div>
      </td>
    </tr>
  );

  /**
   * 7. Render
   */
  return (
    <div className="p-6 pt-5">
      {/* Header: Title + Filters */}
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center space-x-6">
          {/* Child Filter */}
          <Select
            value={childFilter}
            onChange={setChildFilter}
            style={{ width: 220 }}
          >
            <Option value="All">{t('All Children')}</Option>
            {childrenOptions.map((child) => (
              <Option key={child._id} value={child._id}>
                <div className="flex items-center">
                  <img
                    src={child.profile}
                    alt={child.fullName}
                    className="h-5 w-5 rounded-full mr-2 object-cover"
                  />
                  <span>{child.fullName}</span>
                </div>
              </Option>
            ))}
          </Select>

          {/* Status Filter */}
          <div className="flex items-center space-x-4">
            <span className="font-medium">{t('Status')}</span>
            {/* All */}
            <label style={{ position: 'relative', paddingLeft: '24px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="status"
                value="All"
                checked={statusFilter === 'All'}
                onChange={() => setStatusFilter('All')}
                style={{ display: 'none' }}
              />
              <span style={{ position: 'relative', paddingLeft: '16px' }}>
                {t('All')}
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    transform: 'translateY(-50%)',
                    width: '14px',
                    height: '14px',
                    border: '2px solid #0D9755',
                    borderRadius: '50%',
                    background: '#FFF',
                  }}
                />
                {statusFilter === 'All' && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '3px',
                      transform: 'translateY(-50%)',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#0D9755',
                    }}
                  />
                )}
              </span>
            </label>

            {/* Pending */}
            <label style={{ position: 'relative', paddingLeft: '24px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="status"
                value="Pending"
                checked={statusFilter === 'Pending'}
                onChange={() => setStatusFilter('Pending')}
                style={{ display: 'none' }}
              />
              <span style={{ position: 'relative', paddingLeft: '16px' }}>
                {t('Pending')}
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    transform: 'translateY(-50%)',
                    width: '14px',
                    height: '14px',
                    border: '2px solid #0D9755',
                    borderRadius: '50%',
                    background: '#FFF',
                  }}
                />
                {statusFilter === 'Pending' && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '3px',
                      transform: 'translateY(-50%)',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#0D9755',
                    }}
                  />
                )}
              </span>
            </label>

            {/* Returned */}
            <label style={{ position: 'relative', paddingLeft: '24px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="status"
                value="Returned"
                checked={statusFilter === 'Returned'}
                onChange={() => setStatusFilter('Returned')}
                style={{ display: 'none' }}
              />
              <span style={{ position: 'relative', paddingLeft: '16px' }}>
                {t('Returned')}
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    transform: 'translateY(-50%)',
                    width: '14px',
                    height: '14px',
                    border: '2px solid #0D9755',
                    borderRadius: '50%',
                    background: '#FFF',
                  }}
                />
                {statusFilter === 'Returned' && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '3px',
                      transform: 'translateY(-50%)',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#0D9755',
                    }}
                  />
                )}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={paginatedData}
        rowKey="_id"
        pagination={{
          current: currentPage,
          pageSize,
          total: filteredData.length,
          onChange: handlePageChange,
          showSizeChanger: false,
        }}
        locale={{
          emptyText: loading
            ? renderLoading()
            : error
            ? renderErrorMessage()
           : <div
           className="flex flex-col items-center justify-center text-center py-4"
           style={{
             width: '100%',
             height: '200px',
           }}
         >
           <FaBookOpen className="text-gray-400 text-8xl mb-6" />
           <p className="text-gray-600 text-lg mt-2">
             {t('No borrowed books at the moment. Encourage your child to explore the library!')}
           </p>
         </div>,
        }}
      />
    </div>
  );
};

export default LibraryTable;
