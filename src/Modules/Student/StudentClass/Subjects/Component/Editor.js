// import React, { useState } from "react";
// import "react-quill/dist/quill.snow.css";
// import ReactQuill from "react-quill";

// const Editor = ({
//   assignmentLabel,
//   hideInput,
//   assignmentName,
//   editorContent,
//   onNameChange,
//   onEditorChange,
// }) => {

//   const handleSubmit = () => {
//     console.log("Editor Content:", editorContent);
//   };


//   return (
//     <div className="w-full p-6 bg-white mb-3">
//       {!hideInput && (
//         <>
//           {/* <label className="block mb-2 text-sm font-medium text-gray-700">
//             {assignmentLabel}
//           </label> */}
//           {/* <input
//             type="text"
//             value={assignmentName}
//             onChange={(e) => onNameChange(e.target.value)}
//             className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           /> */}
//         </>
//       )}
//       <ReactQuill
//         value={editorContent}
//         onChange={onEditorChange}
//         className="bg-white"
//         theme="snow"
//         style={{ height: "300px" }} // Adjust the height as needed
//       />
//       <button
//         onClick={handleSubmit}
//         className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       >
//         Submit
//       </button>
//     </div>
//   );
// };

// export default Editor;

import React, { useState } from "react";
//import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const Editor = ({
  editorContent,
  onEditorChange,
  onSubmit
}) => {

  const handleSubmit = () => {
    console.log("Editor Content:", editorContent);
    onSubmit();
  };

  return (
    <div className="w-full flex flex-col   p-6 h-screen bg-white mb-3 shadow-md rounded-lg">
    <div>
        <ReactQuill
        value={editorContent}
        onChange={onEditorChange}
        className="bg-white"
        theme="snow"
        style={{ height: "300px" }} // Adjust the height as needed
      />
    </div>
    

    <div>
        <button
        onClick={handleSubmit}
        className="mt-[70px] px-4 py-2 text-white font-medium rounded-md shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </div>
    
    </div>
  );
};

export default Editor;
