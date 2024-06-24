import React from "react";
import ChildCard from "../../../Components/Parents/Children/ChildCard";
import {students} from "../../../Modules/Parents/Childrens/ChildrenData/ChildrenData"


const MyChildren = () => {
  return (
    <div className="h-full  w-full">
      <div className=" w-full p-2">
      <div className="min-h-screen flex-wrap  bg-gray-100 flex items-start">
            {students.map(student => (
                <ChildCard key={student.id} student={student} />
            ))}
        </div>
        {/* <div className="flex flex-wrap justify-between items-start border-y">
          <div className="w-full md:w-1/2 border-r">
            <TotalAttendanceGraph />
          </div>
          <div className="w-full md:w-1/2">
            <TotalEarningsGraph />
          </div>
        </div> */}
        {/* <div className="flex flex-wrap justify-between items-start border-y">
          <div className="w-full md:w-2/3 h-full border-r">
            <TopRankingStudents />
          </div>
          <div className="w-full h-full flex flex-col md:w-1/3 ps-3">
            <TotalStudentsGraphjs />
          </div>
        </div> */}
        {/* <div className="flex flex-wrap items-start justify-between border-y   ">
          <div className="w-full md:w-1/2  border-r flex flex-col  justify-center">
            <BestPerformersChart data={performanceData} />
          </div>
          <div className="w-full md:w-1/2 ">
            <Library />
          </div>
        </div> */}

        {/* <div className="flex flex-wrap justify-between items-start  border-y">
        <div className="w-full md:w-1/2 border-r" >
            <StudentParentCard />
          </div>
          <div className="w-full md:w-1/2 border-r" >
            <NoticeBoard />
          </div>

         

         
        </div>
        <div className="flex flex-wrap justify-between items-start  border-y">
        <div className="w-full  border-r" >
          <ParentAccounting/>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default MyChildren;
