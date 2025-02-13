// import React, { useRef, useState } from "react";
// import Handsontable from "handsontable";
// import { HotTable, HotColumn } from "@handsontable/react";
// import "handsontable/dist/handsontable.full.css";

// const CreateManually = () => {
//   const hotRef = useRef(null);
//   const [tableData, setTableData] = useState([
//     ["", "", "", "", "", "", "", ""],
//   ]);

//   const [headers, setHeaders] = useState([
//     "Name",
//     "Admission Number",
//     "Quiz 1",
//     "Exam 1",
//     "Quiz 2",
//     "Exam 2",
//     "Project",
//     "Actions", // Delete button column
//   ]);

//   // ✅ Handle table updates
//   const handleAfterChange = (changes, source) => {
//     if (!changes || source === "loadData") return;
//     const updatedData = [...tableData];
//     changes.forEach(([row, prop, oldValue, newValue]) => {
//       updatedData[row][prop] = newValue;
//     });
//     setTableData(updatedData);
//   };

//   // ✅ Add a new row
//   const addRow = () => {
//     const newRow = new Array(headers.length).fill(""); // Empty row
//     setTableData((prev) => [...prev, newRow]);
//   };

//   // ✅ Add a new column
//   const addColumn = () => {
//     const newColumnName = `Column ${headers.length}`;
//     setHeaders((prev) => [...prev.slice(0, -1), newColumnName, "Actions"]); // Insert before "Actions"

//     setTableData(
//       (prev) =>
//         prev.map((row) => [...row.slice(0, -1), "", row[row.length - 1]]) // Insert before "Actions"
//     );
//   };

//   // ✅ Remove a column when clicking the header
//   const handleColumnClick = (colIndex) => {
//     if (headers[colIndex] === "Actions") return; // Prevent deleting the last column
//     setHeaders(headers.filter((_, index) => index !== colIndex));

//     setTableData((prev) =>
//       prev.map((row) => row.filter((_, index) => index !== colIndex))
//     );
//   };

//   // ✅ Remove row properly
//   const removeRow = (rowIndex) => {
//     setTableData((prev) => prev.filter((_, index) => index !== rowIndex));
//   };

//   return (
//     <div className="w-full p-4 bg-white border shadow-md mt-2 rounded-md">
//       <h2 className="text-lg font-semibold text-gray-700 mb-2">
//         📋 Edit Exam Data
//       </h2>

//       {/* ✅ Buttons to Add Row & Column */}
//       <div className="flex gap-3 mb-3">
//         <button
//           onClick={addRow}
//           className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
//         >
//           ➕ Add Row
//         </button>
//         <button
//           onClick={addColumn}
//           className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600"
//         >
//           ➕ Add Column
//         </button>
//       </div>

//       {/* Handsontable Component */}
//       <HotTable
//         ref={hotRef}
//         data={tableData}
//         colHeaders={headers}
//         rowHeaders={true}
//         height={450}
//         stretchH="all"
//         manualRowMove={true}
//         manualColumnMove={true}
//         contextMenu={true}
//         afterChange={handleAfterChange}
//         licenseKey="non-commercial-and-evaluation"
//       >
//         {headers.slice(0, -1).map((_, index) => (
//           <HotColumn key={index} data={index} />
//         ))}

//         {/* ✅ Fix: Remove Row Without Redirecting */}
//         <HotColumn
//           data={null}
//           readOnly={true}
//           renderer={(instance, td, row) => {
//             const button = document.createElement("button");
//             button.innerText = "❌ Delete";
//             button.className =
//               "text-red-500 bg-gray-100 border rounded px-2 py-1 cursor-pointer";
//             button.type = "button";
//             button.onclick = (event) => {
//               event.preventDefault();
//               event.stopPropagation();
//               event.stopImmediatePropagation();

//               removeRow(row);
//             };
//             td.innerHTML = "";
//             td.appendChild(button);
//           }}
//         />
//       </HotTable>
//     </div>
//   );
// };

// export default CreateManually;
