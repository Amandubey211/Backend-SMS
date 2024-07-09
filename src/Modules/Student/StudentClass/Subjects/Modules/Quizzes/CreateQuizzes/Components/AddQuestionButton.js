import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

const AddQuestionButton = ({ addNewQuestion }) => {
  return (
    <button
      onClick={addNewQuestion}
      className="flex items-center px-4 py-2 border border-purple-300 rounded-md text-purple-500 hover:bg-purple-100 transition mt-6"
    >
      <AiOutlinePlus className="mr-2" />
      Add New Question
    </button>
  );
};

export default AddQuestionButton;
