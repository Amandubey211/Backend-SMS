// import React,{useState} from "react";
// import { FaPlayCircle } from "react-icons/fa";
// import { assignmentDetails } from "./MockData";
// import Sidebar from "../../../../../../../Components/Common/Sidebar";
// import SidebarSlide from "../../../../../../../Components/Common/SidebarSlide";
// import CreateAssignmentHolder from './CreateAssignmentHolder';

// const AssignmentSection = ({ isSubmitted,onFormSubmit }) => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false); // Manage sidebar state
//   // const [isSubmitted, setIsSubmitted] = useState(false); 
//   const handleAssignment=()=>{
//   setSidebarOpen(true)
// }
// const handleFormSubmit = () => {
//   // setIsSubmitted(true);
//   onFormSubmit();
//   setSidebarOpen(false); // Close the sidebar when the form is submitted
// };
//   const { title, type, description, imageUrl, videoThumbnailUrl } =
//     assignmentDetails;
   
//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white ">
//       <h2 className="text-2xl font-semibold mb-2">{title}</h2>
//       <p className="text-sm text-green-600 mb-4">{type}</p>
//       <button
//         onClick={handleAssignment}
//         className=" mb-2 h-12 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
//       >
//         {isSubmitted ? "Re-submit Assignment" : "Start Assignment"}
//       </button>
//       <img
//         src={imageUrl}
//         alt="Assignment"
//         className="w-full  rounded-lg mb-4"
//       />
//       <p className="text-gray-700 mb-6">{description}</p>
//       <div className="relative">
//         <img
//           src={videoThumbnailUrl}
//           alt="Video Thumbnail"
//           className="w-full rounded-lg"
//         />
//         <FaPlayCircle className="absolute text-white text-6xl inset-0 m-auto" />
//       </div>
    
//       <SidebarSlide
//         isOpen={isSidebarOpen}
//         onClose={() => setSidebarOpen(false)} // Pass down function to close sidebar
//         title="Start Assignment"
//          width="60%"
//       >
//         <CreateAssignmentHolder onSubmit={handleFormSubmit} />

//       </SidebarSlide>
//     </div>
//   );
// };

// export default AssignmentSection;


//-=-----------------------------------------------------------------


// import React, { useState } from "react";
// import { FaPlayCircle } from "react-icons/fa";
// import SidebarSlide from "../../../../../../../Components/Common/SidebarSlide";
// import CreateAssignmentHolder from "./CreateAssignmentHolder";

// const AssignmentSection = ({ isSubmitted, onFormSubmit, assignmentData }) => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);

//   const handleAssignment = () => {
//     setSidebarOpen(true);
//   };

//   const handleFormSubmit = () => {
//     onFormSubmit();
//     setSidebarOpen(false); // Close the sidebar when the form is submitted
//   };

//   const { name, type, content, thumbnail } = assignmentData.assignment;

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white">
//       <h2 className="text-2xl font-semibold mb-2">{name}</h2>
//       <p className="text-sm text-green-600 mb-4">{type}</p>
//       <button
//         onClick={handleAssignment}
//         className="mb-2 h-12 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
//       >
//         {isSubmitted ? "Re-submit Assignment" : "Start Assignment"}
//       </button>
//       <img src={thumbnail} alt="Assignment" className="w-full rounded-lg mb-4" />
//       <p className="text-gray-700 mb-6">{content}</p>
//       <SidebarSlide
//         isOpen={isSidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         title="Start Assignment"
//         width="60%"
//       >
//         <CreateAssignmentHolder onSubmit={handleFormSubmit} />
//       </SidebarSlide>
//     </div>
//   );
// };

// export default AssignmentSection;





//-=-----------------------------------------------------------------


// import React, { useState } from "react";
// import SidebarSlide from "../../../../../../../Components/Common/SidebarSlide";
// import CreateAssignmentHolder from "./CreateAssignmentHolder";
// import { toast } from "react-hot-toast";

// const AssignmentSection = ({ isSubmitted, onFormSubmit, assignmentData, submissionData,assignmentId,onResubmit  }) => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
  
//   const handleAssignment = () => {
//     const currentAttempts = submissionData ? submissionData.attempt : 0;
//     if (currentAttempts >= assignmentData.allowNumberOfAttempts) {
//       toast.error("Maximum number of attempts reached");
//       return; // Return early to prevent opening the sidebar
//     }
//     setSidebarOpen(true);
//   };

//   const handleFormSubmit = () => {
//     onFormSubmit();
//     setSidebarOpen(false); // Close the sidebar when the form is submitted
//   };

//   const { name, type, content, thumbnail } = assignmentData;

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white">
//       <h2 className="text-2xl font-semibold mb-2">{name}</h2>
//       <p className="text-sm text-green-600 mb-4">{type}</p>
//       <button
//         onClick={handleAssignment}
//         className="mb-2 h-12 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
//       >
//         {isSubmitted ? "Re-submit Assignment" : "Start Assignment"}
//       </button>
//       <img src={thumbnail} alt="Assignment" className="w-full rounded-lg mb-4" />
//       <p className="text-gray-700 mb-6">{content}</p>
//       <SidebarSlide
//         isOpen={isSidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         title="Start Assignment"
//         width="60%"
//       >
//         <CreateAssignmentHolder onSubmit={handleFormSubmit} assignmentId={assignmentId} />
//       </SidebarSlide>
//     </div>
//   );
// };

