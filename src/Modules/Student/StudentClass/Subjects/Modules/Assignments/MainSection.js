// import React, { useState, useEffect } from "react";
// import SubjectSideBar from "../../Component/SubjectSideBar";
// import AssignmentDetailCard from "./AssignmentComponents/AssignmentDetailCard";
// import AssignmentSection from "./AssignmentComponents/AssignmentSection";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { toast } from "react-hot-toast";
// import { baseUrl } from "../../../../../../config/Common";

// const MainSection = () => {
//   const { selectedClass, selectedSection, selectedSubject, studentId } =
//     useSelector((state) => state.Common);

//   const { cid, sid, aid } = useParams();
//   const [assignmentData, setAssignmentData] = useState(null);
//   const [submissionData, setSubmissionData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const handleFormSubmit = () => {
//     setIsSubmitted(true);
//   };

//   useEffect(() => {
//     console.log("aid",aid)
//     const fetchAssignment = async () => {
//       try {
//         const token = localStorage.getItem("student:token");
//         if (!token) {
//           throw new Error("Authentication token not found");
//         }

//         const response = await fetch(
//           `${baseUrl}/student/studentAssignment/${aid}`,
//           {
//             headers: {
//               Authentication: token,
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `Failed to fetch assignment, status: ${response.status}`
//           );
//         }

//         const data = await response.json();
//         console.log("data in assignment",data)
//         if (data.success && data.data) {
//           setAssignmentData(data.data.assignment);
//           setSubmissionData(data.data.submission || null);
//           setIsSubmitted(!!data.data.submission);
//         } else {
//           console.error("No assignment data or unsuccessful response");
//         }
//       } catch (error) {
//         console.error("Failed to fetch assignment:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignment();
//   }, [cid, sid, aid]);

//   const handleResubmit = async (
//     submissionContent,
//     submissionType,
//     submissionComment
//   ) => {
//     try {
//       const currentAttempts = submissionData ? submissionData.attempt : 0;
//       if (currentAttempts >= assignmentData.allowNumberOfAttempts) {
//         toast.error("Maximum number of attempts reached");
//         return;
//       }

//       const token = localStorage.getItem("student:token");
//       if (!token) {
//         throw new Error("Authentication token not found");
//       }

//       const response = await fetch(
//         `${baseUrl}/student/studentAssignment/reattempt/${aid}`,
//         {
//           method: "PUT",
//           headers: {
//             Authentication: token,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             content: submissionContent,
//             type: submissionType,
//             commentText: submissionComment,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (response.ok) {
//         setSubmissionData(data.submission);
//         setIsSubmitted(true);
//       } else {
//         toast.error(data.message || "Failed to resubmit assignment");
//       }
//     } catch (error) {
//       console.error("Failed to resubmit assignment:", error);
//       toast.error("Error resubmitting assignment");
//     }
//   };

//   if (loading) {
//     return <div>Loading😍😍😍😍😍😍...</div>;
//   }

//   return (
//     <div className="flex">
//       <SubjectSideBar />
//       <div className="w-[65%] border">
//         <AssignmentSection
//           isSubmitted={isSubmitted}
//           onFormSubmit={handleFormSubmit}
//           assignmentData={assignmentData}
//           submissionData={submissionData}
//           assignmentId={aid}
//           onResubmit={handleResubmit}
//         />
//       </div>
//       <div className="w-[30%]">
//         <AssignmentDetailCard
//           isSubmitted={isSubmitted}
//           assignmentData={assignmentData}
//           submissionData={submissionData}
//         />
//       </div>
//     </div>
//   );
// };

// export default MainSection;










//----------------------------------------------- ☝️----

// import React, { useState, useEffect } from "react";
// import SubjectSideBar from "../../Component/SubjectSideBar";
// import AssignmentDetailCard from "./AssignmentComponents/AssignmentDetailCard";
// import AssignmentSection from "./AssignmentComponents/AssignmentSection";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { toast } from "react-hot-toast";
// import { baseUrl } from "../../../../../../config/Common";
// import Spinner from "../../../../../../Components/Common/Spinner";
// // import useGetAssignmentById from "../../../../../../Hooks/AuthHooks/Student/Assignment/useGetAssignmentById";

// const MainSection = () => {
//   const { selectedClass, selectedSection, selectedSubject, studentId } =
//     useSelector((state) => state.Common);

//   const { cid, sid, aid } = useParams();
//   const [assignmentData, setAssignmentData] = useState(null);
//   const [submissionData, setSubmissionData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isSubmitted, setIsSubmitted] = useState(false);


//   const handleFormSubmit = () => {
//     setIsSubmitted(true);
//   };

//   useEffect(() => {
//     const fetchAssignment = async () => {
//       try {
//         const token = localStorage.getItem("student:token");
//         if (!token) {
//           throw new Error("Authentication token not found");
//         }

//         const response = await fetch(
//           `${baseUrl}/student/studentAssignment/${aid}`,
//           {
//             headers: {
//               Authentication: token,
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `Failed to fetch assignment, status: ${response.status}`
//           );
//         }

