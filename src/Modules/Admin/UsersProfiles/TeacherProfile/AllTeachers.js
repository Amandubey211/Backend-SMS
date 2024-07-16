import React, { useEffect, useState } from "react";
import { dummyTeachers } from "./dummyData/dummyData";
import { FiUserPlus } from "react-icons/fi";
import { BiTrash } from "react-icons/bi";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import { NavLink } from "react-router-dom";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";
import AddTeacher from "./AddTeacher";
import useGetAllTeachers from "../../../../Hooks/AuthHooks/Staff/Admin/Teacher/useGetAllTeacher";
import { useSelector } from "react-redux";
import useDeleteUser from "../../../../Hooks/AuthHooks/Staff/Admin/staff/useDeleteUser";
import AddUser from "../StaffProfile/AddUser";

const AllTeachers = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { fetchTeachers } = useGetAllTeachers();
  const teachers = useSelector((store) => store.Teachers.allTeachers);
  useEffect(() => {
    
    fetchTeachers();
    // fetchSubjects(cid);
    console.log(teachers);
  }, []);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  const {deleteUser} = useDeleteUser()
 const deleteTeacher = (event,id)=>{
  deleteUser(id)
  event.stopPropagation();
 
 }
  return (
    <Layout title="All Teachers">
      <DashLayout>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Teachers</h2>
            <button
              onClick={handleSidebarOpen}
              className="bg-purple-500 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            >
              <FiUserPlus />
              <span>Add New Teacher</span>
            </button>
          </div>
          <div className="flex flex-wrap -mx-2">
            {teachers.map((teacher, index) => (
              <div
                className="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4 flex flex-col"
                key={index}
              >
              
                  <div className=" absolute right-0 flex flex-col px-4 gap-2 justify-end ">
                    <button className=" bg-transparent p-2 rounded-full border  ">
                      <FiUserPlus className="text-sm text-green-500 " />
                    </button>
                    <button className=" bg-transparent p-2 rounded-full border" onClick={(event)=>deleteTeacher(event,teacher._id)}>
                      <BiTrash className="text-sm text-red-500  "  />
                    </button>
                  </div>

                  <div className="flex flex-col h-[80%] justify-center items-center  py-3">
                    <img
                      className=" object-cover rounded-full w-[100px] h-[100px]"

                      src={teacher.imageUrl || "https://avatars.githubusercontent.com/u/109097090?v=4"}



                      alt={teacher.name}
                    />
                    <h3 className="text-lg font-medium">{teacher.fullName}</h3>
                    <p className="text-gray-500">not yet</p>
                  </div>

                  <div className="p-4 text-center justify-center items-center  ">
                    {/* <h3 className="text-lg font-medium">{teacher.name}</h3>
                    <p className="text-gray-500">{teacher.subject}</p> */}
                    <p className="text-gray-600 ">Phone: </p>
                    <p className="text-gray-600 ">{teacher.mobileNumber}</p>
                  </div>
                
              </div>
            ))}
          </div>
          <SidebarSlide
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title="Add New Teacher"
            width="70%"
            
             // Custom width
            // Custom height
          >
            <AddUser role={'teacher'} />
          </SidebarSlide>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default AllTeachers;
