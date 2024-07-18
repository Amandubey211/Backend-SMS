import React, { useEffect, useState } from "react";
import Layout from '../../../../Components/Common/Layout';
import DashLayout from '../../../../Components/Admin/AdminDashLayout';
import SidebarSlide from '../../../../Components/Common/SidebarSlide';
import ViewAccountant from "./ViewAccountant";
import ProfileCard from '../SubComponents/ProfileCard'; // Import the generic ProfileCard
import { useSelector } from "react-redux";
import useGetAllStaff from "../../../../Hooks/AuthHooks/Staff/Admin/staff/useGetAllStaff";
import AddUser from "../StaffProfile/AddUser";

const AllAccountants = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [selectedAccountant, setSelectedAccountant] = useState(null);
  const [accountantData, setAccountantData] = useState(null);
  const allAccountant = useSelector((store) => store.Staff.allAccountant);
  const { fetchStaff } = useGetAllStaff();

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleAccountantClick = (accountant) => {
    setSelectedAccountant(accountant);
    setSidebarContent("viewAccountant");
    setSidebarOpen(true);
  };

  const handleAddAccountantClick = () => {
    setSidebarContent("addAccountant");
    setSidebarOpen(true);
    setAccountantData(null);
  };

  const editUser = (event, accountant) => {
    event.stopPropagation();
    setSidebarContent("editAccountant");
    setSidebarOpen(true);
    setAccountantData(accountant);
  };

  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewAccountant":
        return <ViewAccountant accountant={selectedAccountant} />;
      case "addAccountant":
        return <AddUser role={'accountant'} data={accountantData} />;
      case "editAccountant":
        return <AddUser role={'accountant'} data={accountantData} />;
      default:
        return <div>Select an action</div>;
    }
  };

  return (
    <Layout title="All Accountants">
      <DashLayout>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Accountants</h2>
            <button onClick={handleAddAccountantClick}
              className="bg-purple-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
              <span>Add New Accountant</span>
            </button>
          </div>
          <div className="flex flex-wrap -mx-2">
            {allAccountant.map((accountant, index) => (
              <ProfileCard
                key={index}
                profile={accountant}
                onClick={handleAccountantClick}
                editUser={editUser} // Pass the editUser function as a prop
              />
            ))}
          </div>
          <SidebarSlide
            key={sidebarContent} // Use the key to force re-render
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={<span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
              {sidebarContent === "viewAccountant" ? "Quick View of Accountant" : "Add/Edit Accountant"}
            </span>}
            width="70%"
          >
            {renderSidebarContent()}
          </SidebarSlide>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default AllAccountants;



//---------Asli-----


// import React, { useState } from "react";
// import { dummyAccountants } from './dummyData/dummyData'; // Import accountant data
// import { FiUserPlus } from 'react-icons/fi';
// import { BiTrash } from 'react-icons/bi';
// import Layout from '../../../../Components/Common/Layout';
// import DashLayout from '../../../../Components/Admin/AdminDashLayout';
// import SidebarSlide from '../../../../Components/Common/SidebarSlide';
// import AddAccountant from "./AddAccountant";
// import ViewAccountant from "./ViewAccountant";

// const AllAccountants = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [sidebarContent, setSidebarContent] = useState(null);
//   const [selectedAccountant, setSelectedAccountant] = useState(null);

//   const handleSidebarOpen = () => setSidebarOpen(true);
//   const handleSidebarClose = () => setSidebarOpen(false);

//   const handleAccountantClick = (accountant) => {
//     setSelectedAccountant(accountant);
//     setSidebarContent("viewAccountant");
//     setSidebarOpen(true);
//   };

//   const handleAddAccountantClick = () => {
//     setSidebarContent("addAccountant");
//     setSidebarOpen(true);
//   };

//   const renderSidebarContent = () => {
//     switch (sidebarContent) {
//       case "viewAccountant":
//         return <ViewAccountant accountant={selectedAccountant} />;
//       case "addAccountant":
//         return <AddAccountant />;
//       default:
//         return <div>Select an action</div>;
//     }
//   };

//   return (
//     <Layout title="All Accountants">
//       <DashLayout>
//         <div className="p-4">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">All Accountants</h2>
//             <button onClick={handleAddAccountantClick}
//               className="bg-purple-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
//               <FiUserPlus />
//               <span>Add New Accountant</span>
//             </button>
//           </div>
//           <div className="flex flex-wrap -mx-2">
//             {dummyAccountants.map((accountant, index) => (
//               <div className="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4 flex flex-col" key={index}>
//                 <div onClick={() => handleAccountantClick(accountant)}
//                   className="block p-6 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition cursor-pointer"
//                 >
//                   {/* Accountant Card Content */}

//                   <div className="absolute right-0 flex flex-col px-4 gap-2 justify-end">
//                     <button className="bg-transparent p-2 rounded-full border">
//                       <FiUserPlus className="text-sm text-green-500" />
//                     </button>
//                     <button className="bg-transparent p-2 rounded-full border">
//                       <BiTrash className="text-sm text-red-500" />
//                     </button>
//                   </div>
//                   <div className="flex flex-col h-[80%] justify-center items-center py-3">
//                     <img className="object-cover rounded-full w-[100px] h-[100px]" src={accountant.imageUrl} alt={accountant.name} />
//                     <h3 className="text-lg font-medium">{accountant.name}</h3>
//                     <p className="text-gray-500">{accountant.subject}</p>
//                   </div>
//                   <div className="p-4 text-center justify-center items-center">
//                     <p className="text-gray-600 ">Phone: </p>
//                     <p className="text-gray-600 ">{accountant.phone}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <SidebarSlide
//             isOpen={isSidebarOpen}
//             onClose={handleSidebarClose}
//             title={<span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
//               {sidebarContent === "viewAccountant" ? "Quick View of Accountant" : "Add New Accountant"}
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

// export default AllAccountants;
