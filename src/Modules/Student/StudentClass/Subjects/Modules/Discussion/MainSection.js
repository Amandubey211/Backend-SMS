// import React, { useState } from "react";
// import DiscussionCard from "./Components/DiscussionCard";
// import PinnedDiscussions from "./Components/PinnedDiscussions";
// import DiscussionHeader from "./Components/DiscussionHeader";
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

//       </div>
//     </div>
//   );
// };

// export default MainSection;




import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DiscussionCard from "./Components/DiscussionCard";
import PinnedDiscussions from "./Components/PinnedDiscussions";
import DiscussionHeader from "./Components/DiscussionHeader";
import { MdKeyboardArrowDown } from "react-icons/md";
import { GoDiscussionClosed } from "react-icons/go";
import SubjectSideBar from "../../Component/SubjectSideBar";

const MainSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cid } = useParams();

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const token = localStorage.getItem("student:token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`http://localhost:8080/admin/getDiscussion/class/${cid}`, {
          headers: {
            // 'Authorization': token,

            'Authentication': token
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch discussions, status: ${response.status}`);
        }

        const data = await response.json();
        console.log("data in discussion", data)
        if (data.status && data.data) {
          setDiscussions(data.data);
        } else {
          console.error("No discussion data or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch discussions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, [cid]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredDiscussions = discussions.filter((discussion) =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

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
            {filteredDiscussions.map((discussion) => (
              <DiscussionCard key={discussion._id} discussion={discussion} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
