
import React ,{useState}from "react";
import { FiLoader, FiUserPlus } from 'react-icons/fi';
import { BiTrash } from 'react-icons/bi';
import useDeleteUser from "../../../../Hooks/AuthHooks/Staff/Admin/staff/useDeleteUser";
import profileIcon from '../../../../Assets/DashboardAssets/profileIcon.png'
import DeleteConfirmatiomModal from "../../../../Components/Common/DeleteConfirmationModal";
import { MdBlock, MdOutlinePublishedWithChanges } from "react-icons/md";
import useEditUser from "../../../../Hooks/AuthHooks/Staff/Admin/staff/useEditUser";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import toast from "react-hot-toast";
import useGetAllStaff from "../../../../Hooks/AuthHooks/Staff/Admin/staff/useGetAllStaff";
import useGetAllTeachers from "../../../../Hooks/AuthHooks/Staff/Admin/Teacher/useGetAllTeacher";
const ProfileCard = ({ profile, onClick,editUser}) => {
  const {deleteUser,loading:deactivateLoading} = useDeleteUser();
 
   const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const deleteTeacher = async()=>{

  
    await deleteUser(profile._id);
    setIsModalOpen(false);

   };
  const {fetchStaff, loading} = useGetAllStaff()
  const {fetchTeachers} = useGetAllTeachers()
  const activateUser = async (event,id)=>{
    event.stopPropagation()
    try {
      const token = localStorage.getItem(`admin:token`);
      const { data } = await axios.put(`${baseUrl}/admin/update_active_status`,{staffId:id,active:true}, {
        headers: { Authentication: token },
      });
      if(data){
      toast.success("User activated successfully!");
     await fetchStaff();
     await  fetchTeachers();

    }
    } catch (err) {
      console.log( err.message);
    }
  }
  return (
    <div className="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
      
      
       <div onClick={() => onClick(profile)}
        className="block p-6 bg-white rounded-lg hover:shadow-lg  transition cursor-pointer border"
      >
        {profile?.active?null:<span className=" flex my-[-.5rem] text-red-600 font-bold text-sm">Deactivated</span>}
        <div className="absolute right-0 top-0 flex flex-col px-4 py-2 gap-2 justify-start">
         {profile?.active? <button className="bg-transparent p-2 rounded-full border hover:bg-gray-200 transition" onClick={(event)=>editUser(event,profile)}>
         {deactivateLoading?     <FiLoader className="animate-spin  w-[1rem] h-[1rem] " /> :  <FiUserPlus className="text-sm text-green-500" />}
          </button>:null}
          {profile?.active? <button className="bg-transparent p-2 rounded-full border hover:bg-gray-200 transition" title="Deactivated">
            <MdBlock className="text-sm text-red-500" onClick={(event)=>{event.stopPropagation();openModal()}} />
          </button>:<button className=" bg-transparent p-2 rounded-full border" title="Activate" >
                    <MdOutlinePublishedWithChanges  className="text-sm text-green-500 " onClick={(event)=>activateUser(event,profile._id)}  />
                    </button>
          }
         
        </div>
        <div className="flex flex-col h-[80%] justify-center items-center py-3">
          <img className="object-cover rounded-full w-[100px] h-[100px] border" src={profile?.profile || profileIcon } alt={profile.firstName} />
          <h3 className="text-lg font-medium">{profile.firstName} {profile.lastName}</h3>
          <p className="text-gray-500">{profile.position}</p>
        </div>
        <div className="p-4 text-center justify-center items-center border-t-2">
          <p className="text-gray-600">Phone: {profile.mobileNumber}</p>
        </div>
      </div>
      {deactivateLoading? '' : <DeleteConfirmatiomModal
  isOpen={isModalOpen}
  onClose={closeModal}
  onConfirm={deleteTeacher}
  text={'Deactivate'}
/>}
    </div>
  );
};

export default ProfileCard;
