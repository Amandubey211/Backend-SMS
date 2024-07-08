// import React from 'react';
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
// import AssignmentDetail from '../../../Component/AssignmentDetail';
// import CommentCard from './CommentCard';
// import DateDetail from '../../../Component/DateDetail';

// const QuestionDetailCard = ({quiz, timeLeft, totalTime }) => {
//   const { name, quizType, availableFrom,totalPoints,allowNumberOfAttempts,timeLimit } = quiz; // dependent

//   const commentsData = [
//     {
//       avatar: "https://avatars.githubusercontent.com/u/109097090?v=4", // Replace with actual image URL
//       name: "Mr Teacher",
//       timestamp: "Feb/02 /09:02",
//       comment: "Hi Sir Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
//     },
//     {
//       avatar: "https://avatars.githubusercontent.com/u/109097090?v=4", // Replace with actual image URL
//       name: "Mr Teacher",
//       timestamp: "Feb/02 /09:02",
//       comment: "Hi Sir Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
//     },
//   ];

//   const formatTime = (seconds) => {
//     const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
//     const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
//     const s = String(seconds % 60).padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };

//   const quizQuestionDetails = [
//     // { label: "Allow Attempts", value: "05", type: "quizz" },
//     // { label: "Quiz Point", value: "100 Point", type: "quizz" },
//     // { label: "Questions", value: "25", type: "quizz" },
//     // { label: "Time Limit", value: "1 hour 30 mins", type: "quizz" },
//     // { label: "You can see the correct Answer", value: "02/10/2024", type: "date" },
    
    
//     // { label: "Quiz Name", value: quiz.name, type: "quizz" },
//     { label: "Allow Attempts", value: quiz.allowNumberOfAttempts, type: "quizz" },
//     { label: "Quiz Points", value: quiz.totalPoints, type: "quizz" },
//     { label: "Questions", value: "25", type: "quizz" },
//     // { label: "Time Limit", value: quiz.timeLimit, type: "quizz" },
//     { label: "Time Limit", value: formatTime(timeLeft), type: "quizz" },

//     { label: "Quiz Type", value: quiz.quizType, type: "quizz" },

//     { label: "Available From", value: quiz.availableFrom, type: "date" },
//   ];
//   // const quizDetails = [
//     // { label: "Quiz Name", value: quiz.name, type: "quizz" },
//     // { label: "Quiz Type", value: quiz.quizType, type: "quizz" },
//     // { label: "Available From", value: quiz.availableFrom, type: "date" },
//     // { label: "Total Points", value: quiz.totalPoints, type: "quizz" },
//     // { label: "Allow Attempts", value: quiz.allowNumberOfAttempts, type: "quizz" },
//     // { label: "Time Limit", value: quiz.timeLimit, type: "quizz" },
//   //   // Add more quiz properties as needed
//   // ];
//   // Calculate hours, minutes, and seconds from timeLeft
//   // const timeLimitQuiz = timeLimit * 60;

//   const hours = Math.floor(timeLeft / 3600);
//   const minutes = Math.floor((timeLeft % 3600) / 60);
//   const seconds = timeLeft % 60;

//   const totalHours = Math.floor(timeLeft / 3600);
//   const totalMinutes = 60; // Max minutes value is always 60
//   const totalSeconds = 60; // Max seconds value is always 60

//   const hourPercentage = totalHours ? (hours / totalHours) * 100 : 0;
//   const minutePercentage = (minutes / totalMinutes) * 100;
//   const secondPercentage = (seconds / totalSeconds) * 100;

