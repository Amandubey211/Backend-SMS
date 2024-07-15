// import React from "react";
// import { useParams } from "react-router-dom";
// import Header from "./Components/Header";
// import { assignmentDetails } from "../../Assignments/AssignmentComponents/MockData";
// import SubjectSideBar from "../../../Component/SubjectSideBar";

// const MainSection = () => {
//   const { did } = useParams();
//   console.log(did); // call the get discussion data by this id
//   const { description } = assignmentDetails;
//   return (
//     <div className="flex ">
//       <SubjectSideBar />
//       <div className="border-l">
//         <Header />
//         <div className="p-6 bg-white ">
//           <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg mb-4">
//             <img
//               src="https://s3-alpha-sig.figma.com/img/799f/05d7/de5dca43c9f926af7d7e7a944d33810b?Expires=1719792000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ABVpAPyHqGhNhpYMdDHk3i0bWbCvB0odFA1Hi9gmOetAfx~Sj~dZexaPjkqOUzrI16~ooiHKdGmfBIMRJN38KfVnb0cAJg2T-CH6k6-IndZ-YIKHgf-6Ef9~QBzVXstarfK~c-H~l9sYqCQUWtr1kSeLAI26uxQi53QvAE6mo7pwY1HI0o2D6KTJfqtbBWAWEOGunXjDTW7PpehzYIMsIpvWUOe69AH8ln-o0wvpTI5EAJG6Jo47YDPeI1igItIkX2c9d16N71AhzF-kb9~YKTPJWmQ83rROqgkrYdvojYtCmwvY-x~jQhsH2z~8t2713AvXO8xxYyRP8xtDtDuyoA__"
//               alt="Assignment"
//               className="absolute top-0 left-0 w-full h-full object-cover"
//             />
//           </div>
//           <p className="text-gray-700 mb-6">{description}</p>
//           <p className="text-gray-700 mb-6">{description}</p>
//           <div className="relative"></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainSection;



// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Header from "./Components/Header";
// import SubjectSideBar from "../../../Component/SubjectSideBar";

// const MainSection = () => {
//   const { did } = useParams();
//   const [discussionDetails, setDiscussionDetails] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDiscussionDetails = async () => {
//       try {
//         const token = localStorage.getItem("student:token");
//         if (!token) {
//           throw new Error("Authentication token not found");
//         }

//         const response = await fetch(
//           `http://localhost:8080/admin/getDiscussionById/${did}`,
//           {
//             headers: {
//               Authentication: token,
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`Failed to fetch discussion, status: ${response.status}`);
//         }

//         const data = await response.json();
//         if (data.status) {
//           setDiscussionDetails(data.data);
//         } else {
//           console.error("No discussion data or unsuccessful response");
//         }
//       } catch (error) {
//         console.error("Failed to fetch discussion:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDiscussionDetails();
//   }, [did]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!discussionDetails) {
//     return <div>No discussion details available</div>;
//   }

//   const { title, content, dueDate, availableFrom, availableUntil, createdBy } = discussionDetails;

//   return (
//     <div className="flex">
//       <SubjectSideBar />
//       <div className="border-l">
//         <Header />
//         <div className="p-6 bg-white">
//           <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg mb-4">
//             <img
//               // src="https://s3-alpha-sig.figma.com/img/799f/05d7/de5dca43c9f926af7d7e7a944d33810b?Expires=1719792000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ABVpAPyHqGhNhpYMdDHk3i0bWbCvB0odFA1Hi9gmOetAfx~Sj~dZexaPjkqOUzrI16~ooiHKdGmfBIMRJN38KfVnb0cAJg2T-CH6k6-IndZ-YIKHgf-6Ef9~QBzVXstarfK~c-H~l9sYqCQUWtr1kSeLAI26uxQi53QvAE6mo7pwY1HI0o2D6KTJfqtbBWAWEOGunXjDTW7PpehzYIMsIpvWUOe69AH8ln-o0wvpTI5EAJG6Jo47YDPeI1igItIkX2c9d16N71AhzF-kb9~YKTPJWm"
//               src="https://img.freepik.com/free-vector/group-therapy-illustration_74855-5516.jpg"
//               alt="Discussion"
//               className="absolute top-0 left-0 w-full h-full object-cover"
//             />
//           </div>
//           <h1 className="text-xl font-bold mb-4">{title}</h1>
//           <p className="text-gray-700 mb-6">{content}</p>
//           <p className="text-gray-700 mb-2"><strong>Due Date:</strong> {new Date(dueDate).toLocaleDateString()}</p>
//           <p className="text-gray-700 mb-2"><strong>Available From:</strong> {new Date(availableFrom).toLocaleDateString()}</p>
//           <p className="text-gray-700 mb-2"><strong>Available Until:</strong> {new Date(availableUntil).toLocaleDateString()}</p>
//           <p className="text-gray-700"><strong>Created By:</strong> {createdBy}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainSection;


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Components/Header";
import SubjectSideBar from "../../../Component/SubjectSideBar";

const MainSection = () => {
  const { did } = useParams();
  const [discussionDetails, setDiscussionDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscussionDetails = async () => {
      try {
        const token = localStorage.getItem("student:token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `http://localhost:8080/admin/getDiscussionById/${did}`,
          {
            headers: {
              Authentication: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch discussion, status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status) {
          setDiscussionDetails(data.data);
        } else {
          console.error("No discussion data or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch discussion:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussionDetails();
  }, [did]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!discussionDetails) {
    return <div>No discussion details available</div>;
  }

  const { title, content, dueDate, availableFrom, availableUntil, createdBy } = discussionDetails;

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="border-l">
        <Header />
        <div className="p-6 bg-white">
          <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg mb-4">
            <img
              src="https://s3-alpha-sig.figma.com/img/799f/05d7/de5dca43c9f926af7d7e7a944d33810b?Expires=1719792000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ABVpAPyHqGhNhpYMdDHk3i0bWbCvB0odFA1Hi9gmOetAfx~Sj~dZexaPjkqOUzrI16~ooiHKdGmfBIMRJN38KfVnb0cAJg2T-CH6k6-IndZ-YIKHgf-6Ef9~QBzVXstarfK~c-H~l9sYqCQUWtr1kSeLAI26uxQi53QvAE6mo7pwY1HI0o2D6KTJfqtbBWAWEOGunXjDTW7PpehzYIMsIpvWUOe69AH8ln-o0wvpTI5EAJG6Jo47YDPeI1igItIkX2c9d16N71AhzF-kb9~YKTPJWmQ83rROqgkrYdvojYtCmwvY-x~jQhsH2z~8t2713AvXO8xxYyRP8xtDtDuyoA__"
              alt="Discussion"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-bold mb-4">{title}</h1>
          <p className="text-gray-700 mb-6">{content}</p>
          <p className="text-gray-700 mb-2"><strong>Due Date:</strong> {new Date(dueDate).toLocaleDateString()}</p>
          <p className="text-gray-700 mb-2"><strong>Available From:</strong> {new Date(availableFrom).toLocaleDateString()}</p>
          <p className="text-gray-700 mb-2"><strong>Available Until:</strong> {new Date(availableUntil).toLocaleDateString()}</p>
          <p className="text-gray-700"><strong>Created By:</strong> {createdBy}</p>
        </div>
      </div>
    </div>
  );
};

export default MainSection;

