import React from "react";
import QuestionForm from "./QuestionForm";

const QuestionFormContainer = ({
  question,
  answers,
  questionPoint,
  questionType,
  rightAnswerComment,
  wrongAnswerComment,
  handleQuestionChange,
  handleAnswerChange,
  setAnswers,
  setRightAnswerComment,
  setWrongAnswerComment,
  setQuestionPoint,
  setQuestionType,
  addNewQuestion,
}) => (
  <QuestionForm
    question={question}
    answers={answers}
    questionPoint={questionPoint}
    questionType={questionType}
    rightAnswerComment={rightAnswerComment}
    wrongAnswerComment={wrongAnswerComment}
    handleQuestionChange={handleQuestionChange}
    handleAnswerChange={handleAnswerChange}
    setAnswers={setAnswers}
    setRightAnswerComment={setRightAnswerComment}
    setWrongAnswerComment={setWrongAnswerComment}
    setQuestionPoint={setQuestionPoint}
    setQuestionType={setQuestionType}
    addNewQuestion={addNewQuestion}
  />
);

export default QuestionFormContainer;
