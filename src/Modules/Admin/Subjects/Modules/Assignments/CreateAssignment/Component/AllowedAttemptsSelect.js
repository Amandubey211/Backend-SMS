// import React from "react";

// const AllowedAttemptsSelect = ({ allowedAttempts, handleChange }) => (
//   <>
//     <label className="block mb-2 text-sm font-medium text-gray-700">
//       Allowed Attempts
//     </label>
//     <select
//       name="allowedAttempts"
//       value={allowedAttempts}
//       onChange={(e) =>
//         handleChange({
//           target: {
//             name: "allowedAttempts",
//             value: e.target.value === "true", // Ensure boolean is set
//           },
//         })
//       }
//       className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//     >
//       <option value="">Select</option>
//       <option value="true">Limited</option>
//       <option value="false">Unlimited</option>
//     </select>
//   </>
// );

// export default AllowedAttemptsSelect;

import React from "react";

const AllowedAttemptsSelect = ({ allowedAttempts, handleChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700">Allowed Attempts</label>
      <select
        name="allowedAttempts"
        value={allowedAttempts ? "true" : "false"} // Handle boolean as string
        onChange={(e) =>
          handleChange({
            target: {
              name: "allowedAttempts",
              value: e.target.value === "true", // Convert to boolean
            },
          })
        }
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select</option>
        <option value="true">Limited</option>
        <option value="false">Unlimited</option>
      </select>
    </div>
  );
};

export default AllowedAttemptsSelect;