//   return (
//     <div className="flex flex-col  gap-24 bg-white" aria-label="Question Detail Card">
//       <div className="mb-auto p-3">
//         {quizQuestionDetails.map((detail, index) => {
//           if (detail.type === "quizz") {
//             return <AssignmentDetail key={index} label={detail.label}  value={detail.value} />;
//           } else if (detail.type === "date") {
//             return <DateDetail key={index} label={detail.label} value={detail.value} />;
//           }
//           return null;
//         })}
//         {/* <div className="flex  justify-around mt-4">
//           <div style={{ width: 70, height: 70 }}>
//             <CircularProgressbar
//               value={hourPercentage}
//               text={`${hours} Hours`}
//               styles={buildStyles({
//                 // pathColor: `rgba(62, 152, 199, ${hourPercentage / 100})`,
//                 pathColor: `rgba(25, 246, 138, 0.8)`,  
//                 textColor: '#000',
//                 trailColor: '#d6d6d6',
//                 backgroundColor: '#3e98c7',
//               })}
//             />
//           </div>
//           <div style={{ width: 70, height: 70 }}>
//             <CircularProgressbar
//               value={minutePercentage}
//               text={`${minutes} Min`}
//               styles={buildStyles({
//                 // pathColor: `rgba(62, 152, 199, ${minutePercentage / 100})`,
//                 pathColor: `rgba(25, 246, 138, 0.8)`,
//                 textColor: '#000',
//                 trailColor: '#d6d6d6',
//                 backgroundColor: '#3e98c7',
//               })}
//             />
//           </div>
//           <div style={{ width: 70, height: 70 }}>
//             <CircularProgressbar
//               value={secondPercentage}
//               text={`${seconds} Sec`}
//               styles={buildStyles({
//                 // pathColor: `rgba(62, 152, 199, ${secondPercentage / 100})`,
//                 pathColor: `rgba(25, 246, 138, 0.8)`,
//                 textColor: '#000',
//                 trailColor: '#d6d6d6',
//                 backgroundColor: '#3e98c7',
//               })}
//             />
//           </div>
//         </div> */}

// <div className="flex  justify-around mt-4">
//           <div style={{ width: 70, height: 70 }}>
//             <CircularProgressbar
//               value={hourPercentage}
//               text={`${hours} Hours`}
//               styles={{
//                 path: {
//                   stroke: `rgba(25, 246, 138, 0.8)`,
//                 },
//                 text: {
//                   fill: '#000',
//                 },
//                 trail: {
//                   stroke: '#d6d6d6',
//                 },
//                 background: {
//                   fill: '#3e98c7',
//                 },
//               }}
//             />
//           </div>
//           <div style={{ width: 70, height: 70 }}>
//             <CircularProgressbar
//               value={minutePercentage}
//               text={`${minutes} Min`}
//               styles={{
//                 path: {
//                   stroke: `rgba(25, 246, 138, 0.8)`,
//                 },
//                 text: {
//                   fill: '#000',
//                 },
//                 trail: {
//                   stroke: '#d6d6d6',
//                 },
//                 background: {
//                   fill: '#3e98c7',
//                 },
//               }}
//             />
//           </div>
//           <div style={{ width: 70, height: 70 }}>
//             <CircularProgressbar
//               value={secondPercentage}
//               text={`${seconds} Sec`}
//               styles={{
//                 path: {
//                   stroke: `rgba(25, 246, 138, 0.8)`,
//                 },
//                 text: {
//                   fill: '#000',
//                 },
//                 trail: {
//                   stroke: '#d6d6d6',
//                 },
//                 background: {
//                   fill: '#3e98c7',
//                 },
//               }}
//             />
//           </div>
//         </div>

//       </div>
//       <div className="mb-4 h-52 overflow-y-scroll">
//         {commentsData.map((comment, index) => (
//           <CommentCard
//             key={index}
//             avatar={comment.avatar}
//             name={comment.name}
//             timestamp={comment.timestamp}
//             comment={comment.comment}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default QuestionDetailCard;



//--------------

import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import AssignmentDetail from '../../../Component/AssignmentDetail';
import CommentCard from './CommentCard';
import DateDetail from '../../../Component/DateDetail';

