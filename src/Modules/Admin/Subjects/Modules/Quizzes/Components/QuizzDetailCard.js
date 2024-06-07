import React from 'react';
import DateDetail from '../../../Component/DateDetail';
import AssignmentDetail from '../../../Component/AssignmentDetail';
import ButtonsGroup from '../../../Component/ButtonsGroup';
import SpeedGradeButton from '../../../Component/SpeedGradeButton';

const QuizzDetailCard = () => {
  const quizDetails = [
    { label: "Quiz Point", value: "100 Point", type: "assignment" },
    { label: "Quiz Type", value: "Graded Quiz", type: "assignment" },
    { label: "Quiz Score", value: "0 out of 10", type: "assignment" },
    { label: "Multiple Attempts", value: "No", type: "assignment" },
    { label: "Submitting date", value: "20-5-2024", type: "assignment" },
    { label: "One Question at a time", value: "No", type: "assignment" },
    { label: "Time Limit", value: "No Time Limit", type: "assignment" },
    { label: "This Assignment For", value: "Everyone", type: "assignment" },
    { label: "Due Date", value: "02/10/2024", type: "date" },
    { label: "Available From", value: "02/10/2024", type: "date" },
    { label: "Until", value: "02/10/2024", type: "date" }
  ];

  return (
    <div className="max-w-sm p-4 bg-white" aria-label="Quiz Card">
      <ButtonsGroup />
      <SpeedGradeButton />
      {quizDetails.map((detail, index) => {
        if (detail.type === "assignment") {
          return <AssignmentDetail key={index} label={detail.label} value={detail.value} />;
        } else if (detail.type === "date") {
          return <DateDetail key={index} label={detail.label} value={detail.value} />;
        }
        return null;
      })}
    </div>
  );
}

export default QuizzDetailCard;
