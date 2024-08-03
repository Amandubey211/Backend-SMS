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
import profileIcon from '../../../../Assets/DashboardAssets/profileIcon.png'
const AllTeachers = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const { fetchTeachers } = useGetAllTeachers();

  const teachers = useSelector((store) => store.Teachers.allTeachers);
  useEffect(() => {
    
    fetchTeachers();
    // fetchSubjects(cid);
    console.log(teachers);
  }, []);

  const handleSidebarOpen = () => {setSidebarOpen(true);setTeacherData(null)};
  const handleSidebarClose = () => setSidebarOpen(false);
  const {deleteUser,error} = useDeleteUser()
 const deleteTeacher = async(event,id)=>{
  await deleteUser(id);
  if(!error){
    fetchTeachers();
  }
  event.stopPropagation();
 
 }
 const editUser = async(event,data)=>{
  setSidebarOpen(true);
  setTeacherData(data);
  event.stopPropagation();
 }
  return (
    <Layout title="All Teachers">
      <DashLayout>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 border-b-2 h-20">
            <h2 className="text-xl font-semibold flex itmes-center gap-2">All Teachers <span className="bg-purple-400 px-2 text-sm py-1 rounded-full">{teachers?.length}</span></h2>
            <button
              onClick={handleSidebarOpen}
              className="bg-purple-500 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            >
              <FiUserPlus />
              <span>Add New Teacher</span>
            </button>
          </div>
          <div className="flex flex-wrap  gap-4">
            {teachers.map((teacher, index) => (
              <div
                className=" relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-1 mb-4 flex flex-col
                 rounded-lg hover:shadow-lg  border p-2"
                key={index}
              >
                  <div className=" absolute right-0 flex flex-col px-4 gap-2 justify-end ">
                    <button className=" bg-transparent p-2 rounded-full border  " onClick={(event)=>editUser(event,teacher)}>
                      <FiUserPlus className="text-sm text-green-500 "   />
                    </button>
                    <button className=" bg-transparent p-2 rounded-full border" onClick={(event)=>deleteTeacher(event,teacher._id)}>
                      <BiTrash className="text-sm text-red-500  "  />
                    </button>
                  </div>

                  <div className="flex flex-col h-[80%] justify-center items-center  py-3">
                    <img
                      className=" object-cover rounded-full w-[100px] h-[100px] border"

                      src={teacher.profile ||profileIcon }



                      alt={teacher.name}
                    />
                    <h3 className="text-lg font-medium">{teacher.fullName}</h3>
                    <p className="text-gray-500">{teacher.position}</p>
                  </div>

                  <div className="p-4 text-center justify-center items-center border-t-2  ">
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
            <AddUser role={'teacher'}  data={teacherData}/>
          </SidebarSlide>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default AllTeachers;
