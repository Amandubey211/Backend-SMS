import React, { useEffect, useState } from "react";
import { FiLoader, FiUserPlus } from "react-icons/fi";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";
import { useDispatch, useSelector } from "react-redux";
import AddUser from "../StaffProfile/AddUser";
import { GoAlertFill } from "react-icons/go";
import ProfileCard from "../SubComponents/ProfileCard";
import ViewTeacher from "./SingleTeacher";
import { fetchAllTeachers } from "../../../../Store/Slices/Admin/Class/Teachers/teacherThunks";
import Spinner from "../../../../Components/Common/Spinner";
const AllTeachers = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const {allTeachers,loading:teacherLoading} = useSelector((store)=>store.admin.teacher);
 const {loading} = useSelector((store)=>store.admin.all_staff);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllTeachers())
  }, [dispatch]);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const handleSidebarOpen = () => {setSidebarOpen(true);
    setTeacherData(null)
    setSidebarContent("addTeacher");
  };
  const handleSidebarClose = () => setSidebarOpen(false);
 const editUser = async(event,data)=>{
  event.stopPropagation();
  setSidebarContent("editTecaher");
  setSidebarOpen(true);
  setSelectedStaff(data);
 }
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
          return <AddUser role="teacher"  />;
        case "editTecaher":
          return <AddUser  role = {'teacher'} data={selectedStaff} />;
        default:
        return <div>Select an action</div>;
    }
  };
  return (
    <Layout title="All Teachers">
      <DashLayout>
      {loading | teacherLoading
       ? <div className="flex w-full h-[90vh] flex-col items-center justify-center">
        <Spinner/>
    </div>:
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 border-b-2 h-20">
            <h2 className="text-xl font-semibold flex itmes-center gap-2">All Teachers <span className="bg-purple-400 px-2 text-sm py-1 rounded-full">{allTeachers?.length}</span></h2>
            <button
              onClick={handleSidebarOpen}
              className="bg-purple-500 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            >
              <FiUserPlus />
              <span>Add New Teacher</span>
            </button>
          </div>
          <div className="flex flex-wrap -mx-2">
            {allTeachers.length >0 ?
            allTeachers.map((teacher, index) => (
             
              <ProfileCard
              key={index}
              profile={teacher}
              editUser={editUser}
              onClick={handleStaffClick}
            />
            )):  <div>
            <div className="flex w-[80vw] text-gray-500 h-[90vh] items-center justify-center flex-col text-2xl">
    <GoAlertFill className="text-[5rem]" />
   No  Teacher Found
  </div>
        </div>}
          </div>
        </div>}
        <SidebarSlide
            key={sidebarContent} 
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                {sidebarContent === "viewTeacher" ? "Quick View of Teacher" : "Add/Edit Teacher"}
              </span>
            }
            width= {sidebarContent === "viewTeacher" ? "30%" : "60%"}
            height="100%"
          >
            {renderSidebarContent()}
          </SidebarSlide>
      </DashLayout>
    </Layout>
  );
};

export default AllTeachers;
