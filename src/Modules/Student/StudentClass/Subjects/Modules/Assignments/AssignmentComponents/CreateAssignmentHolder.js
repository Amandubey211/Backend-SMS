

// ---------------------------


// import React, { useState } from "react";
// import Editor from "../../../Component/Editor";
// import MediaUpload from "./MediaUpload";
// import TabButton from "./TabButton";
// import { toast } from 'react-hot-toast';

// const CreateAssignmentHolder = ({ onSubmit, assignmentId, isReattempt = false }) => {
//   const [editorContent, setEditorContent] = useState("");
//   const [commentText, setCommentText] = useState("");
//   const [activeTab, setActiveTab] = useState("Editor");

//   const handleFormSubmit = async () => {
//     const token = localStorage.getItem("student:token");
//     if (!token) {
//       toast.error("Authentication token not found");
//       return;
//     }

//     const url = isReattempt
//       ? `${baseUrl}/student/studentAssignment/reattempt/${assignmentId}`
//       : `${baseUrl}/student/studentAssignment/submit/${assignmentId}`;

//     try {
//       const response = await fetch(url, {
//         method: isReattempt ? "PUT" : "POST",
//         headers: {
//           "Content-Type": "application/json",
//           // 'Authorization': token,

//           'Authentication': token
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
//         toast.success("Assignment submitted successfully");
//         onSubmit(); // Call the parent onSubmit function
//       } else {
//         toast.error(data.message || "Failed to submit assignment");
//       }
//     } catch (error) {
//       toast.error("Failed to submit assignment: " + error.message);
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
// {/* 
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

//       <div className="mt-4">
//         <button
//           onClick={handleFormSubmit}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//         >
//           Submit
//         </button>
//       </div> */}
//     </>
//   );
// };

// export default CreateAssignmentHolder;


//-----------------
// import React, { useState } from "react";
// import Editor from "../../../Component/Editor";
// import MediaUpload from "./MediaUpload";
// import TabButton from "./TabButton";
// import { toast } from 'react-hot-toast';

// const CreateAssignmentHolder = ({ onSubmit, assignmentId, isReattempt = false }) => {
//   const [editorContent, setEditorContent] = useState("");
//   const [commentText, setCommentText] = useState("");
//   const [activeTab, setActiveTab] = useState("Editor");

//   // const handleFormSubmit = async () => {
//   //   const token = localStorage.getItem("student:token");
//   //   if (!token) {
//   //     toast.error("Authentication token not found");
//   //     return;
//   //   }

//   //   const url = isReattempt
//   //     ? `${baseUrl}/student/studentAssignment/reattempt/${assignmentId}`
//   //     : `${baseUrl}/student/studentAssignment/submit/${assignmentId}`;

//   //   try {
//   //     const response = await fetch(url, {
//   //       method: isReattempt ? "PUT" : "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //         'Authentication': token
//   //       },
//   //       body: JSON.stringify({
//   //         content: editorContent,
//   //         type: activeTab === "Editor" ? "Text Entry" : "Media Upload",
//   //         comment: commentText,
//   //       }),
//   //     });

//   //     if (!response.ok) {
//   //       throw new Error(`Failed to submit assignment, status: ${response.status}`);
//   //     }

//   //     const data = await response.json();
//   //     if (data.success) {
//   //       toast.success("Assignment submitted successfully");
//   //       onSubmit(); // Call the parent onSubmit function
//   //     } else {
//   //       toast.error(data.message || "Failed to submit assignment");
//   //     }
//   //   } catch (error) {
//   //     toast.error("Failed to submit assignment: " + error.message);
//   //   }
//   // };

//   const handleFormSubmit = async () => {
//     const token = localStorage.getItem("student:token");
//     if (!token) {
//       toast.error("Authentication token not found");
//       return;
//     }

//     const url = isReattempt
//       ? `${baseUrl}/student/studentAssignment/reattempt/${assignmentId}`
//       : `${baseUrl}/student/studentAssignment/submit/${assignmentId}`;

//     try {
//       let contentToSend = null; // Variable to store content for logging

//       if (activeTab === "Editor") {
//         contentToSend = editorContent;
//       } else if (activeTab === "MediaUpload") {
//         // contentToSend = "Media Upload";
//         contentToSend = "Media Upload";
//         // contentToSend = fileUrl; 

//       }

