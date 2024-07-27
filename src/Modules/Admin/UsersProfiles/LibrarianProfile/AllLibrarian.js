import React, { useEffect, useState } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";
import ViewLibrarian from "./ViewLibrarian";
import ProfileCard from '../SubComponents/ProfileCard';
import useGetAllStaff from "../../../../Hooks/AuthHooks/Staff/Admin/staff/useGetAllStaff";
import { useSelector } from "react-redux";
import AddUser from "../StaffProfile/AddUser";

const AllLibrarian = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [selectedLibrarian, setSelectedLibrarian] = useState(null);
  const [librarianData, setLibrarianData] = useState(null);
  const allLibrarian = useSelector((store) => store.Staff.allLibrarian);
  const { fetchStaff } = useGetAllStaff();

  useEffect(() => {
    fetchStaff();
    console.log(allLibrarian);
  }, [fetchStaff]);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleAppointmentClick = (librarian) => {
    setSelectedLibrarian(librarian);
    setSidebarContent("viewLibrarian");
    setSidebarOpen(true);
  };

  const handleAddLibrarianClick = () => {
    setSidebarContent("addLibrarian");
    setSidebarOpen(true);
    setLibrarianData(null);
  };

  const editUser = (event, librarian) => {
    event.stopPropagation();
    setSidebarContent("editLibrarian");
    setSidebarOpen(true);
    setLibrarianData(librarian);
  };

  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewLibrarian":
        return <ViewLibrarian librarian={selectedLibrarian} />;
      case "addLibrarian":
        return <AddUser role="libranian" data={librarianData} />;
      case "editLibrarian":
        return <AddUser role="libranian" data={librarianData} />;
      default:
        return <div>Select an action</div>;
    }
  };

  return (
    <Layout title="All Librarian">
      <DashLayout>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Librarian</h2>
            <button
              onClick={handleAddLibrarianClick}
              className="bg-purple-500 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            >
              <span>Add New Librarian</span>
            </button>
          </div>
          <div className="flex flex-wrap -mx-2">
            {allLibrarian.map((librarian, index) => (
              <ProfileCard
                key={index}
                profile={librarian}
                onClick={handleAppointmentClick}
                editUser={editUser}
              />
            ))}
          </div>
          <SidebarSlide
            key={sidebarContent} // Use the key to force re-render
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                {sidebarContent === "viewLibrarian" ? "Quick View of Librarian" : "Add/Edit Librarian"}
              </span>
            }
            width="70%"
          >
            {renderSidebarContent()}
          </SidebarSlide>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default AllLibrarian;






//---------------Asli------------


// import React, { useState } from "react";
// import { dummyTeachers } from './dummyData/dummyData'; // Assuming dummyTeachers has librarian data
// import { FiUserPlus } from 'react-icons/fi';
// import { BiTrash } from 'react-icons/bi';
// // import Layout from '../../../Components/Common/Layout';
// // import DashLayout from '../../../Components/Admin/AdminDashLayout';
// import SidebarSlide from '../../../../Components/Common/SidebarSlide';
// import AddLibrarian from "./AddLibrarian";
// import ViewLibrarian from "./ViewLibrarian";
// import DashLayout from "../../../../Components/Admin/AdminDashLayout";
// import Layout from "../../../../Components/Common/Layout";

// const AllLibrarian = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [sidebarContent, setSidebarContent] = useState(null);
//   const [selectedLibrarian, setSelectedLibrarian] = useState(null);

//   const handleSidebarOpen = () => setSidebarOpen(true);
//   const handleSidebarClose = () => setSidebarOpen(false);

//   const handleAppointmentClick = (librarian) => {
//     setSelectedLibrarian(librarian);
//     setSidebarContent("viewLibrarian");
//     setSidebarOpen(true);
//   };

//   const handleAddLibrarianClick = () => {
//     setSidebarContent("addLibrarian");
//     setSidebarOpen(true);
//   };

//   const renderSidebarContent = () => {
//     switch (sidebarContent) {
//       case "viewLibrarian":
//         return <ViewLibrarian librarian={selectedLibrarian} />;
//       case "addLibrarian":
//         return <AddLibrarian />;
//       default:
//         return <div>Select an action</div>;
//     }
//   };

//   return (
//     <Layout title="All Librarian">
//       <DashLayout>
//         <div className="p-4">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">All Librarian</h2>
//             <button onClick={handleAddLibrarianClick}
//               className="bg-purple-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
//               <FiUserPlus />
//               <span>Add New Librarian</span>
//             </button>
//           </div>
//           <div className="flex flex-wrap -mx-2">
//             {dummyTeachers.map((librarian, index) => (
//               <div className="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4 flex flex-col" key={index}>
//                 <div onClick={() => handleAppointmentClick(librarian)}
//                   className="block p-6 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition cursor-pointer"
//                 >
//                   <div className="absolute right-0 flex flex-col px-4 gap-2 justify-end">
//                     <button className="bg-transparent p-2 rounded-full border">
//                       <FiUserPlus className="text-sm text-green-500" />
//                     </button>
//                     <button className="bg-transparent p-2 rounded-full border">
//                       <BiTrash className="text-sm text-red-500" />
//                     </button>
//                   </div>
//                   <div className="flex flex-col h-[80%] justify-center items-center py-3">
//                     <img className="object-cover rounded-full w-[100px] h-[100px]" src={librarian.imageUrl} alt={librarian.name} />
//                     <h3 className="text-lg font-medium">{librarian.name}</h3>
//                     <p className="text-gray-500">{librarian.subject}</p>
//                   </div>
//                   <div className="p-4 text-center justify-center items-center">
//                     <p className="text-gray-600 ">Phone: </p>
//                     <p className="text-gray-600 ">{librarian.phone}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <SidebarSlide
//             isOpen={isSidebarOpen}
//             onClose={handleSidebarClose}
//             title={
//               <span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
//                 {sidebarContent === "viewLibrarian" ? "Quick View of Librarian" : "Add New Librarian"}
//               </span>
//             }
//             width="40%"
//           >
//             {renderSidebarContent()}
//           </SidebarSlide>
//         </div>
//       </DashLayout>
//     </Layout>
//   );
// };

// export default AllLibrarian;


// //---------------------------
