// // src/components/TeachingStaffList.js

// import React, { useEffect, useState, useMemo } from "react";
// import { Input, List, Spin, Typography, Alert } from "antd";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchTeachingStaff } from "../../../../Store/Slices/Finance/Expenses/expensesThunks";

// const { Search } = Input;
// const { Text } = Typography;

// const TeachingStaffList = () => {
//   const dispatch = useDispatch();

//   // Adjust the state path based on your Redux store configuration
//   const { teachingStaff, teachingStaffLoading, teachingStaffError } =
//     useSelector((state) => state.admin.expenses);

//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     if (teachingStaff.length === 0) {
//       dispatch(fetchTeachingStaff());
//     }
//   }, [dispatch, teachingStaff.length]);

//   const handleSearch = (value) => {
//     setSearchTerm(value.trim().toLowerCase());
//   };

//   const filteredStaff = useMemo(() => {
//     return teachingStaff.filter(
//       (staff) =>
//         staff.name.toLowerCase().includes(searchTerm) ||
//         staff.role.some((role) => role.toLowerCase().includes(searchTerm))
//     );
//   }, [teachingStaff, searchTerm]);

//   if (teachingStaffLoading) {
//     return (
//       <div style={{ textAlign: "center", padding: "20px 0" }}>
//         <Spin size="large" />
//       </div>
//     );
//   }

//   if (teachingStaffError) {
//     return (
//       <Alert
//         message="Error"
//         description={teachingStaffError}
//         type="error"
//         showIcon
//         style={{ marginBottom: 16 }}
//       />
//     );
//   }

//   return (
//     <div>
//       <Search
//         placeholder="Search teaching staff by name or role"
//         onSearch={handleSearch}
//         onChange={(e) => handleSearch(e.target.value)}
//         value={searchTerm}
//         style={{ marginBottom: 16 }}
//         allowClear
//       />
//       <List
//         bordered
//         dataSource={filteredStaff}
//         locale={{ emptyText: "No teaching staff found." }}
//         renderItem={(staff) => (
//           <List.Item key={staff._id}>
//             <Text strong>{staff.name}</Text> - {staff.role.join(", ")}
//           </List.Item>
//         )}
//         pagination={{
//           pageSize: 5,
//           showSizeChanger: true,
//           pageSizeOptions: ["5", "10", "20"],
//         }}
//       />
//     </div>
//   );
// };

// export default TeachingStaffList;
