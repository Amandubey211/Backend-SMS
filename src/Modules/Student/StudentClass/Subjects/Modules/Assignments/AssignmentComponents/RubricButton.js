import React from 'react';

const RubricButton = ({ onClick }) => (
  <button onClick={onClick} className="mt-4 flex text-xl gap-1 items-center">
    <span className="text-gradient text-3xl -mt-1">+</span>
    <span className="text-gradient font-semibold border-b border-red-600">Rubric</span>
  </button>
);

export default RubricButton;
