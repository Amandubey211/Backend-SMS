import React, { useEffect } from "react";
import EditorComponent from "../../../../Component/AdminEditor";
import AnswerSection from "./AnswerSection";
import AddQuestionButton from "./AddQuestionButton";
import { BsCheck } from "react-icons/bs";

const QuestionForm = ({
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
}) => {
  useEffect(() => {
    if (questionType === "true/false") {
      setAnswers([
        { text: "True", isCorrect: false },
        { text: "False", isCorrect: false },
      ]);
    } else if (questionType === "multiple choice") {
      setAnswers([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
    } else {
      setAnswers([]);
    }
  }, [questionType, setAnswers]);

  return (
    <div className="h-full pb-16 overflow-y-scroll">
      <div className="flex justify-between items-center px-5 pt-3 space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            This Question Point
          </label>
          <input
            type="number"
            value={questionPoint}
            onChange={(e) => setQuestionPoint(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Question Type
          </label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="multiple choice">Multiple Choice</option>
            <option value="true/false">True/False</option>
            <option value="text">Text</option>
          </select>
        </div>
      </div>

      <h2 className="text-gradient text-xl font-semibold px-5 pt-3">
        Write Question
      </h2>
      <EditorComponent
        isCreateQuestion={true}
        hideInput={true}
        editorContent={question}
        onEditorChange={handleQuestionChange}
      />

      {questionType === "multiple choice" && (
        <AnswerSection
          answers={answers}
          setAnswers={setAnswers}
          handleAnswerChange={handleAnswerChange}
          rightAnswerComment={rightAnswerComment}
          setRightAnswerComment={setRightAnswerComment}
          wrongAnswerComment={wrongAnswerComment}
          setWrongAnswerComment={setWrongAnswerComment}
        />
      )}

      {questionType === "true/false" && (
        <div className="p-6 bg-white space-y-6">
          <h2 className="text-xl font-semibold">Answer Section</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 border p-1 ps-3 rounded-md">
              <div
                className={`flex items-center justify-center h-6 w-6 rounded ${
                  answers[0]?.isCorrect ? "bg-green-500" : "bg-gray-200"
                } text-white cursor-pointer`}
                onClick={() =>
                  setAnswers([
                    { text: "True", isCorrect: true },
                    { text: "False", isCorrect: false },
                  ])
                }
              >
                {answers[0]?.isCorrect && <BsCheck />}
              </div>
              <input
                type="text"
                name="text"
                value="True"
                readOnly
                className="w-full p-2 border-none focus:ring-0"
              />
            </div>
            <div className="flex items-center space-x-2 border p-1 ps-3 rounded-md">
              <div
                className={`flex items-center justify-center h-6 w-6 rounded ${
                  answers[1]?.isCorrect ? "bg-green-500" : "bg-gray-200"
                } text-white cursor-pointer`}
                onClick={() =>
                  setAnswers([
                    { text: "True", isCorrect: false },
                    { text: "False", isCorrect: true },
                  ])
                }
              >
                {answers[1]?.isCorrect && <BsCheck />}
              </div>
              <input
                type="text"
                name="text"
                value="False"
                readOnly
                className="w-full p-2 border-none focus:ring-0"
              />
            </div>
          </div>
        </div>
      )}

      {questionType === "text" && (
        <div className="p-6 bg-white space-y-6">
          <h2 className="text-xl font-semibold">Answer Section</h2>
          <div className="flex items-center space-x-2">
            <p className="text-gray-500">
              The student has to answer in the blank input
            </p>
          </div>
        </div>
      )}

      <AddQuestionButton addNewQuestion={addNewQuestion} />
    </div>
  );
};

export default QuestionForm;
