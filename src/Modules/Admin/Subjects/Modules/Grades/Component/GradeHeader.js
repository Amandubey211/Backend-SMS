import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { VscSettings } from "react-icons/vsc";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import Filter from "./Filter";
import { useSelector } from "react-redux";
import useGetModulesForStudent from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useGetModulesForStudent";
import useGetFilteredQuizzes from "../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useGetFilteredQuizzes";
import useGetFilteredAssignments from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useGetFilteredAssignments";
import { useParams } from "react-router-dom";

const GradeHeader = ({ onSearch, onFilterChange }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const {sid} = useParams()
  const handleSearchChange = (e) => {
  
       setSearch(e.target.value);
    onSearch(e.target.value);
   
  };

  const handleFilterChange = (name, value) => {
    onFilterChange(name, value);
  };
  const moduleList = useSelector((store) => store.Subject.modules);
  const  assignments = useSelector((store) => store.Subject.assignments);
  const { error, fetchFilteredQuizzes, loading, quizzes } = useGetFilteredQuizzes();
  const {fetchFilteredAssignments} =useGetFilteredAssignments()
  useEffect(()=>{
    fetchFilteredAssignments(sid);
    fetchFilteredQuizzes();
  },[])
  return (
    <div className="p-2 bg-white  ">
      <h2 className="text-xl ps-2 font-semibold mb-3">All Grades</h2>
      <div className="flex  items-end justify-around   gap-1 px-4 ">
        <div className="relative flex flex-col">
          <label className="text-gray-600 mb-1">Search Student</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 w-[15rem]"
              value={search}
              onChange={handleSearchChange}
            />
            <button className="absolute right-2 top-3">
              <CiSearch className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Module</label>
          <select
            name="moduleId"
            className="px-4 py-2 border w-40 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) =>  handleFilterChange("moduleId", e.target.value)}
          >
            <option value="">All</option>
            {moduleList?.map((i)=>(
            <>
            <option value={i._id}>{i.moduleName?.slice(0,15)}..</option>
              </>
          ))}
          </select>
        </div>
        
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Assignment</label>
          <select
            name="assignmentId"
            className="px-4 py-2 border w-40 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => handleFilterChange("assignmentId", e.target.value)}
          >
               <option value="">All</option>
            { assignments?.map((i)=>(
            <>
            <option value={i._id}>{i.name?.slice(0,15)}..</option>
              </>
          ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Quizzes</label>
          <select
            name="quizId"
            className="px-4 py-2 border w-40 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => handleFilterChange("quizId", e.target.value)}
          >
                    <option value="">All</option>
            {quizzes?.map((i)=>(
            <>
            <option value={i._id}>{i.name?.slice(0,15)}..</option>
              </>
          ))}
          </select>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <VscSettings className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <Sidebar title="Filter" isOpen={open} onClose={() => setOpen(!open)}>
        <Filter onFilterChange={handleFilterChange} onClose={() => setOpen(!open)} />
      </Sidebar>
    </div>
  );
};

export default GradeHeader;
