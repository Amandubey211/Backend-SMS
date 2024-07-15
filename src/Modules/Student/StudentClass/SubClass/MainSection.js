// // src/components/MainSection.js
// import React, { useState } from "react";
// import NavIconCard from "./Components/NavIconCard";
// import ButtonGroup from "./Components/ButtonGroup";
// import dummyData from "./DummyData/dummyData";
// import SubjectCard from "./SubjectCard";
// import { useParams } from "react-router-dom";
// import { FaSchool } from "react-icons/fa";
// import { SlEyeglass } from "react-icons/sl";
// import { FcGraduationCap,FcCalendar } from "react-icons/fc";
// const colors = [
//   "bg-yellow-300",
//   "bg-blue-300",
//   "bg-green-300",
//   "bg-red-300",
//   "bg-purple-300",
//   "bg-pink-300",
// ];

// const getColor = (index) => {
//   return colors[index % colors.length];
// };

// const MainSection = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const { cid } = useParams();
//   const iconData = [
//     { icon: <SlEyeglass className="text-purple-600"/>, text: "20 Teacher Assigned", url: `/class/${cid}/teachers` },
//     {
//       icon: <FaSchool className="text-yellow-600"/>,
//       text: "3 Section | 11 Groups",
//       url: `/class/${cid}/section_group`,
//     },
//     { icon: <FcGraduationCap/>, text: "250 Students", url: `/class/${cid}/students` },
//     { icon: <FcCalendar/>, text: "Attendance", url: `/class/${cid}/attendance` },
//   ];



//   const handleCloseSidebar = () => {
//     setIsSidebarOpen(false);
//   };

//   return (
//     <>
//       {/* <div className="flex-1 flex  gap-3 w-full p-2 py-4"> */}
//       <div className="flex flex-wrap justify-center gap-3 p-4 ">
//         {iconData.map((item, index) => (
//           <NavIconCard
//             key={index}
//             icon={item.icon}
//             text={item.text}
//             url={item.url}
//           />
//         ))}
//       </div>
//       <div className=" px-5">
//         <div className="grid grid-cols-3 gap-4">
//           {dummyData.map((data, index) => (
//             <SubjectCard
//               key={index}
//               data={data}
//               Class={cid}
//               backgroundColor={getColor(index)}
//             />
//           ))}
//         </div>
//       </div>

//     </>
//   );
// };

// export default MainSection;


//------------------------
import React, { useState, useEffect } from "react";
import NavIconCard from "./Components/NavIconCard";
import { useDispatch, useSelector } from "react-redux";
import ButtonGroup from "./Components/ButtonGroup";
import SubjectCard from "./SubjectCard";
import { useParams } from "react-router-dom";
import { FaSchool } from "react-icons/fa";
import { SlEyeglass } from "react-icons/sl";
import { FcGraduationCap, FcCalendar } from "react-icons/fc";
import { setSelectedClass, setSelectedClassName, setSelectedSubjectName,setSelectedSection, setSelectedSubject } from "../../../../Redux/Slices/Common/CommonSlice";

const colors = [
  "bg-yellow-300",
  "bg-blue-300",
  "bg-green-300",
  "bg-red-300",
  "bg-purple-300",
  "bg-pink-300",
];

const getColor = (index) => {
  return colors[index % colors.length];
};