//         const data = await response.json();
//         console.log("data in assignment",data)
//         if (data.success && data.data) {
//           setAssignmentData(data.data.assignment);
//           setSubmissionData(data.data.submission || null);
//           setIsSubmitted(!!data.data.submission);
//         } else {
//           console.error("No assignment data or unsuccessful response");
//         }
//       } catch (error) {
//         console.error("Failed to fetch assignment:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignment();
//   }, [cid, sid, aid]);

//   const handleResubmit = async (
//     submissionContent,
//     submissionType,
//     submissionComment
//   ) => {
//     try {
//       const currentAttempts = submissionData ? submissionData.attempt : 0;
//       if (currentAttempts >= assignmentData.allowNumberOfAttempts) {
//         toast.error("Maximum number of attempts reached");
//         return;
//       }

//       const token = localStorage.getItem("student:token");
//       if (!token) {
//         throw new Error("Authentication token not found");
//       }

//       const response = await fetch(
//         `${baseUrl}/student/studentAssignment/reattempt/${aid}`,
//         {
//           method: "PUT",
//           headers: {
//             Authentication: token,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             content: submissionContent,
//             type: submissionType,
//             commentText: submissionComment,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (response.ok) {
//         setSubmissionData(data.submission);
//         setIsSubmitted(true);
//       } else {
//         toast.error(data.message || "Failed to resubmit assignment");
//       }
//     } catch (error) {
//       console.error("Failed to resubmit assignment:", error);
//       toast.error("Error resubmitting assignment");
//     }
//   };

//   if (loading) {
//     return (
//       <Spinner/>
//     )
//   }

//   return (
//     <div className="flex">
//       <SubjectSideBar />
//       <div className="w-[65%] border">
//         <AssignmentSection
//           isSubmitted={isSubmitted}
//           onFormSubmit={handleFormSubmit}
//           assignmentData={assignmentData}
//           submissionData={submissionData}
//           assignmentId={aid}
//           onResubmit={handleResubmit}
//         />
//       </div>
//       <div className="w-[30%]">
//         <AssignmentDetailCard
//           isSubmitted={isSubmitted}
//           assignmentData={assignmentData}
//           submissionData={submissionData}
//         />
//       </div>
//     </div>
//   );
// };

// export default MainSection;










//----------------------------------------------- ☝️----


import React, { useState, useEffect } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import AssignmentDetailCard from "./AssignmentComponents/AssignmentDetailCard";
import AssignmentSection from "./AssignmentComponents/AssignmentSection";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../../../../../config/Common";
import Spinner from "../../../../../../Components/Common/Spinner";

const MainSection = () => {
  const { selectedClass, selectedSection, selectedSubject, studentId } =
    useSelector((state) => state.Common);

  const { cid, sid, aid } = useParams();
  const [assignmentData, setAssignmentData] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormSubmit = () => {
    // Avoid directly setting `isSubmitted` to true until confirmed by the backend
    // We will only set it after we are sure the submission succeeded
  };

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const token = localStorage.getItem("student:token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `${baseUrl}/student/studentAssignment/${aid}`,
          {
            headers: {
              Authentication: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch assignment, status: ${response.status}`
          );
        }

        const data = await response.json();
        if (data.success && data.data) {
          setAssignmentData(data.data.assignment);
          setSubmissionData(data.data.submission || null);
          setIsSubmitted(!!data.data.submission); // This determines if the assignment was already submitted
        } else {
          console.error("No assignment data or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch assignment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [cid, sid, aid]);

  const handleResubmit = async (
    submissionContent,
    submissionType,
    submissionComment
  ) => {
    try {
      const currentAttempts = submissionData ? submissionData.attempt : 0;
      if (currentAttempts >= assignmentData.allowNumberOfAttempts) {
        toast.error("Maximum number of attempts reached");
        return;
      }

      const token = localStorage.getItem("student:token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${baseUrl}/student/studentAssignment/reattempt/${aid}`,
        {
          method: "PUT",
          headers: {
            Authentication: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: submissionContent,
            type: submissionType,
            commentText: submissionComment,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSubmissionData(data.submission);
        setIsSubmitted(true); // Now we confirm the assignment has been resubmitted
        toast.success("Assignment resubmitted successfully");
      } else {
        toast.error(data.message || "Failed to resubmit assignment");
      }
    } catch (error) {
      console.error("Failed to resubmit assignment:", error);
      toast.error("Error resubmitting assignment");
    }
  };

  if (loading) {
    
    return <Spinner />;
  }

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border">
        <AssignmentSection
          isSubmitted={isSubmitted}
          onFormSubmit={handleFormSubmit} // Ensure no direct state mutation here
          assignmentData={assignmentData}
          submissionData={submissionData}
          assignmentId={aid}
          onResubmit={handleResubmit}
        />
      </div>
      <div className="w-[30%]">
        <AssignmentDetailCard
          isSubmitted={isSubmitted}
          assignmentData={assignmentData}
          submissionData={submissionData}
        />
      </div>
    </div>
  );
};

export default MainSection;
