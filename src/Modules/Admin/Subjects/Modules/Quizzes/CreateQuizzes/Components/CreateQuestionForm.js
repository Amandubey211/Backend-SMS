// QuestionOptions.jsx
import React from 'react';
import LabeledInput from './LabeledInput';
import LabeledSelect from './LabeledSelect';



const QuestionOptions = ({ questionType, points, handleChange }) => {
  return (
    <div className="max-w-md mx-auto p-4 bg-white  space-y-6">
      <h2 className="text-xl font-semibold">Option</h2>
      <div className="space-y-4">
        <LabeledSelect
          label="Question Type"
          name="questionType"
          value={questionType}
          onChange={handleChange}
          options={[
            { value: 'Multiple Choice', label: 'Multiple Choice' },
            { value: 'True/False', label: 'True/False' },
            { value: 'Short Answer', label: 'Short Answer' },
          ]}
        />
        <LabeledInput
          label="Question Point"
          name="points"
          value={points}
          onChange={handleChange}
          type="number"
        />
      </div>
    </div>
  );
};

export default QuestionOptions;