//       const response = await fetch(url, {
//         method: isReattempt ? "PUT" : "POST",
//         headers: {
//           "Content-Type": "application/json",
//           'Authentication': token
//         },
//         body: JSON.stringify({
//           content: contentToSend,
//           type: activeTab === "Editor" ? "Text Entry" : "Media Upload",
//           comment: commentText,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to submit assignment, status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (data.success) {
//         toast.success("Assignment submitted successfully");
//         onSubmit(); // Call the parent onSubmit function
//       } else {
//         toast.error(data.message || "Failed to submit assignment");
//       }
//     } catch (error) {
//       toast.error("Failed to submit assignment: " + error.message);
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
//           onSubmit={handleFormSubmit} // Pass handleFormSubmit to Editor
//         />
//       )}

//       {activeTab === "MediaUpload" && (
//         <MediaUpload
//           onSubmit={(fileUrl, comment) => {
//             console.log("file url here" ,fileUrl)
//             // Handle media upload completion here
//             setCommentText(comment); // Set comment text from MediaUpload
//             handleFormSubmit(); // Submit form after media upload
//             // handleFormSubmit(fileUrl);
//           }}
//         />
//       )}

//       {/* Comment input if needed */}
//       {/* <div className="mt-4">
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
//       </div> */}

//       {/* Submit button if needed */}
//       {/* <div className="mt-4">
//         <button
//           onClick={handleFormSubmit}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//         >
//           Submit
//         </button>
//       </div> */}
//     </>
//   );
// };

// export default CreateAssignmentHolder;


//---------------uuu

// import React, { useState } from "react";
// import Editor from "../../../Component/Editor";
// import MediaUpload from "./MediaUpload";
// import TabButton from "./TabButton";
// import { toast } from 'react-hot-toast';
// import { baseUrl } from "../../../../../../../config/Common";

// const CreateAssignmentHolder = ({ onSubmit, assignmentId, isReattempt = false }) => {
//   const [editorContent, setEditorContent] = useState("");
//   const [commentText, setCommentText] = useState("");
//   const [activeTab, setActiveTab] = useState("Editor");

//   const handleFormSubmit = async (fileUrl) => {
//     const token = localStorage.getItem("student:token");
//     if (!token) {
//       toast.error("Authentication token not found");
//       return;
//     }

//     const url = isReattempt
//       ? `${baseUrl}/student/studentAssignment/reattempt/${assignmentId}`
//       : `${baseUrl}/student/studentAssignment/submit/${assignmentId}`;

//     try {
//       let contentToSend = null; // Variable to store content for logging

//       if (activeTab === "Editor") {
//         contentToSend = editorContent;
//       } else if (activeTab === "MediaUpload") {
//         contentToSend = fileUrl; // Use the Cloudinary fileUrl received from MediaUpload
//       }

//       const response = await fetch(url, {
//         method: isReattempt ? "PUT" : "POST",
//         headers: {
          // "Content-Type": "application/json",
          // "Authentication": token,
//         },
//         body: JSON.stringify({
//           content: contentToSend,
//           type: activeTab === "Editor" ? "Text Entry" : "Media Upload",
//           comment: commentText,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to submit assignment, status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (data.success) {
//         toast.success("Assignment submitted successfully");
//         onSubmit(); // Call the parent onSubmit function
//       } else {
//         toast.error(data.message || "Failed to submit assignment");
//       }
//     } catch (error) {
//       toast.error("Failed to submit assignment: " + error.message);
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
//           onSubmit={handleFormSubmit} // Pass handleFormSubmit to Editor
//         />
//       )}

//       {activeTab === "MediaUpload" && (
//         <MediaUpload
//           onSubmit={(fileUrl, comment) => {
//             console.log("file url here", fileUrl);
//             setCommentText(comment); // Set comment text from MediaUpload
//             handleFormSubmit(fileUrl); // Submit form after media upload with fileUrl
//           }}
//         />
//       )}
//     </>
//   );
// };

// export default CreateAssignmentHolder;



//-------------

// import React, { useState } from "react";
// import Editor from "../../../Component/Editor";
// import MediaUpload from "./MediaUpload";
// import TabButton from "./TabButton";
// import { toast } from 'react-hot-toast';
// import { baseUrl } from "../../../../../../../config/Common";

// const CreateAssignmentHolder = ({ onSubmit, assignmentId, isReattempt = false }) => {
//   const [editorContent, setEditorContent] = useState("");
//   const [commentText, setCommentText] = useState("gdgdgdgd");
//   const [activeTab, setActiveTab] = useState("Editor");

//   const handleFormSubmit = async (fileUrl) => {
//     const token = localStorage.getItem("student:token");
//     if (!token) {
//       toast.error("Authentication token not found");
//       return;
//     }

//     const url = isReattempt
//       ? `${baseUrl}/student/studentAssignment/reattempt/${assignmentId}`
//       : `${baseUrl}/student/studentAssignment/submit/${assignmentId}`;

//     try {
//       let contentToSend = null; // Variable to store content for logging

