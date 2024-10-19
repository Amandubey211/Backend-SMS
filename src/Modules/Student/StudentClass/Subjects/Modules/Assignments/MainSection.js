import React, { useState, useEffect } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import AssignmentDetailCard from "./AssignmentComponents/AssignmentDetailCard";
import AssignmentSection from "./AssignmentComponents/AssignmentSection";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../../../../Components/Common/Spinner";
import {
  stdGetAssignment,
  stdReattemptAssignment,
} from "../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Assignment/assignment.action";
import { toast } from "react-hot-toast";

const MainSection = () => {
  const dispatch = useDispatch();
  const { assignment, loading, error } = useSelector(
    (store) => store?.student?.studentAssignment
  );
  const { aid } = useParams();
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (aid) {
      dispatch(stdGetAssignment(aid));
    }
  }, [dispatch, aid]);

  const handleResubmit = async (
    submissionContent,
    submissionType,
    submissionComment
  ) => {
    try {
      if (assignment?.assignment?.allowedAttempts) {
        const currentAttempts = assignment?.submission?.attempt || 0;
        if (currentAttempts >= assignment?.assignment?.allowNumberOfAttempts) {
          toast.error("Maximum number of attempts reached");
          return;
        }
      }

      await dispatch(
        stdReattemptAssignment({
          aid,
          submissionContent,
          submissionType,
          submissionComment,
        })
      );
      setIsSubmitted(true);
    } catch (error) {
      toast.error("Error resubmitting assignment");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Failed to load assignment data. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border">
        <AssignmentSection
          isSubmitted={isSubmitted}
          onResubmit={handleResubmit}
        />
      </div>
      <div className="w-[30%]">
        <AssignmentDetailCard isSubmitted={isSubmitted} />
      </div>
    </div>
  );
};

export default MainSection;
