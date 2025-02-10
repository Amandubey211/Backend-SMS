import React from "react";
import { AiFillFileExcel } from "react-icons/ai";
import FilterCard from "./FilterCard";

const UploadAndFilter = () => {
  return (
    <div className="w-[30%] p-2">
      {/* <div className="pl-5 pt-1">
        <button
          onClick={() => {}}
          className="flex justify-center items-center mt-2 gap-x-2 px-4 py-2 w-full rounded-md bg-gradient-to-r from-pink-100 to-purple-200"
        >
          <span>
            <MdFileUpload className="text-lg text-gray-600" />{" "}
          </span>
          <span className="text-gradient">Upload Excel</span>
        </button>
      </div> */}
      <div className="pl-5 pt-1">
        <button
          onClick={() => {}}
          className="flex justify-center items-center mt-2 gap-x-2 px-4 py-2 w-full rounded-md bg-gradient-to-r from-pink-100 to-purple-200"
        >
          <span>
            <AiFillFileExcel className="text-lg text-red-600" />
          </span>
          <span className="text-gradient">Export Excel</span>
        </button>
      </div>
      <FilterCard />
    </div>
  );
};

export default UploadAndFilter;
