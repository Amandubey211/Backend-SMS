import React from "react";
import QuestionList from "./QuestionList";

const QuestionListView = ({ questionState, handleSidebarOpen, deleteQuestion, editQuestion }) => (
  <>
    <QuestionList questions={questionState} deleteQuestion={deleteQuestion} editQuestion={editQuestion} />
    {questionState?.length === 0 && (
      <div className="w-full h-80 flex justify-center items-center">
        <div>
          <button
            onClick={handleSidebarOpen}
            className="flex items-center border border-gray-300 ps-5 py-0 rounded-full"
          >
            <span className="mr-2">Add new Question</span>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
              <span className="text-3xl -mt-2">+</span>
            </div>
          </button>
        </div>
      </div>
    )}
  </>
);

export default QuestionListView;
