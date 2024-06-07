import React from 'react';
import ButtonsGroup from '../../../Component/ButtonsGroup';
import SpeedGradeButton from '../../../Component/SpeedGradeButton';
import AssignmentDetail from '../../../Component/AssignmentDetail';
import CommentCard from './CommentCard';

const QuestionDetailCard = () => {
  const commentsData = [
    {
      avatar: "https://avatars.githubusercontent.com/u/109097090?v=4", // Replace with actual image URL
      name: "Mr Teacher",
      timestamp: "Feb/02 /09:02",
      comment: "Hi Sir Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
    },
    // Add more comment objects as needed
  ];

  return (
    <div className="flex flex-col h-full  bg-white" aria-label="Question Detail Card">
      <div className="mb-auto p-4">
        <ButtonsGroup />
        <SpeedGradeButton />
        <AssignmentDetail label="Question Point" value="100 Point" />
        <AssignmentDetail label="Question Type" value="Multiple Choice" />
      </div>
      <div className="mt-4">
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
