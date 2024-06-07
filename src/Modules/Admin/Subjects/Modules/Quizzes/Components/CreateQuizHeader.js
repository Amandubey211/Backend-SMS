import React from "react";
import { NavLink, useParams } from "react-router-dom";

const CreateQuizHeader = () => {
    const {sid,cid} = useParams()
  return (
    <div className="flex justify-between p-4 items-center border-b">
      <h1 className="text-lg">All Quizzes</h1>
      <NavLink
        to={`/class/${cid}/${sid}/createQuiz`}
        className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-md shadow"
      >
        + Add New Quiz
      </NavLink>
    </div>
  );
};

export default CreateQuizHeader;
