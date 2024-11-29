// import React, { useEffect, useState } from 'react';
// import { Table, Tag, Collapse, Typography } from 'antd';
// import axios from 'axios';
// import { baseUrl } from '../../../config/Common';
// import Spinner from '../../../Components/Common/Spinner';
// import { FaExclamationTriangle } from 'react-icons/fa';

// const { Panel } = Collapse;
// const { Text } = Typography;

// const columns = [
//   {
//     title: 'Name',
//     dataIndex: 'name',
//     key: 'name',
//     render: text => (
//       <a className="text-blue-600 hover:text-blue-800">
//         {text}
//         <br />
//         <small className="text-gray-500">Group Assignment</small>
//       </a>
//     ),
//   },
//   {
//     title: 'Module',
//     dataIndex: 'module',
//     key: 'module',
//     render: text => (
//       <span>
//         {text}
//         <br />
//         <small className="text-green-600">Chapter 2</small>
//       </span>
//     ),
//   },
//   {
//     title: 'Due Date',
//     dataIndex: 'dueDate',
//     key: 'dueDate',
//   },
//   {
//     title: 'Status',
//     dataIndex: 'status',
//     key: 'status',
//     render: status => {
//       let color = status === 'Submit' ? 'green' : status === 'Missing' ? 'red' : 'orange';
//       return <Tag color={color}>{status}</Tag>;
//     },
//   },
//   {
//     title: 'Score',
//     dataIndex: 'score',
//     key: 'score',
//   },
// ];

// const AssignmentList = () => {
//   const [subjects, setSubjects] = useState([]);
//   const [assignments, setAssignments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       setLoading(true);
//       try {
//         const childrenData = JSON.parse(localStorage.getItem('childrenData'));
//         const studentId = childrenData[0].id;
//         const token = localStorage.getItem('parent:token');
//         if (!token) {
//           throw new Error('Authentication token not found');
//         }

//         const response = await axios.get(`${baseUrl}/api/studentDashboard/subjects/${studentId}`, {
//           headers: { Authentication: token }
//         });

//         if (response.data && response.data.subjects) {
//           setSubjects(response.data.subjects);
//           setError(null);
//         } else {
//           throw new Error('No subjects data available');
//         }
//       } catch (err) {
//         setError('Unable to fetch subjects');
//         console.error('Error fetching subjects:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubjects();
//   }, []);

//   const handlePanelClick = async (subjectId) => {
//     setLoading(true);
//     try {
//       const childrenData = JSON.parse(localStorage.getItem('childrenData'));
//       const studentId = childrenData[0].id;
//       const classId = childrenData[0].classId;
//       const token = localStorage.getItem('parent:token');
//       const url = `${baseUrl}/parent/api/grades?studentId=${studentId}&classId=${classId}&subjectId=${subjectId}`;

//       const response = await axios.get(url, {
//         headers: { Authentication: token }
//       });

//       if (response.data && response.data.assignments) {
//         setAssignments(response.data.assignments);
//         setError(null);
//       } else {
//         throw new Error('No assignments data available');
//       }
//     } catch (err) {
//       setError('Unable to fetch assignments');
//       console.error('Error fetching assignments:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 rounded-lg shadow-lg">
//       <h1 className="text-4xl font-bold mb-8 p-4 text-gradient from-purple-500 via-pink-500 to-red-500 border-b-2 border-white">Assignments</h1>
//       {loading && (
//         <div className="flex justify-center items-center h-full">
//           <Spinner />
//         </div>
//       )}
//       {!loading && error && (
//         <div className="flex flex-col items-center justify-center h-full text-center">
//           <FaExclamationTriangle className="text-6xl text-gray-400 mb-4" />
//           <p className="text-gray-500">Unable to Fetch Assignment</p>
//         </div>
//       )}
//       {!loading && !error && subjects?.length === 0 && (
//         <div className="flex flex-col items-center justify-center h-full text-center">
//           <FaExclamationTriangle className="text-6xl text-gray-400 mb-4" />
//           <p className="text-gray-500">No Data Yet</p>
//         </div>
//       )}
//       {!loading && !error && subjects?.length > 0 && (
//         <Collapse
//           accordion
//           bordered={false}
//           defaultActiveKey={['1']}
//           ghost
//           expandIconPosition="right"
//           className="bg-transparent"
//           onChange={(key) => handlePanelClick(key)}
//         >
//           {subjects?.map(subject => (
//             <Panel
//               header={
//                 <div className="flex items-center text-white">
//                   <Text className="text-lg text-gradient font-semibold">{subject.name}</Text>
//                 </div>
//               }
//               key={subject._id}
//               className="bg-gradient rounded-lg shadow-md p-4 mb-4"
//             >
//               <Table
//                 columns={columns}
//                 dataSource={assignments}
//                 pagination={false}
//                 bordered
//                 className="bg-gray-50 rounded-lg shadow-md"
//               />
//             </Panel>
//           ))}
//         </Collapse>
//       )}
//     </div>
//   );
// };

// export default AssignmentList;
