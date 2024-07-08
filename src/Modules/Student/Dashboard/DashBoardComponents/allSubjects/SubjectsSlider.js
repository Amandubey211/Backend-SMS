// import React from "react";
// import SubjectCard from "./SubjectCard";

// const SubjectsSlider = ({ subjects }) => {
//   return (
//     <div className="overflow-x-auto whitespace-nowrap py-2 flex  gap-2">
//       {subjects.map((subject, index) => (
//         <>
//           <div className="">
//             <SubjectCard key={index} subject={subject} />
//           </div>
//         </>
//       ))}
//     </div>
//   );
// };

// export default SubjectsSlider;


import React from "react";
import SubjectCard from "./SubjectCard";

const SubjectsSlider = ({ subjects }) => {
  return (
    <div className="overflow-y-auto py-2 flex flex-col gap-2" style={{ maxHeight: '700px' }}>
      {subjects.map((subject, index) => (
        <div key={index} className="flex-none">
          <SubjectCard subject={subject} />
        </div>
      ))}
    </div>
  );
};

export default SubjectsSlider;

