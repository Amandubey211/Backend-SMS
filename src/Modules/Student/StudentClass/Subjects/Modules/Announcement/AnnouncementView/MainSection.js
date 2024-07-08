// import React from "react";
// import SubjectSideBar from "../../../Component/SubjectSideBar";
// import AnnouncementViewHeader from "./Components/AnnouncementHeader";
// import { assignmentDetails } from "../../Assignments/AssignmentComponents/MockData";

// const MainSection = () => {
//   const { description } = assignmentDetails;
//   return (
//     <div className="flex w-full">
//       <SubjectSideBar />
//       <div className="border-l w-full">
//         <AnnouncementViewHeader />
//         <div className="p-4 bg-white ">
//         <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg mb-4">
//             <img
//               src="https://s3-alpha-sig.figma.com/img/799f/05d7/de5dca43c9f926af7d7e7a944d33810b?Expires=1719792000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ABVpAPyHqGhNhpYMdDHk3i0bWbCvB0odFA1Hi9gmOetAfx~Sj~dZexaPjkqOUzrI16~ooiHKdGmfBIMRJN38KfVnb0cAJg2T-CH6k6-IndZ-YIKHgf-6Ef9~QBzVXstarfK~c-H~l9sYqCQUWtr1kSeLAI26uxQi53QvAE6mo7pwY1HI0o2D6KTJfqtbBWAWEOGunXjDTW7PpehzYIMsIpvWUOe69AH8ln-o0wvpTI5EAJG6Jo47YDPeI1igItIkX2c9d16N71AhzF-kb9~YKTPJWmQ83rROqgkrYdvojYtCmwvY-x~jQhsH2z~8t2713AvXO8xxYyRP8xtDtDuyoA__"
//               alt="Assignment"
//               className="absolute top-0 left-0 w-full h-full object-cover"
//             />
//           </div>
//           <p className="text-gray-700 mb-6">{description}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainSection;






//------------------

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import AnnouncementViewHeader from "./Components/AnnouncementHeader";

const MainSection = () => {
  const { aid } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const token = localStorage.getItem("student:token");

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`http://localhost:8080/admin/announcement/${aid}`, {
          headers: {
            Authorization:token
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch announcement, status: ${response.status}`);
        }

        const data = await response.json();
        console.log("announcement view",data)
        if (data.status) {
          setAnnouncement(data.data);
        } else {
          console.error("Failed to fetch announcement data");
        }
      } catch (error) {
        console.error("Error fetching announcement:", error);
      }
    };

    fetchAnnouncement();
  }, [aid, token]);

  if (!announcement) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-full">
      <SubjectSideBar />
      <div className="border-l w-full">
        <AnnouncementViewHeader />
        <div className="p-4 bg-white ">
          <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg mb-4">
            <img
              src={announcement.attachment || "https://via.placeholder.com/600x400"}
              alt="Announcement"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-semibold mb-4">{announcement.title}</h2>
          <p className="text-gray-700 mb-6">{announcement.content}</p>
          <p className="text-gray-600">Posted by: {announcement.author}</p>
          <p className="text-gray-600">Posted on: {new Date(announcement.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default MainSection;

