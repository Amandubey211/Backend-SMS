import React from 'react';
import EditorComponent from '../../../../Component/AdminEditor';
import AnswerSection from './AnswerSection';
import AddQuestionButton from './AddQuestionButton';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { BsCheck } from 'react-icons/bs';

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

  const handleQuestionTypeChange = (e) => {
    setQuestionType(e.target.value);
  };

  const handleQuestionPointChange = (e) => {
    setQuestionPoint(e.target.value);
  };

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
            onChange={handleQuestionPointChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Question Type
          </label>
          <select
            value={questionType}
            onChange={handleQuestionTypeChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="multiple choice">Multiple Choice</option>
            <option value="true/false">True/False</option>
            <option value="text">Text</option>
          </select>
        </div>
      </div>

      <h2 className="text-gradient text-2xl font-semibold px-5 pt-3">Write Question</h2>
      <EditorComponent
        isCreateQuestion={true}
        hideInput={true}
        editorContent={question}
        onEditorChange={handleQuestionChange}
      />

      {questionType === 'multiple choice' && (
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

      {questionType === 'true/false' && (
        <div className="p-6 bg-white space-y-6">
          <h2 className="text-xl font-semibold">Answer Section</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 border p-1 ps-3 rounded-md">
              <div
                className={`flex items-center justify-center h-6 w-6 rounded ${answers[0]?.isCorrect ? 'bg-green-500' : 'bg-gray-200'} text-white cursor-pointer`}
                onClick={() => setAnswers([{ text: 'True', isCorrect: true }, { text: 'False', isCorrect: false }])}
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
                className={`flex items-center justify-center h-6 w-6 rounded ${answers[1]?.isCorrect ? 'bg-green-500' : 'bg-gray-200'} text-white cursor-pointer`}
                onClick={() => setAnswers([{ text: 'True', isCorrect: false }, { text: 'False', isCorrect: true }])}
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
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                name="rightAnswerComment"
                value={rightAnswerComment}
                onChange={(e) => setRightAnswerComment(e.target.value)}
                placeholder="Type Right Answer Comment"
                className="w-full p-3 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                name="wrongAnswerComment"
                value={wrongAnswerComment}
                onChange={(e) => setWrongAnswerComment(e.target.value)}
                placeholder="Type Wrong Answer Comment"
                className="w-full p-3 border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>
      )}

      {questionType === 'text' && (
        <div className="p-6 bg-white space-y-6">
          <h2 className="text-xl font-semibold">Answer Section</h2>
          <div className="flex items-center space-x-2">
            <AiOutlineInfoCircle className="text-gray-500" />
            <p className="text-gray-500">The student has to answer in the blank input</p>
          </div>
        </div>
      )}

      <AddQuestionButton addNewQuestion={addNewQuestion} />
    </div>
  );
};

export default QuestionForm;
