

// CreateAssignmentHolder.js

//----------------------------------------

// import React, { useState } from "react";
// import Editor from "../../../Component/Editor";
// import MediaUpload from "./MediaUpload";
// import TabButton from ".//TabButton";
// // TabButton
// const CreateAssignmentHolder = ({ onSubmit }) => {
//   const [editorContent, setEditorContent] = useState("");
//   const [activeTab, setActiveTab] = useState("Editor");

//   return (
//     <>
//       <div className="flex gap-4 mb-4">
//         <TabButton
//           isActive={activeTab === "Editor"}
//           onClick={() => setActiveTab("Editor")}
//         >
//           Editor
//         </TabButton>
//         <TabButton
//           isActive={activeTab === "MediaUpload"}
//           onClick={() => setActiveTab("MediaUpload")}
//         >
//           Media Upload
//         </TabButton>
//       </div>

//       {activeTab === "Editor" && (
//         <Editor
//           assignmentLabel="Assignment Title"
//           hideInput={false}
//           editorContent={editorContent}
//           onEditorChange={setEditorContent}
//           onSubmit={onSubmit}
//         />
//       )}

//       {activeTab === "MediaUpload" && <MediaUpload onSubmit={onSubmit} />}
//     </>
//   );
// };

// export default CreateAssignmentHolder;


//----------------------------------------



// import React, { useState } from "react";
// import Editor from "../../../Component/Editor";
// import MediaUpload from "./MediaUpload";
// import TabButton from "./TabButton";

// const CreateAssignmentHolder = ({ onSubmit, assignmentId }) => {
//   const [editorContent, setEditorContent] = useState("");
//   const [commentText, setCommentText] = useState("");
//   const [activeTab, setActiveTab] = useState("Editor");

