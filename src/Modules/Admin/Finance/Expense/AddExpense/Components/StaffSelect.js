// src/components/StaffSelect.js

import React, { useEffect, useMemo, useCallback } from "react";
import { Select, Spin, Typography, Tag } from "antd";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { UserOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Fuse from "fuse.js"; // Import Fuse.js for fuzzy searching
import debounce from "lodash.debounce"; // Import debounce from lodash
import {
  fetchTeachingStaff,
  fetchNonTeachingStaff, // Ensure you have this action
} from "../../../../../../Store/Slices/Finance/Expenses/expensesThunks";

const { Option } = Select;
const { Text } = Typography;

// Dummy image URL; replace with actual image URL from backend when available
const dummyImageUrl = "https://via.placeholder.com/40";

const StaffSelect = ({
  name,
  label,
  setFieldValue,
  value,
  staffType, // Prop to determine staff type: 'teaching' or 'non-teaching'
}) => {
  const dispatch = useDispatch();

  // Select the appropriate staff list and loading/error states based on staffType
  const {
    teachingStaff,
    teachingStaffLoading,
    teachingStaffError,
    nonTeachingStaff,
    nonTeachingStaffLoading,
    nonTeachingStaffError,
  } = useSelector((state) => state.admin.expenses);

  // Determine which staff list to use
  const currentStaff =
    staffType === "non-teaching" ? nonTeachingStaff : teachingStaff;
  const currentLoading =
    staffType === "non-teaching"
      ? nonTeachingStaffLoading
      : teachingStaffLoading;
  const currentError =
    staffType === "non-teaching" ? nonTeachingStaffError : teachingStaffError;

  // Initialize search term state
  const [searchTerm, setSearchTerm] = React.useState("");

  // Fetch staff data on component mount or when staffType changes
  useEffect(() => {
    if (staffType === "non-teaching" && nonTeachingStaff.length === 0) {
      dispatch(fetchNonTeachingStaff());
    } else if (staffType === "teaching" && teachingStaff.length === 0) {
      dispatch(fetchTeachingStaff());
    }
  }, [dispatch, staffType, teachingStaff.length, nonTeachingStaff.length]);

  // Handle selection change
  const handleChange = (selectedId) => {
    setFieldValue(name, selectedId);
  };

  // Handle search input with debounce to optimize performance
  const debouncedHandleSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchTerm(value.trim().toLowerCase());
      }, 300), // 300ms debounce delay
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedHandleSearch.cancel();
    };
  }, [debouncedHandleSearch]);

  // Configure Fuse.js for fuzzy searching
  const fuse = useMemo(() => {
    return new Fuse(currentStaff, {
      keys: ["name", "role"],
      threshold: 0.3, // Adjusted for stricter matching
      ignoreLocation: true, // Allows matches anywhere in the string
      includeScore: true, // Optional: includes score in the result
    });
  }, [currentStaff]);

  // Perform fuzzy search
  const filteredStaff = useMemo(() => {
    if (!searchTerm) return currentStaff;
    const results = fuse.search(searchTerm);
    return results.map((result) => result.item);
  }, [currentStaff, searchTerm, fuse]);

  // Function to highlight the matching part of the staff name
  const highlightText = useCallback((text, highlight) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <span
              key={index}
              style={{ backgroundColor: "#ffc069", fontWeight: "bold" }}
            >
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  }, []);

  // Function to render staff options in two columns with image or icon
  const renderOptionContent = useCallback(
    (staff) => (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Left Column: Staff Image or Icon and Name */}
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          {staff.imageUrl ? (
            <img
              src={staff.imageUrl}
              alt={`${staff.name}'s avatar`}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: 8,
              }}
            />
          ) : (
            <UserOutlined
              style={{
                fontSize: 24,
                color: "#1890ff",
                marginRight: 8,
              }}
            />
          )}
          <Text>{highlightText(staff.name, searchTerm)}</Text>
        </div>
        {/* Right Column: Staff Roles */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {staff.role.map((role, index) => (
            <Tag
              color="blue"
              key={index}
              style={{ marginRight: 4, marginBottom: 4 }}
            >
              {role}
            </Tag>
          ))}
        </div>
      </div>
    ),
    [highlightText, searchTerm]
  );

  return (
    <div style={{ marginBottom: 24, padding: "0 16px" }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: "block",
            marginBottom: 8,
            fontWeight: "bold",
          }}
        >
          {label}
        </label>
      )}
      <Select
        showSearch
        size="large" // Increased size for more vertical padding
        placeholder={`Select a ${
          staffType === "non-teaching" ? "Non-Teaching" : "Teaching"
        } Staff Member`}
        value={value}
        onChange={handleChange}
        onSearch={debouncedHandleSearch}
        loading={currentLoading}
        notFoundContent={
          currentLoading ? <Spin size="small" /> : "No staff found"
        }
        optionFilterProp="children" // Using 'children' since we're handling custom rendering
        filterOption={false} // Disable default filtering to use custom logic
        allowClear // Enables the clear (×) icon
        clearIcon={<CloseCircleOutlined />} // Appropriate clear icon
        style={{ width: "100%" }}
        // Accessibility enhancements
        aria-label={`${
          staffType === "non-teaching" ? "Non-Teaching" : "Teaching"
        } Staff Select`}
      >
        {filteredStaff.map((staff) => (
          <Option key={staff._id} value={staff._id}>
            {renderOptionContent(staff)}
          </Option>
        ))}
      </Select>
      {currentError && (
        <Text type="danger" style={{ marginTop: 8, display: "block" }}>
          {currentError}
        </Text>
      )}
    </div>
  );
};

StaffSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  setFieldValue: PropTypes.func.isRequired,
  value: PropTypes.string,
  staffType: PropTypes.oneOf(["teaching", "non-teaching"]).isRequired,
};

StaffSelect.defaultProps = {
  label: "",
  value: undefined,
};

export default StaffSelect;

// // src/components/StaffSelect.js

// import React, { useEffect, useMemo, useCallback } from "react";
// import { Select, Spin, Typography, Tag } from "antd";
// import { useSelector, useDispatch } from "react-redux";
// import PropTypes from "prop-types";
// import { UserOutlined, CloseCircleOutlined } from "@ant-design/icons";
// import Fuse from "fuse.js"; // Import Fuse.js for fuzzy searching
// import debounce from "lodash.debounce"; // Import debounce from lodash
// import {
//   fetchTeachingStaff,
//   fetchNonTeachingStaff,
// } from "../../../../../../Store/Slices/Finance/Expenses/expensesThunks";

// const { Option } = Select;
// const { Text } = Typography;

// // Dummy image URL; replace with actual image URL from backend when available
// const dummyImageUrl = "https://via.placeholder.com/40";

// const StaffSelect = ({
//   name,
//   label,
//   setFieldValue,
//   value,
//   staffType, // Prop to determine staff type: 'teaching' or 'non-teaching'
// }) => {
//   const dispatch = useDispatch();

//   // Select the appropriate staff list and loading/error states based on staffType
//   const {
//     teachingStaff,
//     teachingStaffLoading,
//     teachingStaffError,
//     nonTeachingStaff,
//     nonTeachingStaffLoading,
//     nonTeachingStaffError,
//   } = useSelector((state) => state.admin.expenses);

//   // Determine which staff list to use
//   const currentStaff =
//     staffType === "non-teaching" ? nonTeachingStaff : teachingStaff;
//   const currentLoading =
//     staffType === "non-teaching"
//       ? nonTeachingStaffLoading
//       : teachingStaffLoading;
//   const currentError =
//     staffType === "non-teaching" ? nonTeachingStaffError : teachingStaffError;

//   const [searchTerm, setSearchTerm] = React.useState("");

//   useEffect(() => {
//     if (staffType === "non-teaching" && nonTeachingStaff.length === 0) {
//       dispatch(fetchNonTeachingStaff());
//     } else if (staffType === "teaching" && teachingStaff.length === 0) {
//       dispatch(fetchTeachingStaff());
//     }
//   }, [dispatch, staffType, teachingStaff.length, nonTeachingStaff.length]);

//   const handleChange = (selectedId) => {
//     setFieldValue(name, selectedId);
//   };

//   const debouncedHandleSearch = useMemo(
//     () =>
//       debounce((value) => {
//         setSearchTerm(value.trim().toLowerCase());
//       }, 300), // 300ms debounce delay
//     []
//   );

//   useEffect(() => {
//     return () => {
//       debouncedHandleSearch.cancel();
//     };
//   }, [debouncedHandleSearch]);