const MainSection = () => {
  const dispatch = useDispatch();
  const [classData, setClassData] = useState(null);
  const { cid } = useParams();
  console.log("class ud ", cid)
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const token = localStorage.getItem('student:token');
        console.log("token--",token);
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch('http://localhost:8080/student/my_class', {
          headers: {
            'Authentication': token,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch class data, status: ${response.status}`);
        }

        const data = await response.json();
        console.log("data is in main section sub class  ", data);
        console.log("classnameesss ", data.data.className);

        if (data.status && data.data) {
          setClassData(data.data);
          dispatch(setSelectedClass(data.data.classId));
          dispatch(setSelectedClassName(data.data.className))
          dispatch(setSelectedSection(data.data.section.sectionId));
        } else {
          console.error("No class data or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch class data:", error);
      }
    };

    fetchClassData();
  }, [cid]);

  const handleSubjectClick = ({subjectId,subjectName}) => {
    // const handleSubjectClick = (subjectId) => {
    console.log("Subject ID clicked:", subjectId);
    console.log("Subject NAME clicked:", subjectName);

    dispatch(setSelectedSubject(subjectId));
    dispatch(setSelectedSubjectName(subjectName))
  };

  if (!classData) {
    return <div>Loading...</div>;
  }
  console.log("class data", classData)

  const iconData = [
    { icon: <SlEyeglass className="text-purple-600" />, text: `${classData.teachersCount} My Class Instructor`, url: `/student_class/class/${cid}/teachers` },
    {
      icon: <FaSchool className="text-yellow-600" />,
      text: `${classData.section?.sectionName || 'No Section'} | ${classData.groups ? classData.groups.length : 0} Section`,
      // url: `/class/${cid}/section_group`,
      url: `/student_class/class/${cid}/teachers`
    },

    {
      icon: <FcGraduationCap />, text: `${classData.classmatesCount} Classmate`,
      // url: `/class/${cid}/students` 
      url: `/student_class/class/${cid}/classmates`
    },
    { icon: <FcCalendar />, text: "Attendance", url: `/class/${cid}/attendance` },
  ];
  // const iconData = [
  //   { icon: <SlEyeglass className="text-purple-600" />, text: `${classData.teachersCount} Teacher Assigned`, url: `/class/${cid}/teachers` },
  //   {
  //     icon: <FaSchool className="text-yellow-600" />,
  //     text: `${classData.section?.sectionName || 'No Section'} | ${classData.groups ? classData.groups.length : 0} Groups`,
  //     url: `/class/${cid}/section_group`,
  //   },
  //   { icon: <FcGraduationCap />, text: `${classData.classmatesCount} Students`, url: `/class/${cid}/students` },
  //   { icon: <FcCalendar />, text: "Attendance", url: `/class/${cid}/attendance` },
  // ];

  console.log("icondata", iconData)
  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 p-4 ">
        {iconData.map((item, index) => (
          <NavIconCard
            key={index}
            icon={item.icon}
            text={item.text}
            url={item.url}
          />
        ))}
      </div>
      <div className="px-5">
        <div className="grid grid-cols-3 gap-4">
          {classData.subjects.map((subject, index) => (
            <SubjectCard
              key={index}
              data={subject}
              IDs={classData}
              Class={cid}
              onSubjectClick={handleSubjectClick}
              backgroundColor={getColor(index)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default MainSection;


// import React, { useState, useEffect } from "react";
// import NavIconCard from "./Components/NavIconCard";
// import ButtonGroup from "./Components/ButtonGroup";
// import SubjectCard from "./SubjectCard";
// import { useParams } from "react-router-dom";
// import { FaSchool } from "react-icons/fa";
// import { SlEyeglass } from "react-icons/sl";
// import { FcGraduationCap, FcCalendar } from "react-icons/fc";

// const colors = [
//   "bg-yellow-300",
//   "bg-blue-300",
//   "bg-green-300",
//   "bg-red-300",
//   "bg-purple-300",
//   "bg-pink-300",
// ];

// const getColor = (index) => {
//   return colors[index % colors.length];
// };

// const MainSection = () => {
//   const [subjects, setSubjects] = useState([]);
//   const { cid } = useParams();

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const token = localStorage.getItem("student:token");
//         if (!token) {
//           throw new Error("Authentication token not found");
//         }
//         const response = await fetch(
//           `http://localhost:8080/admin/my_subjects/${cid}`,
//           {
//             headers: {
//               Authentication: token,
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `Failed to fetch subjects for class ${cid}, status: ${response.status}`
//           );
//         }

//         const data = await response.json();
//         if (data.success && data.data) {
//           setSubjects(data.data);
//         } else {
//           console.error("No subject data or unsuccessful response");
//         }
//       } catch (error) {
//         console.error("Failed to fetch subjects:", error);
//       }
//     };

//     fetchSubjects();
//   }, [cid]);

//   return (
//     <>
//       <div className="flex flex-wrap justify-center gap-3 p-4 ">
//         <NavIconCard
//           icon={<SlEyeglass className="text-purple-600" />}
//           text={`20 Teacher Assigned`}
//           url={`/class/${cid}/teachers`}
//         />
//         <NavIconCard
//           icon={<FaSchool className="text-yellow-600" />}
//           text={`3 Section | 11 Groups`}
//           url={`/class/${cid}/section_group`}
//         />
//         <NavIconCard
//           icon={<FcGraduationCap />}
//           text={`250 Students`}
//           url={`/class/${cid}/students`}
//         />
//         <NavIconCard
//           icon={<FcCalendar />}
//           text={`Attendance`}
//           url={`/class/${cid}/attendance`}
//         />
//       </div>
//       <div className=" px-5">
//         <div className="grid grid-cols-3 gap-4">
//           {subjects.map((subject, index) => (
//             <SubjectCard
//               key={index}
//               data={subject}
//               Class={cid}
//               backgroundColor={getColor(index)}
//             />
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default MainSection;