// export default AssignmentSection;


//----------------------

// import React, { useState } from "react";
// import SidebarSlide from "../../../../../../../Components/Common/SidebarSlide";
// import CreateAssignmentHolder from "./CreateAssignmentHolder";
// import { toast } from "react-hot-toast";

// const AssignmentSection = ({ isSubmitted, onFormSubmit, assignmentData, submissionData, assignmentId }) => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);

//   const handleAssignment = () => {
//     const currentAttempts = submissionData ? submissionData.attempt : 0;
//     if (currentAttempts >= assignmentData.allowNumberOfAttempts) {
//       toast.error("Maximum number of attempts reached");
//       return; // Return early to prevent opening the sidebar
//     }
//     setSidebarOpen(true);
//   };

//   const handleFormSubmit = () => {
//     onFormSubmit();
//     setSidebarOpen(false); // Close the sidebar when the form is submitted
//   };

//   const { name, type, content, thumbnail } = assignmentData;

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white">
//       <h2 className="text-2xl font-semibold mb-2">{name}</h2>
//       <p className="text-sm text-green-600 mb-4">{type}</p>
//       <button
//         onClick={handleAssignment}
//         className="mb-2 h-12 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
//       >
//         {isSubmitted ? "Re-submit Assignment" : "Start Assignment"}
//       </button>
//       <img src={thumbnail} alt="Assignment" className="w-full rounded-lg mb-4" />
//       <p className="text-gray-700 mb-6">{content}</p>
//       <SidebarSlide
//         isOpen={isSidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         title="Start Assignment"
//         width="60%"
//       >
//         <CreateAssignmentHolder onSubmit={handleFormSubmit} assignmentId={assignmentId} />
//       </SidebarSlide>
//     </div>
//   );
// };

// export default AssignmentSection;



//--------------------------


import React, { useState } from "react";
import SidebarSlide from "../../../../../../../Components/Common/SidebarSlide";
import CreateAssignmentHolder from "./CreateAssignmentHolder";
import { toast } from "react-hot-toast";

const AssignmentSection = ({ isSubmitted, onFormSubmit, assignmentData, submissionData, assignmentId ,onResubmit }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [attemptsExceeded, setAttemptsExceeded] = useState(false);

  // const handleAssignment = () => {
  //   const currentAttempts = submissionData ? submissionData.attempt : 0;
  //   if (currentAttempts >= assignmentData.allowNumberOfAttempts) {
  //     toast.error("Maximum number of attempts reached");
  //     return; // Return early to prevent opening the sidebar
  //   }
  //   setSidebarOpen(true);
  // };

  const handleAssignment = () => {
    console.log("submissionData",submissionData)
    console.log("submissionData attempt",submissionData.attempt)
    const currentAttempts = submissionData ? submissionData.attempt : 0;
    console.log("current attempts",currentAttempts)
    if (currentAttempts >= assignmentData.allowNumberOfAttempts) {
      toast.error("Maximum number of attempts reached");
      setAttemptsExceeded(true);
      return; // Return early to prevent opening the sidebar
    }
    setAttemptsExceeded(false);
    setSidebarOpen(true);
  };

  // const handleFormSubmit = () => {
  //   onFormSubmit();
  //   setSidebarOpen(false); // Close the sidebar when the form is submitted
  // };

  const handleFormSubmit = async (submissionContent, submissionType, submissionComment) => {
    const currentAttempts = submissionData ? submissionData.attempt : 0;
    if (currentAttempts >= assignmentData.allowNumberOfAttempts) {
      toast.error("Maximum number of attempts reached");
      setSidebarOpen(false);
      return; // Prevent submission if limit is exceeded
    }

    await onResubmit(submissionContent, submissionType, submissionComment);
    onFormSubmit();
    setSidebarOpen(false); // Close the sidebar when the form is submitted
  };

  const { name, type, content, thumbnail } = assignmentData;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-semibold mb-2">{name}</h2>
      <p className="text-sm text-green-600 mb-4">{type}</p>
      <button
        onClick={handleAssignment}
        className="mb-2 h-12 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        disabled={attemptsExceeded} // Disable the button if attempts are exceeded

      >
        {isSubmitted ? "Re-submit Assignment" : "Start Assignment"}
      </button>
      <img src={thumbnail} alt="Assignment" className="w-full rounded-lg mb-4" />
      <p className="text-gray-700 mb-6">{content}</p>
      <SidebarSlide
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title="Start Assignment"
        width="60%"
      >
        <CreateAssignmentHolder onSubmit={handleFormSubmit} assignmentId={assignmentId}  isReattempt={isSubmitted} />
      </SidebarSlide>
    </div>
  );
};

export default AssignmentSection;


