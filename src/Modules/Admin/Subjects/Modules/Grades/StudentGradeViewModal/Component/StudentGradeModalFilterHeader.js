import React, { useEffect, useState } from "react";
import { AiOutlinePrinter } from "react-icons/ai";
import {toast} from "react-hot-toast"
import { useSelector } from "react-redux";
import useGetModulesForStudent from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useGetModulesForStudent";
const StudentGradeModalFilterHeader = ({ filters, onFilterChange }) => {

  let [chapters,setChapters] = useState([])
  const moduleList = useSelector((store) => store.Subject.modules);
  const { loading, error, fetchModules } = useGetModulesForStudent();
  useEffect(()=>{
    fetchModules();
    const module = moduleList?.filter((i)=>i._id==filters?.module);
    setChapters(module[0]?.chapters)
  },[])
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    if(name=='module'){
      const module = moduleList?.filter((i)=>i._id==value);
      setChapters(module[0]?.chapters)
    }
    onFilterChange(name, value);
  };
  return (
    <div className="flex items-end gap-4 p-4 bg-white w-full">
      <div className="flex flex-col flex-grow">
        <label className="text-sm font-medium text-gray-700">Arrange By</label>
        <select
          name="arrangeBy"
          value={filters.arrangeBy}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select</option>
          <option value="assignment">Assignment</option>
          <option value="group assignment">Group Assignment</option>
          <option value="quiz">Quiz</option>
          <option value="group quiz">Group Quiz</option>
        </select>
      </div>
      <div className="flex flex-col flex-grow">
        <label className="text-sm font-medium text-gray-700">Modules</label>
        <select
          name="module"
          value={filters.module}
          onChange={handleChange}
          className="mt-1 block w-[15rem] px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value=''>All</option>
          {moduleList?.map((i)=>(
            <>
            <option value={i._id}>{i.moduleName}</option>
              </>
          ))}
        </select>
      </div>
      <div className="flex flex-col flex-grow">
        <label className="text-sm font-medium text-gray-700">Chapter</label>
        <select
          name="chapter"
          value={filters.chapter}
          onChange={handleChange}
          className="mt-1 block w-[15rem] px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value=''>All</option>
          {chapters?.map((i)=>(
            <option value={i._id}>{i.name}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col flex-grow">
        <label className="text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select</option>
          <option value="Submit">Submit</option>
          <option value="Excused">Excused</option>
          <option value="Missing">Missing</option>
        </select>
      </div>
      <button onClick={()=>toast.success("Backend Yet to Add")} className="p-2 bg-purple-100 rounded-md">
        <AiOutlinePrinter className="text-purple-600" size={24} />
      </button>
    </div>
  );
};

export default StudentGradeModalFilterHeader;
