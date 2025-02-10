import React, { useState } from "react";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { RiAddFill } from "react-icons/ri";
import { Tooltip } from "antd";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import HandsontableComp from "./HandsontableComp";

function CreateButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ProtectedAction>
      <Tooltip title="Create Offline Exam" placement="left">
        <button
          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4 transform transition-transform duration-300 hover:scale-110"
          aria-label="Add Offline Exam"
          onClick={() => setIsOpen(true)}
        >
          <RiAddFill size={24} />
          <span className="absolute bottom-14 right-1/2 transform translate-x-1/2 bg-black text-white text-sm p-2 rounded opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none">
            Add Offline Exam
          </span>
        </button>
      </Tooltip>
      {isOpen && (
        <Sidebar
          isOpen={isOpen}
          title={"Create Offline Exam"}
          onClose={() => setIsOpen(false)}
          width={"80%"}
          children={
            <div>
              <div className="flex justify-end ">
                <div className="pl-5 pt-1">
                  <button
                    onClick={() => {}}
                    className="flex justify-center items-center mt-2 gap-x-2 px-4 py-2 w-full rounded-md bg-gradient-to-r from-pink-100 to-purple-200"
                  >
                    {/* <span>
            <MdFileUpload className="text-lg text-gray-600" />{" "}
          </span> */}
                    <span className="text-gradient">Create Manually</span>
                  </button>
                </div>
                <div className="pl-5 pt-1">
                  <button
                    onClick={() => {}}
                    className="flex justify-center items-center mt-2 gap-x-2 px-4 py-2 w-full rounded-md bg-gradient-to-r from-pink-100 to-purple-200"
                  >
                    {/* <span>
            <MdFileUpload className="text-lg text-gray-600" />{" "}
          </span> */}
                    <span className="text-gradient">Upload Excel</span>
                  </button>
                </div>
                <div className="pl-5 pt-1">
                  <button
                    onClick={() => {}}
                    className="flex justify-center items-center mt-2 gap-x-2 px-4 py-2 w-full rounded-md bg-gradient-to-r from-pink-100 to-purple-200"
                  >
                    {/* <span>
            <MdFileUpload className="text-lg text-gray-600" />{" "}
          </span> */}
                    <span className="text-gradient">Sample Excel</span>
                  </button>
                </div>
              </div>
              <HandsontableComp />
            </div>
          }
        />
      )}
    </ProtectedAction>
  );
}

export default CreateButton;
