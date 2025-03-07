// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
// import { Input, Select, Button } from "antd";
// import { SearchOutlined, RedoOutlined } from "@ant-design/icons";
// import debounce from "lodash/debounce";
// import { useTranslation } from "react-i18next";

// const { Option } = Select;

// const TopNavigationWithFilters = ({
//   onBackendFilterChange,
//   onFrontendFilterChange,
//   academicYears,
// }) => {
//   const { t } = useTranslation("admTimeTable");
//   const dispatch = useDispatch();

//   // Get role from Redux store
//   const role = useSelector((store) => store.common.auth.role);

//   // Local filter state
//   const [filters, setFilters] = useState({
//     name: "",
//     classId: "",
//     type: "",
//     academicYear: "",
//   });

//   // Fetch classes from Redux store
//   const { classes, loading, error } = useSelector((state) => state.admin.class);

//   useEffect(() => {
//     if (role !== "parent" && role !== "student") {
//       dispatch(fetchAllClasses());
//     }
//   }, [dispatch, role]);

//   useEffect(() => {
//     if (error && role !== "parent" && role !== "student") {
//       // Handle or log the error as needed
//       console.error("Failed to load classes:", error);
//     }
//   }, [error, role]);

//   // Debounced function to handle name filtering
//   const debouncedHandleNameFilter = useMemo(
//     () =>
//       debounce((value) => {
//         onFrontendFilterChange(value);
//       }, 300),
//     [onFrontendFilterChange]
//   );

//   // Handle filter changes
//   const handleFilterChange = (filterName, value) => {
//     setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));

//     // Trigger backend filter change for these filters
//     if (
//       filterName === "classId" ||
//       filterName === "type" ||
//       filterName === "academicYear"
//     ) {
//       onBackendFilterChange({ ...filters, [filterName]: value });
//     }

//     // Trigger frontend filter change for "name"
//     if (filterName === "name") {
//       debouncedHandleNameFilter(value);
//     }
//   };

//   // Apply filters if you want a button to force re-query
//   const applyFilters = () => {
//     onBackendFilterChange(filters);
//     onFrontendFilterChange(filters.name);
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setFilters({
//       name: "",
//       classId: "",
//       type: "",
//       academicYear: "",
//     });
//     onBackendFilterChange({}); // Reset backend filters
//     onFrontendFilterChange(""); // Reset frontend filter
//   };

//   return (
//     <div className="p-4 bg-transparent mb-5">
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         {/* Name Filter */}
//         <div>
//           <label className="font-medium text-gray-700">{t("Name")}</label>
//           <Input
//             placeholder={t("Search by Name")}
//             prefix={<SearchOutlined />}
//             value={filters.name}
//             onChange={(e) => handleFilterChange("name", e.target.value)}
//             allowClear
//             className="w-full"
//           />
//         </div>

//         {/* Class Filter (Exclude for Parent/Student) */}
//         {role !== "parent" && role !== "student" && (
//           <div>
//             <label className="font-medium text-gray-700">{t("Class")}</label>
//             <Select
//               placeholder={t("Select Class")}
//               loading={loading}
//               value={filters.classId}
//               onChange={(value) => handleFilterChange("classId", value)}
//               className="w-full"
//               optionFilterProp="children"
//               showSearch
//               allowClear
//             >
//               <Option value="">{t("Select Class")}</Option>
//               {classes?.map((cls) => (
//                 <Option key={cls._id} value={cls._id}>
//                   {cls.className}
//                 </Option>
//               ))}
//             </Select>
//           </div>
//         )}

//         {/* Type Filter */}
//         <div>
//           <label className="font-medium text-gray-700">{t("Type")}</label>
//           <Select
//             placeholder={t("All Types")}
//             value={filters.type}
//             onChange={(value) => handleFilterChange("type", value)}
//             className="w-full"
//             allowClear
//           >
//             <Option value="">{t("All Types")}</Option>
//             <Option value="weekly">{t("Weekly")}</Option>
//             <Option value="exam">{t("Exam")}</Option>
//             <Option value="event">{t("Event")}</Option>
//             <Option value="others">{t("Others")}</Option>
//           </Select>
//         </div>

//         {/* Academic Year Filter (if provided) */}
//         {academicYears?.length > 0 && (
//           <div>
//             <label className="font-medium text-gray-700">
//               {t("Academic Year")}
//             </label>
//             <Select
//               placeholder={t("All Years")}
//               value={filters.academicYear}
//               onChange={(value) => handleFilterChange("academicYear", value)}
//               className="w-full"
//               allowClear
//             >
//               <Option value="">{t("All Years")}</Option>
//               {academicYears.map((year) => (
//                 <Option key={year} value={year}>
//                   {year}
//                 </Option>
//               ))}
//             </Select>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex items-end justify-end md:justify-start md:flex-row flex-col gap-4">
//           {/* Icon-Only Clear Filters Button with Hover Spin */}
//           <Button
//             onClick={clearFilters}
//             className="group text-blue-500 border border-blue-500 rounded-md px-4 py-2 flex items-center justify-center"
//             icon={
//               <RedoOutlined className="transition-transform duration-300 group-hover:animate-spin" />
//             }
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopNavigationWithFilters;
