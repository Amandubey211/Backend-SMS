import React from 'react';
import DateDetail from '../../../Component/DateDetail';
import AssignmentDetail from '../../../Component/AssignmentDetail';
import ButtonsGroup from '../../../Component/ButtonsGroup';
import SpeedGradeButton from '../../../Component/SpeedGradeButton';
import { useParams } from 'react-router-dom';

const QuizzDetailCard = ({quiz}) => {

  const {qid} = useParams()
  console.log("quiz in quiz detail card",quiz)//will be using this to fetch the data
  const { name, quizType, availableFrom,totalPoints,allowNumberOfAttempts,timeLimit } = quiz; // dependent

  
  const quizDetails = [
    { label: "Quiz Name", value: quiz.name, type: "quizz" },
    { label: "Quiz Type", value: quiz.quizType, type: "quizz" },
    { label: "Available From", value: quiz.availableFrom, type: "date" },
    { label: "Total Points", value: quiz.totalPoints, type: "quizz" },
    { label: "Allow Attempts", value: quiz.allowNumberOfAttempts, type: "quizz" },
    { label: "Time Limit", value: quiz.timeLimit, type: "quizz" },
    // Add more quiz properties as needed
  ];
  return (
    <div className="p-3 bg-white" aria-label="Quiz Card">
      
      {quizDetails.map((detail, index) => {
        if (detail.type === "quizz") {
          return <AssignmentDetail key={index} label={detail.label} extra={detail.extra} value={detail.value} />;
        } else if (detail.type === "date") {
          return <DateDetail key={index} label={detail.label} value={detail.value} />;
        }
     })}
    </div>
    
  );
}

export default QuizzDetailCard;


