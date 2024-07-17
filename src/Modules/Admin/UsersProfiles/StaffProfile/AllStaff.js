import React, { useEffect, useState } from "react";
import { dummyStaff } from './dummyData/dummyData';  // Import staff data
import Layout from '../../../../Components/Common/Layout';
import DashLayout from '../../../../Components/Admin/AdminDashLayout';
import SidebarSlide from '../../../../Components/Common/SidebarSlide';
import ViewStaff from "./ViewStaff";
import ProfileCard from "../SubComponents/ProfileCard";
import useGetAllStaff from "../../../../Hooks/AuthHooks/Staff/Admin/staff/useGetAllStaff";
import { useSelector } from "react-redux";
import AddUser from "./AddUser";


const AllStaff = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const staff = useSelector((store) => store.Staff.allStaff);
const {fetchStaff}= useGetAllStaff()
  useEffect(() => {
    fetchStaff()
    // fetchSubjects(cid);
    console.log(staff );
  }, []);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleStaffClick = (staff) => {
    setSelectedStaff(staff);
    setSidebarContent("viewStaff");
    setSidebarOpen(true);
  };

  const handleAddStaffClick = () => {
    setSidebarContent("addStaff");
    setSidebarOpen(true);
  };

  // Function to handle deleting a staff (the implementation would depend on your application's context)
  const handleDeleteStaff = (staff) => {
    console.log('Deleting staff:', staff);
    // Placeholder for actual delete logic
  };

  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewStaff":
        return <ViewStaff staff={selectedStaff} />;
      case "addStaff":
        return <AddUser role = {'staff'} />;
      default:
        return <div>Select an action</div>;
    }
  };
  
  return (
    <Layout title="All Staff">
      <DashLayout>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Staff</h2>
            <button onClick={handleAddStaffClick}
              className="bg-purple-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
              <span>Add New Staff</span>
            </button>
          </div>
          <div className="flex flex-wrap -mx-2">
            {staff.map(( profile, index) => (
              <ProfileCard
                key={index}
                profile={ profile}
                onClick={handleStaffClick}
              />
            ))}
          </div>
          <SidebarSlide
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={<span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
              {sidebarContent === "viewStaff" ? "Quick View of Staff" : "Add New Staff"}
            </span>}
            width="70%"
            height='auto'
          >
            {renderSidebarContent()}
          </SidebarSlide>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default AllStaff;


//------------Asloi---------


// import React, { useState } from "react";
// import { dummyStaff } from './dummyData/dummyData';  // Import staff data
// import { FiUserPlus } from 'react-icons/fi';
// import { BiTrash } from 'react-icons/bi';
// import Layout from '../../../../Components/Common/Layout';
// import DashLayout from '../../../../Components/Admin/AdminDashLayout';
// import SidebarSlide from '../../../../Components/Common/SidebarSlide';
// import AddStaff from "./AddStaff";
// import ViewStaff from "./ViewStaff";

// const AllStaff = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [sidebarContent, setSidebarContent] = useState(null);
//   const [selectedStaff, setSelectedStaff] = useState(null);

//   const handleSidebarOpen = () => setSidebarOpen(true);
//   const handleSidebarClose = () => setSidebarOpen(false);

//   const handleStaffClick = (staff) => {
//     setSelectedStaff(staff);
//     setSidebarContent("viewStaff");
//     setSidebarOpen(true);
//   };

//   const handleAddStaffClick = () => {
//     setSidebarContent("addStaff");
//     setSidebarOpen(true);
//   };

//   const renderSidebarContent = () => {
//     switch (sidebarContent) {
//       case "viewStaff":
//         return <ViewStaff staff={selectedStaff} />;
//       case "addStaff":
//         return <AddStaff />;
//       default:
//         return <div>Select an action</div>;
//     }
//   };

//   return (
//     <Layout title="All Staff">
//       <DashLayout>
//         <div className="p-4">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">All Staff</h2>
//             <button onClick={handleAddStaffClick}
//               className="bg-purple-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
//               <FiUserPlus />
//               <span>Add New Staff</span>
//             </button>
//           </div>
//           <div className="flex flex-wrap -mx-2">
//             {dummyStaff.map((staff, index) => (
//               <div className="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4 flex flex-col" key={index}>
//                 <div onClick={() => handleStaffClick(staff)}
//                   className="block p-6 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition cursor-pointer"
//                 >
//                   {/* Staff Card Content */}
//                   <div className="absolute right-0 flex flex-col px-4 gap-2 justify-end">
//                     <button className="bg-transparent p-2 rounded-full border">
//                       <FiUserPlus className="text-sm text-green-500" />
//                     </button>
//                     <button className="bg-transparent p-2 rounded-full border">
//                       <BiTrash className="text-sm text-red-500" />
//                     </button>
//                   </div>
//                   <div className="flex flex-col h-[80%] justify-center items-center py-3">
//                     <img className="object-cover rounded-full w-[100px] h-[100px]" src={staff.imageUrl} alt={staff.name} />
//                     <h3 className="text-lg font-medium">{staff.name}</h3>
//                     <p className="text-gray-500">{staff.subject}</p>
//                   </div>
//                   <div className="p-4 text-center justify-center items-center">
//                     <p className="text-gray-600 ">Phone: </p>
//                     <p className="text-gray-600 ">{staff.phone}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <SidebarSlide
//             isOpen={isSidebarOpen}
//             onClose={handleSidebarClose}
//             title={<span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
//               {sidebarContent === "viewStaff" ? "Quick View of Staff" : "Add New Staff"}
//             </span>}
//             width="40%"
//           >
//             {renderSidebarContent()}
//           </SidebarSlide>
//         </div>
//       </DashLayout>
//     </Layout>
//   );
// };

// export default AllStaff;
