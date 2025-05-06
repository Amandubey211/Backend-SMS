// // TextInput.js
// import React from "react";
// import { motion } from "framer-motion";
// import { forwardRef } from "react";

// const TextInput = forwardRef(
//   (
//     { label, name, value, onChange, placeholder, error, type = "text" },
//     ref
//   ) => {
//     return (
//       <div className="flex flex-col mb-2">
//         <label className="text-gray-700">{label}</label>
//         <input
//           ref={ref} // Attach ref
//           type={type}
//           name={name}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           className={`mt-1 p-2 block w-full rounded-md border ${
//             error ? "border-red-500" : "border-gray-300"
//           } shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
//         />
//         {error && (
//           <motion.div
//             className="text-red-500 mt-1 text-sm flex items-center"
//             initial={{ opacity: 0, y: -5 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -5 }}
//           >
//             <span className="mr-1">⚠️</span> {error}
//           </motion.div>
//         )}
//       </div>
//     );
//   }
// );
// export default TextInput;
