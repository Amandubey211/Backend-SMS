import React, { useEffect, useState } from "react";
import QuizQuestionCard from "./QuizQuestionCard";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentQuestionIndex, setSelectedOptions } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizesSlice";
import { useParams } from "react-router-dom";
import { stdGetSingleQuiz } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizes.action";

const QuizQuestions = ({
  // questions,
  // selectedOptions,
  // setSelectedOptions, // Make sure you pass this correctly from MainSection
  showOneQuestionOnly,
  handleSubmit,
  hasRemainingAttempts
}) => {
  const { selectedOptions, itemDetails } = useSelector((store) => store?.student?.studentQuiz);
  const questions = itemDetails?.questions;
  const dispatch = useDispatch();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);



  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions?.length - 1) {
      console.log("cqisss111ss==>", currentQuestionIndex)
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      console.log("cqisssss==>", currentQuestionIndex)
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };


  // console.log("cqi 2", currentQuestionIndex)
  if (showOneQuestionOnly) {
    // Show one question at a time
    const question = questions[currentQuestionIndex];
    // console.log("cqi", currentQuestionIndex)
    return (
      <div className="w-full p-1">
        <QuizQuestionCard
          question={question}
          questionIndex={currentQuestionIndex}
          // selectedOption={selectedOptions[currentQuestionIndex]}
        />
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="bg-blue-500 text-white py-2 px-4 rounded-md disabled:bg-gray-300"
          >
            Previous
          </button>
          {currentQuestionIndex < questions?.length - 1 ? (
            <button
              onClick={handleNextQuestion}
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Submit All
            </button>
          )}
        </div>
      </div>
    );
  }



  // Show all questions at once
  return (
    <div className="w-full p-1">
      <div className="flex justify-start mb-2 font-medium text-xl">
        All Questions Preview
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions?.map((question, questionIndex) => (
          <QuizQuestionCard
            key={question._id}
            question={question}
            questionIndex={questionIndex}
            // selectedOption={selectedOptions[questionIndex]}
          />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Submit All
        </button>
      </div>
    </div>
  );
};

export default QuizQuestions;
