import React from "react";

// Import SVG icons
import announcementIcon from '../../../Assets/ParentAssets/svg/announcement.svg';
import dashboardIcon from '../../../Assets/ParentAssets/svg/dashboard.svg';
import eventsIcon from '../../../Assets/ParentAssets/svg/events.svg';
import financeIcon from '../../../Assets/ParentAssets/svg/finance.svg';
import libraryIcon from '../../../Assets/ParentAssets/svg/library.svg';
import mychildsIcon from '../../../Assets/ParentAssets/svg/mychilds.svg';
import noticeboardIcon from '../../../Assets/ParentAssets/svg/noticeboard.svg';
import { ImTable2 } from "react-icons/im";


const sidebarData = [
  {
    title: "Dashboard",
    icon: <img src={dashboardIcon} alt="Dashboard Icon" style={{ width: '24px', height: '24px' }} />,
    path: "/parent_dash",
  },
  {
    title: "My Childs",
    icon: <img src={mychildsIcon} alt="Children Icon" style={{ width: '24px', height: '24px' }} />,
    path: `/children`,
  },
  {
    title: "Finance",
    icon: <img src={financeIcon} alt="Finance Icon" style={{ width: '24px', height: '24px' }} />,
    path:'/parentfinance'
  },
  {
    title: "Library",
    icon: <img src={libraryIcon} alt="Library Icon" style={{ width: '24px', height: '24px' }} />,
    path:'/parentlibrary'
  },
  {
    title: "Time Table",
    icon: <ImTable2 style={{ width: '20px', height: '20px', color: 'gray' }}/>,
    path: "/timetable",
  },
  {
    title: "Notice Board",
    icon: <img src={noticeboardIcon} alt="Notice Board Icon" style={{ width: '24px', height: '24px' }} />,
    path: "/parentchildnotice",
  },
  // {
  //   title: "Announcements",
  //   icon: <img src={announcementIcon} alt="Announcements Icon" style={{ width: '24px', height: '24px' }} />,
  //   path: "/parentannounce",
  // },
  {
    title: "Events", // Added Events option
    icon: <img src={eventsIcon} alt="Events Icon" style={{ width: '24px', height: '24px' }} />,
    path: "/parent/events",
  },
];

export default sidebarData;
