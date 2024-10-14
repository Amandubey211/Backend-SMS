import React, { useEffect, useState } from "react";
import {toast} from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchModules } from "../../../../../../../Store/Slices/Admin/Class/Module/moduleThunk";
const StudentGradeModalFilterHeader = ({ filters, onFilterChange }) => {
const {cid,sid} = useParams()
  let [chapters,setChapters] = useState([])
  const dispatch = useDispatch()
  const {modules:moduleList} = useSelector((state) => state.admin.module);
  const {studentSubjectProgress} = useSelector((store) => store.admin.all_students);
  useEffect(()=>{
    const module = moduleList?.filter((i)=>i?._id==filters.module);      
    setChapters(module[0]?.chapters||[])
   },[]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name=='module'){
      console.log(moduleList,value);
      const module = moduleList?.filter((i)=>i?._id==value);      
      setChapters(module[0]?.chapters||[])
    }
    if(name=='subject'){
      dispatch(fetchModules({ cid, sid:value })).then(()=>{
        setChapters(moduleList[0]?.chapters||[])
        });
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
       <> 
       {sid ?null:<div className="flex flex-col flex-grow">
        <label className="text-sm font-medium text-gray-700">Subjects</label>
        <select
  name="subject"
  value={filters.subject}
  onChange={handleChange}
  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
>
  <option value=''>All</option>
  {studentSubjectProgress?.map((i) => (
    <option key={i?.subjectId} value={i?.subjectId}>
      {i?.subjectName}
    </option>
  ))}
</select>

      </div>}
       <div className="flex flex-col flex-grow">
        <label className="text-sm font-medium text-gray-700">Modules</label>
        <select
          name="module"
          value={filters.module}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value=''>All</option>
          {moduleList?.map((i)=>(
            <>
            <option value={i._id}>{i?.moduleName?.slice(0,20)}</option>
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
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value=''>All</option>
          {chapters?.map((i)=>(
            <option value={i._id}>{i?.name?.slice(0,20)}</option>
          ))}
        </select>
      </div></>
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
      {/* <button onClick={()=>toast.success("Backend Yet to Add")} className="p-2 bg-purple-100 rounded-md">
        <AiOutlinePrinter className="text-purple-600" size={24} />
      </button> */}
    </div>
  );
};

export default StudentGradeModalFilterHeader;
