// import React, { useState, useRef } from "react";
// import { HotTable } from "@handsontable/react";
// import * as XLSX from "xlsx";
// import "handsontable/dist/handsontable.full.css";

// const ExcelUploadWithHandsontable = () => {
//   const [data, setData] = useState([]); // Stores table data
//   const hotRef = useRef(null);

//   // Predefined Headers
//   const headers = [
//     "Name",
//     "admissionNumber",
//     "Quiz 1",
//     "Exam 1",
//     "Quiz 2",
//     "Exam 2",
//     "Project",
//   ];

//   // Handle Excel File Upload
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const binaryStr = event.target.result;
//       const workbook = XLSX.read(binaryStr, { type: "binary" });

//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//       // Ensure headers match predefined headers
//       const formattedData = jsonData
//         .slice(1)
//         .map((row) => headers.map((_, index) => row[index] || ""));

//       setData([headers, ...formattedData]); // Add headers as the first row
//     };

//     reader.readAsBinaryString(file);
//   };

//   // Save Edited Data (Replace with API call if needed)
//   const handleSave = () => {
//     if (hotRef.current) {
//       const updatedData = hotRef.current.hotInstance.getData();
//       console.log("Saved Data:", updatedData);
//       alert("Data saved successfully!");
//     }
//   };

//   return (
//     <div className="p-4 border rounded-lg shadow-md bg-white w-full max-w-3xl mx-auto">
//       {/* Upload Button */}
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         Upload Excel File:
//       </label>
//       <input
//         type="file"
//         accept=".xlsx, .xls"
//         onChange={handleFileUpload}
//         className="mb-4 border border-gray-300 p-2 rounded w-full"
//       />

//       {/* Handsontable */}
//       {data.length > 0 && (
//         <HotTable
//           data={data}
//           colHeaders={true}
//           rowHeaders={true}
//           width="100%"
//           height="auto"
//           ref={hotRef}
//           licenseKey="non-commercial-and-evaluation"
//           className="mb-4"
//         />
//       )}

//       {/* Save Button */}
//       <button
//         onClick={handleSave}
//         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//       >
//         Save Data
//       </button>
//     </div>
//   );
// };

// export default ExcelUploadWithHandsontable;