//   const fuse = useMemo(() => {
//     return new Fuse(currentStaff, {
//       keys: ["name", "role"],
//       threshold: 0.3, // Adjusted for stricter matching
//       ignoreLocation: true,
//       includeScore: true,
//     });
//   }, [currentStaff]);

//   const filteredStaff = useMemo(() => {
//     if (!searchTerm) return currentStaff;
//     const results = fuse.search(searchTerm);
//     return results.map((result) => result.item);
//   }, [currentStaff, searchTerm, fuse]);

//   const highlightText = useCallback((text, highlight) => {
//     if (!highlight) return text;
//     const regex = new RegExp(`(${highlight})`, "gi");
//     const parts = text.split(regex);
//     return (
//       <>
//         {parts.map((part, index) =>
//           regex.test(part) ? (
//             <span
//               key={index}
//               style={{
//                 backgroundColor: "#ff85c0", // Pink highlight
//                 fontWeight: "bold",
//               }}
//             >
//               {part}
//             </span>
//           ) : (
//             part
//           )
//         )}
//       </>
//     );
//   }, []);

//   const renderOptionContent = useCallback(
//     (staff) => (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           width: "100%",
//         }}
//       >
//         {/* Left Column: Staff Image or Icon and Name */}
//         <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
//           {staff.imageUrl ? (
//             <img
//               src={staff.imageUrl}
//               alt={`${staff.name}'s avatar`}
//               style={{
//                 width: 40,
//                 height: 40,
//                 borderRadius: "50%",
//                 objectFit: "cover",
//                 marginRight: 8,
//               }}
//             />
//           ) : (
//             <UserOutlined
//               style={{
//                 fontSize: 24,
//                 color: "#eb2f96", // Pink icon
//                 marginRight: 8,
//               }}
//             />
//           )}
//           <Text style={{ color: "#eb2f96" }}>
//             {highlightText(staff.name, searchTerm)}
//           </Text>
//         </div>
//         {/* Right Column: Staff Roles */}
//         <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end" }}>
//           {staff.role.map((role, index) => (
//             <Tag
//               color="pink" // Pink tags
//               key={index}
//               style={{ marginRight: 4, marginBottom: 4 }}
//             >
//               {role}
//             </Tag>
//           ))}
//         </div>
//       </div>
//     ),
//     [highlightText, searchTerm]
//   );

//   return (
//     <div style={{ marginBottom: 24, padding: "0 16px" }}>
//       {label && (
//         <label
//           htmlFor={name}
//           style={{
//             display: "block",
//             marginBottom: 8,
//             fontWeight: "bold",
//             color: "#eb2f96", // Pink label
//           }}
//         >
//           {label}
//         </label>
//       )}
//       <Select
//         showSearch
//         size="large" // Increased size for more vertical padding
//         placeholder={`Select a ${
//           staffType === "non-teaching" ? "Non-Teaching" : "Teaching"
//         } Staff Member`}
//         value={value}
//         onChange={handleChange}
//         onSearch={debouncedHandleSearch}
//         loading={currentLoading}
//         notFoundContent={
//           currentLoading ? <Spin size="small" /> : "No staff found"
//         }
//         optionFilterProp="children"
//         filterOption={false}
//         allowClear
//         clearIcon={<CloseCircleOutlined style={{ color: "#eb2f96" }} />} // Pink clear icon
//         style={{ width: "100%", borderColor: "#ffadd2" }} // Pink border
//       >
//         {filteredStaff.map((staff) => (
//           <Option key={staff._id} value={staff._id}>
//             {renderOptionContent(staff)}
//           </Option>
//         ))}
//       </Select>
//       {currentError && (
//         <Text type="danger" style={{ marginTop: 8, display: "block" }}>
//           {currentError}
//         </Text>
//       )}
//     </div>
//   );
// };

// StaffSelect.propTypes = {
//   name: PropTypes.string.isRequired,
//   label: PropTypes.string,
//   setFieldValue: PropTypes.func.isRequired,
//   value: PropTypes.string,
//   staffType: PropTypes.oneOf(["teaching", "non-teaching"]).isRequired,
// };

// StaffSelect.defaultProps = {
//   label: "",
//   value: undefined,
// };

// export default StaffSelect;
