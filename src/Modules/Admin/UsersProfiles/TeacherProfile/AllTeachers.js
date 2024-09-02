import React, { useEffect, useState } from "react";
import { dummyTeachers } from "./dummyData/dummyData";
import { FiLoader, FiUserPlus } from "react-icons/fi";
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
import DeleteConfirmatiomModal from "../../../../Components/Common/DeleteConfirmationModal";
import { GoAlertFill } from "react-icons/go";
import { MdBlock, MdOutlinePublishedWithChanges } from "react-icons/md";
import ProfileCard from "../SubComponents/ProfileCard";
import ViewTeacher from "./SingleTeacher";
const AllTeachers = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const { fetchTeachers,loading } = useGetAllTeachers();
 const [teacherId,setTeacherId] =useState()
  const teachers = useSelector((store) => store.Teachers.allTeachers);
  useEffect(() => {
    
    fetchTeachers();
    // fetchSubjects(cid);
    console.log(teachers);
  }, []);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const handleSidebarOpen = () => {setSidebarOpen(true);
    setTeacherData(null)
    setSidebarContent("addTeacher");
  };
  const handleSidebarClose = () => setSidebarOpen(false);
  const {deleteUser,error} = useDeleteUser()
 const deleteTeacher = async()=>{
  await deleteUser(teacherId);
  if(!error){
    fetchTeachers();
  }
  setIsModalOpen(false);
 }
 const editUser = async(event,data)=>{
  event.stopPropagation();
  setSidebarContent("editTecaher");
  setSidebarOpen(true);
  setSelectedStaff(data);
 }
    const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleStaffClick = (staff) => {
    setSelectedStaff(staff);
    setSidebarContent("viewTeacher");
    setSidebarOpen(true);
  };
  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewTeacher":
        return <ViewTeacher staff={selectedStaff} />;
        case "addTeacher":
          return <AddUser role="staff"  />;
        case "editTecaher":
          return <AddUser  role = {'teacher'} data={selectedStaff} />;
        default:
        return <div>Select an action</div>;
    }
  };
  return (
    <Layout title="All Teachers">
      <DashLayout>
      {loading?<div className="flex w-full h-[90vh] flex-col items-center justify-center">
    <FiLoader className="animate-spin mr-2 w-[3rem] h-[3rem] " />
    <p className="text-gray-800 text-lg">Loading...</p>
    </div>:
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
          <div className="flex flex-wrap -mx-2">
            {teachers.length >0 ?
            teachers.map((teacher, index) => (
             
              <ProfileCard
              key={index}
              profile={teacher}
              editUser={editUser}
              onClick={handleStaffClick}
            />
            )):  <div>
            <div className="flex w-[80vw] text-gray-500 h-[90vh] items-center justify-center flex-col text-2xl">
    <GoAlertFill className="text-[5rem]" />
   No  Data Found
  </div>
        </div>}
          </div>
          <DeleteConfirmatiomModal
  isOpen={isModalOpen}
  onClose={closeModal}
  onConfirm={deleteTeacher}
/>
        </div>}
        <SidebarSlide
            key={sidebarContent} 
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                {sidebarContent === "viewTeacher" ? "Quick View of Staff" : "Add/Edit Staff"}
              </span>
            }
            width="70%"
            height="auto"
          >
            {renderSidebarContent()}
          </SidebarSlide>
      </DashLayout>
    </Layout>
  );
};

export default AllTeachers;
