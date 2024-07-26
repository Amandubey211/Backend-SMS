import TimelineItem from "antd/es/timeline/TimelineItem";
import React from "react";
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';

import { Bs0CircleFill } from "react-icons/bs";

const StudentProfile = ({student}) => {
  

  return (
    <div className="bg-white  h-screen  px-7 py-2 ">
    <h2 className="text-base font-normal text-gray-600 mb-3">Education</h2>
    <VerticalTimeline className="border-l-4 border-l-black" >
    {[1,2,3,4,5].map((item)=>(
        <VerticalTimelineElement
        className="vertical-timeline-element--work"
        contentArrowStyle={{ borderRight: '7px solid lightblue' }}
        iconStyle={{ 
          background: 'black', 
          color: 'white', 
          boxShadow: '0 0 0 4px black', 
          border: '2px solid black', 
          borderRadius: '50%', 
          width: '3px', 
          height: '3px', 
          lineHeight: '30px', 
          textAlign: 'center', 
          fontSize: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginLeft:'-.2rem'
        }}
        >
       <div className="px-10  flex flex-col my-[-.7rem] h-[5rem]">
       <h3 className="vertical-timeline-element-title ">2008 - 2009</h3>
       <h4 className="vertical-timeline-element-subtitle text-gray-600"> high schooling at xyz school      </h4>
       </div>
      </VerticalTimelineElement>
    ))}
    </VerticalTimeline>
  </div>
  );
};



export default StudentProfile;
