import React, { useState, useEffect } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import AssignmentDetailCard from "./AssignmentComponents/AssignmentDetailCard";
import AssignmentSection from "./AssignmentComponents/AssignmentSection";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../../../../../config/Common";
import Spinner from "../../../../../../Components/Common/Spinner";
import { stdGetAssignment, stdReattemptAssignment } from "../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Assignment/assignment.action";

const MainSection = () => {
  const dispatch = useDispatch();
  const { assignment, loading } = useSelector((store) => store?.student?.studentAssignment);

  const { cid, sid, aid } = useParams();
  const [isSubmitted, setIsSubmitted] = useState(false);

  console.log("MainSection component rendered", aid);

  const handleFormSubmit = () => { };
  // useEffect(() => {
  //   console.log("use effect working...");
  //   dispatch(stdGetAssignment(aid))
  // }, [dispatch, aid]);

  useEffect(() => {
    console.log("use effect working...");
    dispatch(stdGetAssignment(aid))
  }, [dispatch, aid])
  console.log("assignment---", assignment);


  const handleResubmit = async (
    submissionContent,
    submissionType,
    submissionComment
  ) => {
    try {
      if (assignment?.assignment?.allowedAttempts === true) {
        const currentAttempts = assignment?.submission ? assignment?.submission?.attempt : 0;
        if (currentAttempts >= assignment?.assignment?.allowNumberOfAttempts) {
          toast.error("Maximum number of attempts reached");
          return;
        }
      }

      dispatch(stdReattemptAssignment({ aid, submissionContent, submissionType, submissionComment })).then(() => {
        setIsSubmitted(true);
      })

      // const response = await fetch(
      //   `${baseUrl}/student/studentAssignment/reattempt/${aid}`,
      //   {
      //     method: "PUT",
      //     headers: {
      //       Authentication: token,
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       content: submissionContent,
      //       type: submissionType,
      //       commentText: submissionComment,
      //     }),
      //   }
      // );

      //const data = await response.json();
      // if (response.ok) {
      //   setSubmissionData(data.submission);
      //   setIsSubmitted(true); 
      //   toast.success("Assignment resubmitted successfully");
      // } else {
      //   toast.error(data.message || "Failed to resubmit assignment");
      // }
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
      {/* <div className="w-[65%] border">
        <AssignmentSection
          isSubmitted={isSubmitted}
          onFormSubmit={handleFormSubmit} // Ensure no direct state mutation here
          assignmentData={assignment}
          submissionData={assignment?.submission}
          assignmentId={aid}
          onResubmit={handleResubmit}
        />
      </div>  */}
      <div className="w-[30%]">
        <AssignmentDetailCard
          isSubmitted={isSubmitted}
          assignmentData={assignment?.assignment}
          submissionData={assignment?.submission}
        />
      </div>
    </div>
  );
};

export default MainSection;