const QuestionDetailCard = ({ quiz,timeLeft ,totalTime}) => {
  const { name, quizType, availableFrom, totalPoints, allowNumberOfAttempts, timeLimit } = quiz; // destructure quiz object
  const commentsData = [
    {
      avatar: "https://avatars.githubusercontent.com/u/109097090?v=4", // Replace with actual image URL
      name: "Mr Teacher",
      timestamp: "Feb/02 /09:02",
      comment: "Hi Sir Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/109097090?v=4", // Replace with actual image URL
      name: "Mr Teacher",
      timestamp: "Feb/02 /09:02",
      comment: "Hi Sir Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
    },
  ];

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const quizQuestionDetails = [
    { label: "Allow Attempts", value: allowNumberOfAttempts, type: "quizz" },
    { label: "Quiz Point", value: `${totalPoints} Point`, type: "quizz" },
    { label: "Questions", value: "25", type: "quizz" },
    { label: "Time Limit", value: formatTime(timeLimit), type: "quizz" },
    { label: "You can see the correct Answer", value: "02/10/2024", type: "date" },
  ];

  // Convert timeLimit to seconds if it's not already
  const timeLimitInSeconds = timeLimit * 60;

  // Calculate hours, minutes, and seconds from timeLimitInSeconds
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const totalHours = Math.floor(timeLeft / 3600);
  const totalMinutes = 60; // Max minutes value is always 60
  const totalSeconds = 60; // Max seconds value is always 60

  const hourPercentage = totalHours ? (hours / totalHours) * 100 : 0;
  const minutePercentage = (minutes / totalMinutes) * 100;
  const secondPercentage = (seconds / totalSeconds) * 100;

  return (
    <div className="flex flex-col gap-24 bg-white" aria-label="Question Detail Card">
      <div className="mb-auto p-3">
        {quizQuestionDetails.map((detail, index) => {
          if (detail.type === "quizz") {
            return <AssignmentDetail key={index} label={detail.label} extra={detail.extra} value={detail.value} />;
          } else if (detail.type === "date") {
            return <DateDetail key={index} label={detail.label} value={detail.value} />;
          }
          return null;
        })}
        <div className="flex justify-around mt-4">
          <div style={{ width: 70, height: 70 }}>
            <CircularProgressbar
              value={hourPercentage}
              text={`${hours} Hours`}
              styles={{
                path: {
                  stroke: `rgba(25, 246, 138, 0.8)`,
                },
                text: {
                  fill: '#000',
                },
                trail: {
                  stroke: '#d6d6d6',
                },
                background: {
                  fill: '#3e98c7',
                },
              }}
            />
          </div>
          <div style={{ width: 70, height: 70 }}>
            <CircularProgressbar
              value={minutePercentage}
              text={`${minutes} Min`}
              styles={{
                path: {
                  stroke: `rgba(25, 246, 138, 0.8)`,
                },
                text: {
                  fill: '#000',
                },
                trail: {
                  stroke: '#d6d6d6',
                },
                background: {
                  fill: '#3e98c7',
                },
              }}
            />
          </div>
          <div style={{ width: 70, height: 70 }}>
            <CircularProgressbar
              value={secondPercentage}
              text={`${seconds} Sec`}
              styles={{
                path: {
                  stroke: `rgba(25, 246, 138, 0.8)`,
                },
                text: {
                  fill: '#000',
                },
                trail: {
                  stroke: '#d6d6d6',
                },
                background: {
                  fill: '#3e98c7',
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="mb-4 h-52 overflow-y-scroll">
        {commentsData.map((comment, index) => (
          <CommentCard
            key={index}
            avatar={comment.avatar}
            name={comment.name}
            timestamp={comment.timestamp}
            comment={comment.comment}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionDetailCard;


//---- with redux------------


// import React from 'react';
// import { CircularProgressbar } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
// import AssignmentDetail from '../../../Component/AssignmentDetail';
// import CommentCard from './CommentCard';
// import DateDetail from '../../../Component/DateDetail';

// const QuestionDetailCard = ({ quiz, timeLeft, totalTime }) => {
//   if (!quiz) {
//     return <div>Loading...</div>;
//   }

//   const { name, quizType, availableFrom, totalPoints, allowNumberOfAttempts, timeLimit } = quiz; // destructure quiz object
//   const commentsData = [
//     {
//       avatar: "https://avatars.githubusercontent.com/u/109097090?v=4", // Replace with actual image URL
//       name: "Mr Teacher",
//       timestamp: "Feb/02 /09:02",
//       comment: "Hi Sir Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
//     },
//     {
//       avatar: "https://avatars.githubusercontent.com/u/109097090?v=4", // Replace with actual image URL
//       name: "Mr Teacher",
//       timestamp: "Feb/02 /09:02",
//       comment: "Hi Sir Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
//     },
//   ];

//   const formatTime = (seconds) => {
//     const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
//     const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
//     const s = String(seconds % 60).padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };

//   const quizQuestionDetails = [
//     { label: "Allow Attempts", value: allowNumberOfAttempts, type: "quizz" },
//     { label: "Quiz Point", value: `${totalPoints} Point`, type: "quizz" },
//     { label: "Questions", value: "25", type: "quizz" },
//     { label: "Time Limit", value: formatTime(timeLimit), type: "quizz" },
//     { label: "You can see the correct Answer", value: "02/10/2024", type: "date" },
//   ];

//   // Convert timeLimit to seconds if it's not already
//   const timeLimitInSeconds = timeLimit * 60;

//   // Calculate hours, minutes, and seconds from timeLimitInSeconds
//   const hours = Math.floor(timeLeft / 3600);
//   const minutes = Math.floor((timeLeft % 3600) / 60);
//   const seconds = timeLeft % 60;

//   const totalHours = Math.floor(timeLeft / 3600);
//   const totalMinutes = 60; // Max minutes value is always 60
//   const totalSeconds = 60; // Max seconds value is always 60

//   const hourPercentage = totalHours ? (hours / totalHours) * 100 : 0;
//   const minutePercentage = (minutes / totalMinutes) * 100;
//   const secondPercentage = (seconds / totalSeconds) * 100;

//   return (
//     <div className="flex flex-col gap-24 bg-white" aria-label="Question Detail Card">
//       <div className="mb-auto p-3">
//         {quizQuestionDetails.map((detail, index) => {
//           if (detail.type === "quizz") {
//             return <AssignmentDetail key={index} label={detail.label} extra={detail.extra} value={detail.value} />;
//           } else if (detail.type === "date") {
//             return <DateDetail key={index} label={detail.label} value={detail.value} />;
//           }
//           return null;
//         })}
//         <div className="flex justify-around mt-4">
//           <div style={{ width: 70, height: 70 }}>
//             <CircularProgressbar
//               value={hourPercentage}
//               text={`${hours} Hours`}
//               styles={{
//                 path: {
//                   stroke: `rgba(25, 246, 138, 0.8)`,
//                 },
//                 text: {
//                   fill: '#000',
//                 },
//                 trail: {
//                   stroke: '#d6d6d6',
//                 },
//                 background: {
//                   fill: '#3e98c7',
//                 },
//               }}
//             />
//           </div>
//           <div style={{ width: 70, height: 70 }}>
//             <CircularProgressbar
//               value={minutePercentage}
//               text={`${minutes} Min`}
//               styles={{
//                 path: {
//                   stroke: `rgba(25, 246, 138, 0.8)`,
//                 },
//                 text: {
//                   fill: '#000',
//                 },
//                 trail: {
//                   stroke: '#d6d6d6',
//                 },
//                 background: {
//                   fill: '#3e98c7',
//                 },
//               }}
//             />
//           </div>
//           <div style={{ width: 70, height: 70 }}>
//             <CircularProgressbar
//               value={secondPercentage}
//               text={`${seconds} Sec`}
//               styles={{
//                 path: {
//                   stroke: `rgba(25, 246, 138, 0.8)`,
//                 },
//                 text: {
//                   fill: '#000',
//                 },
//                 trail: {
//                   stroke: '#d6d6d6',
//                 },
//                 background: {
//                   fill: '#3e98c7',
//                 },
//               }}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="mb-4 h-52 overflow-y-scroll">
//         {commentsData.map((comment, index) => (
//           <CommentCard
//             key={index}
//             avatar={comment.avatar}
//             name={comment.name}
//             timestamp={comment.timestamp}
//             comment={comment.comment}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default QuestionDetailCard;
