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

  // const quizDetails = [
  //   { label: "Due Date", value: "02/10/2024", type: "date" ,},
  //   { label: "Quiz Type", value: "Graded Quiz",type: "quizz" },
  //   { label: "Quiz Point", value: "100 Point", type: "quizz" },
    
  //   { label: "Allow Attempts", value: "05",type: "quizz" },
  //   { label: "Questions", value: "25", type: "quizz" },
    
  //   { label: "Time Limit", value: "1 hour 30 mins", type: "quizz" },
    
  // ];
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
    // <div className="p-3 bg-white" aria-label="Quiz Card">
    //   {/* <ButtonsGroup /> */}
    //   {/* <p className='text-center text-green-500 italic font-semibold pb-3 border-b' >Submitted Students : 50/100 </p> */}
    //   {/* <SpeedGradeButton /> */}
    //   {quizDetails.map((detail, index) => {
    //     if (detail.type === "quizz") {
    //       return <AssignmentDetail key={index} label={detail.label} extra={detail.extra} value={detail.value} />;
    //     } else if (detail.type === "date") {
    //       return <DateDetail key={index} label={detail.label} value={detail.value} />;
    //     }
    //     return null;
    //   })}
    // </div>
  );
}

export default QuizzDetailCard;




//----with redux------
// import React from 'react';
// import AssignmentDetail from '../../../Component/AssignmentDetail';
// import DateDetail from '../../../Component/DateDetail';

// const QuizzDetailCard = ({ quiz }) => {
//   if (!quiz) {
//     return <div>Loading...</div>;
//   }

//   const { name, quizType, availableFrom, totalPoints, allowNumberOfAttempts, timeLimit } = quiz; // destructure quiz object

//   const quizDetails = [
//     { label: "Quiz Name", value: name, type: "quizz" },
//     { label: "Quiz Type", value: quizType, type: "quizz" },
//     { label: "Available From", value: availableFrom, type: "date" },
//     { label: "Total Points", value: totalPoints, type: "quizz" },
//     { label: "Allow Attempts", value: allowNumberOfAttempts, type: "quizz" },
//     { label: "Time Limit", value: timeLimit, type: "quizz" },
//   ];

//   return (
//     <div className="p-3 bg-white" aria-label="Quiz Card">
//       {quizDetails.map((detail, index) => {
//         if (detail.type === "quizz") {
//           return <AssignmentDetail key={index} label={detail.label} extra={detail.extra} value={detail.value} />;
//         } else if (detail.type === "date") {
//           return <DateDetail key={index} label={detail.label} value={detail.value} />;
//         }
//         return null;
//       })}
//     </div>
//   );
// }

// export default QuizzDetailCard;
