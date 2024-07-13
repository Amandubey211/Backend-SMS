import React from "react";
import { FaEllipsisV } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { TbBookmark } from "react-icons/tb";
import { BsPatchCheckFill } from "react-icons/bs";
import { GoDiscussionClosed } from "react-icons/go";
import { NavLink, useParams } from "react-router-dom";

const DiscussionCard = ({ discussion }) => {
  const { sid, cid } = useParams();
  console.log("discussion",discussion)
  return (
    <div className="p-4 bg-white shadow rounded-lg border flex flex-col">
      
      <div className="p-3">
      <NavLink to={`/student_class/${cid}/section/${sid}/pages/${discussion._id}/view`}>
        <div className="flex items-center justify-center mb-4">
          <GoDiscussionClosed className="w-16 h-16 p-2 border rounded-full text-green-500" />
        </div>
        <div className="text-lg flex justify-center border-b pb-2">
          <span> {discussion.title}</span>
        </div>
      </NavLink>
      </div>
     
        <div className="flex justify-around space-x-4">
          <div className="flex flex-col ">
            <span className="font-semibold text-lg">
             Publish 
            </span>
            <span className="text-sm text-gray-500">Mar 13,2024</span>
          </div>
          
          <div className="flex flex-col ">
            <span className="font-semibold text-lg">
             Update 
            </span>
            <span className="text-sm text-gray-500">Mar 26,2024</span>
          </div>

          
        </div>
      {/* </div> */}
    </div>
  );
};

export default DiscussionCard;



// import React from "react";
// import { GoFile } from "react-icons/go";
// import { IoCalendarOutline } from "react-icons/io5";
// import { NavLink, useParams } from "react-router-dom";

// const DiscussionCard = ({ discussion }) => {
//   const { sid, cid } = useParams();
//   return (
//     <div className="p-4 bg-white shadow rounded-lg border flex flex-col">
//       <NavLink to={`/student_class/${sid}/pages/${discussion.id}/view`}>
//         <div className="flex items-center justify-center mb-4">
//           <GoFile className="w-16 h-16 p-2 text-green-500" />
//         </div>
//         <div className="text-lg font-semibold text-center mb-2">
//           {discussion.title}
//         </div>
//         <div className="flex  items-center justify-center text-sm text-gray-500 mb-2">
//           <IoCalendarOutline className="mr-1" />
//           <span>Publish {discussion.publishDate}</span>
//         </div>
//         <div className="flex items-center justify-center text-sm text-gray-500">
//           <IoCalendarOutline className="mr-1" />
//           <span>Update {discussion.updateDate}</span>
//         </div>
//       </NavLink>
//     </div>
//   );
// };

// export default DiscussionCard;