//   const handleFormSubmit = async () => {
//     const token = localStorage.getItem("student:token");
//     if (!token) {
//       console.error("Authentication token not found");
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8080/student/studentAssignment/submit/${assignmentId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": token,
//         },
//         body: JSON.stringify({
//           content: editorContent,
//           type: activeTab === "Editor" ? "Text Entry" : "Media Upload",
//           commentText: commentText,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to submit assignment, status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (data.success) {
//         console.log("Assignment submitted successfully:", data);
//         onSubmit(); // Call the parent onSubmit function
//       } else {
//         console.error("Failed to submit assignment:", data.message);
//       }
//     } catch (error) {
//       console.error("Failed to submit assignment:", error);
//     }
//   };

//   return (
//     <>
//       <div className="flex gap-4 mb-4">
//         <TabButton
//           isActive={activeTab === "Editor"}
//           onClick={() => setActiveTab("Editor")}
//         >
//           Editor
//         </TabButton>
//         <TabButton
//           isActive={activeTab === "MediaUpload"}
//           onClick={() => setActiveTab("MediaUpload")}
//         >
//           Media Upload
//         </TabButton>
//       </div>

//       {activeTab === "Editor" && (
//         <Editor
//           assignmentLabel="Assignment Title"
//           hideInput={false}
//           editorContent={editorContent}
//           onEditorChange={setEditorContent}
//           onSubmit={handleFormSubmit}
//         />
//       )}

//       {activeTab === "MediaUpload" && <MediaUpload onSubmit={handleFormSubmit} />}

//       <div className="mt-4">
//         <label htmlFor="commentText" className="block text-sm font-medium text-gray-700">
//           Comment Text
//         </label>
//         <input
//           type="text"
//           id="commentText"
//           value={commentText}
//           onChange={(e) => setCommentText(e.target.value)}
//           className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
//         />
//       </div>
//     </>
//   );
// };

// export default CreateAssignmentHolder;



//-------------


// import React, { useState } from "react";
// import Editor from "../../../Component/Editor";
// import MediaUpload from "./MediaUpload";
// import TabButton from "./TabButton";

// const CreateAssignmentHolder = ({ onSubmit, assignmentId, isReattempt = false }) => {
//   const [editorContent, setEditorContent] = useState("");
//   const [commentText, setCommentText] = useState("");
//   const [activeTab, setActiveTab] = useState("Editor");

//   const handleFormSubmit = async () => {
//     const token = localStorage.getItem("student:token");
//     if (!token) {
//       console.error("Authentication token not found");
//       return;
//     }

//     const url = isReattempt
//       ? `http://localhost:8080/student/studentAssignment/reattempt/${assignmentId}`
//       : `http://localhost:8080/student/studentAssignment/submit/${assignmentId}`;

//     try {
//       const response = await fetch(url, {
//         method: isReattempt ? "PUT" : "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": token,
//         },
//         body: JSON.stringify({
//           content: editorContent,
//           type: activeTab === "Editor" ? "Text Entry" : "Media Upload",
//           comment: commentText,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to submit assignment, status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (data.success) {
//         console.log("Assignment submitted successfully:", data);
//         onSubmit(); // Call the parent onSubmit function
//       } else {
//         console.error("Failed to submit assignment:", data.message);
//       }
//     } catch (error) {
//       console.error("Failed to submit assignment:", error);
//     }
//   };

//   return (
//     <>
//       <div className="flex gap-4 mb-4">
//         <TabButton
//           isActive={activeTab === "Editor"}
//           onClick={() => setActiveTab("Editor")}
//         >
//           Editor
//         </TabButton>
//         <TabButton
//           isActive={activeTab === "MediaUpload"}
//           onClick={() => setActiveTab("MediaUpload")}
//         >
//           Media Upload
//         </TabButton>
//       </div>

//       {activeTab === "Editor" && (
//         <Editor
//           assignmentLabel="Assignment Title"
//           hideInput={false}
//           editorContent={editorContent}
//           onEditorChange={setEditorContent}
//           onSubmit={handleFormSubmit}
//         />
//       )}

//       {activeTab === "MediaUpload" && <MediaUpload onSubmit={handleFormSubmit} />}

//       <div className="mt-4">
//         <label htmlFor="commentText" className="block text-sm font-medium text-gray-700">
//           Comment Text
//         </label>
//         <input
//           type="text"
//           id="commentText"
//           value={commentText}
//           onChange={(e) => setCommentText(e.target.value)}
//           className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
//         />
//       </div>
//     </>
//   );
// };

// export default CreateAssignmentHolder;



//---------------------------
import React, { useState } from "react";
import Editor from "../../../Component/Editor";
import MediaUpload from "./MediaUpload";
import TabButton from "./TabButton";
import { toast } from 'react-hot-toast';

const CreateAssignmentHolder = ({ onSubmit, assignmentId, isReattempt = false }) => {
  const [editorContent, setEditorContent] = useState("");
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState("Editor");

  const handleFormSubmit = async () => {
    const token = localStorage.getItem("student:token");
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    const url = isReattempt
      ? `http://localhost:8080/student/studentAssignment/reattempt/${assignmentId}`
      : `http://localhost:8080/student/studentAssignment/submit/${assignmentId}`;

    try {
      const response = await fetch(url, {
        method: isReattempt ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify({
          content: editorContent,
          type: activeTab === "Editor" ? "Text Entry" : "Media Upload",
          comment: commentText,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit assignment, status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        toast.success("Assignment submitted successfully");
        onSubmit(); // Call the parent onSubmit function
      } else {
        toast.error(data.message || "Failed to submit assignment");
      }
    } catch (error) {
      toast.error("Failed to submit assignment: " + error.message);
    }
  };

  return (
    <>
      <div className="flex gap-4 mb-4">
        <TabButton
          isActive={activeTab === "Editor"}
          onClick={() => setActiveTab("Editor")}
        >
          Editor
        </TabButton>
        <TabButton
          isActive={activeTab === "MediaUpload"}
          onClick={() => setActiveTab("MediaUpload")}
        >
          Media Upload
        </TabButton>
      </div>

      {activeTab === "Editor" && (
        <Editor
          assignmentLabel="Assignment Title"
          hideInput={false}
          editorContent={editorContent}
          onEditorChange={setEditorContent}
          onSubmit={handleFormSubmit}
        />
      )}

      {activeTab === "MediaUpload" && <MediaUpload onSubmit={handleFormSubmit} />}

      <div className="mt-4">
        <label htmlFor="commentText" className="block text-sm font-medium text-gray-700">
          Comment Text
        </label>
        <input
          type="text"
          id="commentText"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
      </div>

      <div className="mt-4">
        <button
          onClick={handleFormSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default CreateAssignmentHolder;
