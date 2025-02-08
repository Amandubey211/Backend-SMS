import React from "react";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { RiAddFill } from "react-icons/ri";

function CreateButton() {
  return (
    <ProtectedAction>
      <button
        onClick={() => {}}
        className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4 transform transition-transform duration-300 hover:scale-110"
        aria-label="Add Offline Exam"
      >
        <RiAddFill size={24} />
      </button>
      <span className="absolute bottom-14 right-1/2 transform translate-x-1/2 bg-black text-white text-sm p-2 rounded opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none">
        Add Offline Exam
      </span>
    </ProtectedAction>
  );
}

export default CreateButton;
