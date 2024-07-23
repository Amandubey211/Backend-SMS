

// import React, { useState } from "react";
// import DiscussionCard from "./Components/PageCard";
// import PinnedDiscussions from "./Components/PinnedPages";
// import DiscussionHeader from "./Components/PageHeader";
// import { MdKeyboardArrowDown } from "react-icons/md";
// import { GoDiscussionClosed } from "react-icons/go";
// import { RiAddFill } from "react-icons/ri";
// import { NavLink, useParams } from "react-router-dom";
// import dummyDiscussionData from "./DummyData/dummyDiscussionData";
// import SubjectSideBar from "../../Component/SubjectSideBar";

// const MainSection = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const { cid, sid } = useParams();
//   const handleSearch = (query) => {
//     setSearchQuery(query);
//   };

//   const filteredDiscussions = dummyDiscussionData.filter((discussion) =>
//     discussion.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="flex  ">
//       <SubjectSideBar/>
//       <div className="w-full p-3 border-l">
//         <DiscussionHeader onSearch={handleSearch} />
//         <PinnedDiscussions />
//         <div className=" p-3 ">
//           <div className="flex items-center gap-2 ml-3 mb-2">
//             <GoDiscussionClosed className="text-xl text-green-600" />
//             <h2 className="text-xl "> All Discussions</h2>
//             <MdKeyboardArrowDown className="text-gray-500 h-8 w-8" />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {filteredDiscussions.map((discussion, index) => (
//               <DiscussionCard key={index} discussion={discussion} />
//             ))}
//           </div>
//         </div>
//         {/* <NavLink
//           to={`/class/${cid}/${sid}/create_discussion`}
//           className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4"
//         >
//           <RiAddFill size={24} />
//         </NavLink> */}
//       </div>
//     </div>
//   );
// };

// export default MainSection;


import React, { useState, useEffect } from "react";
import DiscussionCard from "./Components/PageCard";
import PinnedDiscussions from "./Components/PinnedPages";
import DiscussionHeader from "./Components/PageHeader";
import { MdKeyboardArrowDown } from "react-icons/md";
import { GoDiscussionClosed } from "react-icons/go";
import { RiAddFill } from "react-icons/ri";
import { NavLink, useParams } from "react-router-dom";
import SubjectSideBar from "../../Component/SubjectSideBar";
import { toast } from 'react-hot-toast';
import { baseUrl } from "../../../../../../config/Common";

const MainSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pages, setPages] = useState([]);
  const { cid, sid } = useParams();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const token = localStorage.getItem('student:token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(`${baseUrl}/student/pages`, {
          headers: {
            'Authentication': token
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch pages, status: ${response.status}`);
        }

        const data = await response.json();
        setPages(data); // Update state with fetched pages
      } catch (error) {
        console.error("Failed to fetch pages:", error);
        toast.error("Failed to fetch pages: " + error.message);
      }
    };

    fetchPages();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-full p-3 border-l">
        <DiscussionHeader onSearch={handleSearch} />
        <PinnedDiscussions />
        <div className="p-3">
          <div className="flex items-center gap-2 ml-3 mb-2">
            <GoDiscussionClosed className="text-xl text-green-600" />
            <h2 className="text-xl"> All Discussions</h2>
            <MdKeyboardArrowDown className="text-gray-500 h-8 w-8" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredPages.map((page, index) => (
              <DiscussionCard key={index} discussion={page} />
            ))}
          </div>
        </div>
        {/* <NavLink
          to={`/ class/ ${ cid } / ${ sid } / create_discussion`}
          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4"
        >
          <RiAddFill size={24} />
        </NavLink> */}
      </div>
    </div>
  );
};

export default MainSection;