//       if (activeTab === "Editor") {
//         contentToSend = editorContent;
//       } else if (activeTab === "MediaUpload") {
//         contentToSend = fileUrl; // Use the Cloudinary fileUrl received from MediaUpload
//       }

//       console.log("Submitting to URL:", url);
//       console.log("Request payload:", {
//         content: contentToSend,
//         type: activeTab === "Editor" ? "Text Entry" : "Media Upload",
//         comment: commentText,
//       });

//       const response = await fetch(url, {
//         method: isReattempt ? "PUT" : "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authentication": token,
//         },
//         body: JSON.stringify({
//           content: contentToSend,
//           type: activeTab === "Editor" ? "Text Entry" : "Media Upload",
//           comment: commentText,
//         }),
//       });

//       console.log("Response status:", response.status);
//       console.log("Response headers:", [...response.headers.entries()]);
//       const data = await response.json();
//       console.log("Response data:", data);

//       if (!response.ok) {
//         throw new Error(`Failed to submit assignment, status: ${response.status}`);
//       }

//       if (data.success) {
//         toast.success("Assignment submitted successfully");
//         onSubmit(); // Call the parent onSubmit function
//       } else {
//         // Display validation errors
//         if (data.errors) {
//           for (const error in data.errors) {
//             toast.error(data.errors[error].message);
//           }
//         } else {
//           toast.error(data.message || "Failed to submit assignment");
//         }
//       }
//     } catch (error) {
//       console.error("Error submitting assignment:", error);
//       toast.error("Failed to submit assignment: " + error.message);
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
//           onSubmit={handleFormSubmit} // Pass handleFormSubmit to Editor
//         />
//       )}

//       {activeTab === "MediaUpload" && (
//         <MediaUpload
//           onSubmit={(fileUrl, comment) => {
//             console.log("file url here", fileUrl);
//             setCommentText(comment); // Set comment text from MediaUpload
//             handleFormSubmit(fileUrl); // Submit form after media upload with fileUrl
//           }}
//         />
//       )}
//     </>
//   );
// };

// export default CreateAssignmentHolder;



//----------👆-------------


import React, { useState } from "react";
import Editor from "../../../Component/Editor";
import MediaUpload from "./MediaUpload";
import TabButton from "./TabButton";
import { toast } from 'react-hot-toast';
import { baseUrl } from "../../../../../../../config/Common";

const CreateAssignmentHolder = ({ onSubmit, assignmentId, isReattempt = false }) => {
  const [editorContent, setEditorContent] = useState("");
  const [commentText, setCommentText] = useState(""); // Initialize with an empty string
  const [activeTab, setActiveTab] = useState("Editor");

  const handleFormSubmit = async (fileUrl) => {
    const token = localStorage.getItem("student:token");
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    const url = isReattempt
      ? `${baseUrl}/student/studentAssignment/reattempt/${assignmentId}`
      : `${baseUrl}/student/studentAssignment/submit/${assignmentId}`;

    // Set commentText to "No comments" if it's empty
    const commentToSend = commentText.trim() === "" ? "No comments" : commentText;

    try {
      let contentToSend = null;

      if (activeTab === "Editor") {
        contentToSend = editorContent;
      } else if (activeTab === "MediaUpload") {
        contentToSend = fileUrl;
      }

      console.log("Submitting to URL:", url);
      console.log("Request payload:", {
        content: contentToSend,
        type: activeTab === "Editor" ? "Text Entry" : "Media Upload",
        comment: commentToSend,
      });

      const response = await fetch(url, {
        method: isReattempt ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication": token,
        },
        body: JSON.stringify({
          content: contentToSend,
          type: activeTab === "Editor" ? "Text Entry" : "Media Upload",
          comment: commentToSend,
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(`Failed to submit assignment, status: ${response.status}`);
      }

      if (data.success) {
        toast.success("Assignment submitted successfully");
        onSubmit(); // Call the parent onSubmit function
      } else {
        if (data.errors) {
          for (const error in data.errors) {
            toast.error(data.errors[error].message);
          }
        } else {
          toast.error(data.message || "Failed to submit assignment");
        }
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
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
          onSubmit={handleFormSubmit} // Pass handleFormSubmit to Editor
        />
      )}

      {activeTab === "MediaUpload" && (
        <MediaUpload
          onSubmit={(fileUrl, comment) => {
            console.log("file url here", fileUrl);
            // Ensure commentText is updated properly
            setCommentText(comment.trim()); // Trim to avoid spaces being counted as a comment
            handleFormSubmit(fileUrl); // Submit form after media upload with fileUrl
          }}
        />
      )}
    </>
  );
};

export default CreateAssignmentHolder;
