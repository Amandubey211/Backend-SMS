import React from 'react';
import DateDetail from '../../../Component/DateDetail';
import AssignmentDetail from '../../../Component/AssignmentDetail';
import ButtonsGroup from '../../../Component/ButtonsGroup';
import SpeedGradeButton from '../../../Component/SpeedGradeButton';
import { useParams } from 'react-router-dom';

const QuizzDetailCard = () => {
  const {qid} = useParams()
  //console.log(qid)//will be using this to fetch the data
  const quizDetails = [
    { label: "Due Date", value: "02/10/2024", type: "date" ,},
    { label: "Quiz Type", value: "Graded Quiz",type: "quizz" },
    { label: "Quiz Point", value: "100 Point", type: "quizz" },
    
    { label: "Allow Attempts", value: "05",type: "quizz" },
    { label: "Questions", value: "25", type: "quizz" },
    
    { label: "Time Limit", value: "1 hour 30 mins", type: "quizz" },
    
  ];

  return (
    <div className="p-3 bg-white" aria-label="Quiz Card">
      {/* <ButtonsGroup /> */}
      {/* <p className='text-center text-green-500 italic font-semibold pb-3 border-b' >Submitted Students : 50/100 </p> */}
      {/* <SpeedGradeButton /> */}
      {quizDetails.map((detail, index) => {
        if (detail.type === "quizz") {
          return <AssignmentDetail key={index} label={detail.label} extra={detail.extra} value={detail.value} />;
        } else if (detail.type === "date") {
          return <DateDetail key={index} label={detail.label} value={detail.value} />;
        }
        return null;
      })}
    </div>
  );
}

export default QuizzDetailCard;
