import React, { memo, useEffect, useState }from "react";
import { FaCrown } from "react-icons/fa6";
import { fetchTopStudents } from "../../../../Store/Slices/Admin/Dashboard/adminDashboard.action";
import { useDispatch, useSelector } from "react-redux";
import {fetchAllClasses} from '../../../../Store/Slices/Admin/Class/actions/classThunk'
import Spinner from "../../../../Components/Common/Spinner";
import NoDataFound from "../../../../Components/Common/NoDataFound";
const TopRankingStudents = () => {

  const {topStudents, loadingTopStudents,errorTopStudents} = useSelector((state) => state.admin.adminDashboard);
  const { classes } = useSelector((store) => store?.admin?.class);
  const [selectedClass,setSelectedClass] = useState(classes[0]?._id)
 // const {class} = useSelector((state) => state.admin.class);
const dispatch = useDispatch()
  useEffect(() => {
    
    dispatch(fetchAllClasses()).then(()=>{
    
  {dispatch(fetchTopStudents(selectedClass))}
      
    })
  }, [dispatch]);
  const handleChange = async(e)=>{
    const{name,value} = e.target;
    setSelectedClass(value)
    dispatch(fetchTopStudents(value))
 
    
  }
  return (
    <div className="bg-white p-4 ">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold ">Top Ranking Students</h2>
        
        <div className="relative">
        <select
            name="classId"
            value={selectedClass}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {classes?.map((c) => (
              <option key={c?._id} value={c?._id}>
                {c?.className}
              </option>
            ))}
          </select>
         
        </div> 
     
      </div>
{errorTopStudents?<div className="flex items-center justify-center py-20">
  <NoDataFound title={"Student"}/>

</div>:
 loadingTopStudents ?<div className="py-20">
  <Spinner/>
</div> :<>   
      <div className=" flex  w-full h-auto py-2 gap-4">
   {topStudents?.slice(0, 3).map((student, index) => (
          <div key={index} className="text-center p-4 border rounded-lg relative w-[35%] ">

            {index === 0 && (
              <div
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{ top: "17px" }}
              >
                <FaCrown className="w-20 h-8" />
              </div>
            )}
            <div className="relative mt-10">
              <img
                className="w-14 h-14 rounded-full mx-auto"
                src={student?. studentProfile}
                alt={student?. studentName}
              />
              {index !== 0 && (
                <h3
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full text-md mb-1 mt font-medium bg-white px-2"
                  style={{ paddingBottom: "7px" }}
                >
                  Top {index === 1 ? 2 : 3}
                </h3>
              )}
            </div>
            <p>{student.studentName}</p>
            <p className="mb-2">Adm: <span className="text-gray-600">{student?.admissionNumber}</span></p>
            <span
              style={{
                background: "linear-gradient(to right, #fce7f3, #e9d5ff)",
              }}
              className="px-3 rounded-sm"
            >
              <span
                style={{
                  background: "linear-gradient(to right, #f43f5e, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Score: {student?.score} %
              </span>
            </span>
          </div>
        ))}  
      </div>
      {  <div className="flex flex-col gap-2">
        {topStudents.slice(topStudents?.length > 3 ? 3:0).map((student, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 px-5 border rounded-md"
          >
            <div className="flex items-center">
              <span className="mr-3">{index+1}</span>
              <img
                className="w-10 h-10 rounded-full mr-4"
                src={student?.studentProfile}
                alt={student?.studentName}
              />
              <span>{student?.studentName}</span>
            </div>
            <div
              className="rounded-sm"
              style={{
                background: "linear-gradient(to right, #fce7f3, #e9d5ff)",
              }}
            >
              <span
                style={{
                  background: "linear-gradient(to right, #f43f5e, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                className="px-3"
              >
                Score: {student?.score} %
              </span>
            </div>
            <span>Adm: <span className="text-gray-600">{student?.admissionNumber}</span></span>
          </div>
        ))}
      </div>  }
      </>}
    </div>
  );
};

export default memo(TopRankingStudents);
