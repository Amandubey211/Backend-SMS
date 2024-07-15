// import React, { useState } from "react";
// import { AiOutlineEdit } from "react-icons/ai";
// import { FaBan } from "react-icons/fa6";
// import { HiOutlineDotsVertical } from "react-icons/hi";
// import { BsChat } from "react-icons/bs";
// // import Sidebar from "../../../../../../../Components/Common/Sidebar";
// import DiscussionMessage from "../../DiscussionMessage/DiscussionMessage";
// import Sidebar from "../../../../../../../../Components/Common/Sidebar";
// // Sidebar
// const Header = () => {

  
//   return (
//     <div className="flex items-end justify-between p-2 px-4 border-b">
//       <div className="flex items-center">
//         {/* <img
//           src="https://avatars.githubusercontent.com/u/109097090?v=4"
//           alt="Profile"
//           className="w-10 h-10 rounded-full"
//         /> */}
//         <div className="ml-3">
//           <h1 className="text-lg font-semibold">Bangladesh topic</h1>
//           <p className="text-sm text-green-600">Cameron Williamson</p>
//         </div>
//       </div>
     
//     </div>
//   );
// };

// export default Header;

import React from 'react';
import { FaArrowLeft } from 'react-icons/fa'; // Import back arrow icon
import { useNavigate } from 'react-router-dom'; // For navigation

const Header = () => {
  const navigate = useNavigate(); // Hook to access navigation

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="flex items-center justify-between p-2 px-4 border-b">
      <div className="flex items-center">
        <button onClick={handleBackClick} className="text-xl mr-3">
          <FaArrowLeft />
        </button>
        <div className="ml-3">
          <h1 className="text-lg font-semibold">Our Bangladesh</h1>
          <p className="text-sm text-gray-600">Last Edit: 02/10/2024</p>
        </div>
      </div>
    
    </div>
  );
};

export default Header;
