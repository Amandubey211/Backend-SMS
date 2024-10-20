import React from "react";
import { useSelector } from "react-redux";

const QuizInstructionSection = () => {
  const { quizzDetail } = useSelector((store) => store.admin.quizzes);

  const { content } = quizzDetail || {};

  return (
    <div className="max-w-3xl mx-auto p-2 bg-white">
      <div
        className="text-gray-700 mt-2 mb-6"
        dangerouslySetInnerHTML={{ __html: content || "" }}
      />
    </div>
  );
};

export default QuizInstructionSection;
