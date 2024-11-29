import React from 'react';
import presentIcon from '../../../Assets/ParentAssets/svg/present.svg';
import absentIcon from '../../../Assets/ParentAssets/svg/absent.svg';
import leaveIcon from '../../../Assets/ParentAssets/svg/leave.png';

export const dateCellRender = (value, attendanceData) => {
  const listData = attendanceData.filter(entry => 
    new Date(entry.date).toDateString() === value.toDate().toDateString()
  );

  return (
    <ul className="events">
      {listData?.map((item) => {
        let icon;
        switch (item.status) {
          case 'present':
            icon = <img src={presentIcon} alt="Present" className="icon-class" />;
            break;
          case 'absent':
            icon = <img src={absentIcon} alt="Absent" className="icon-class" />;
            break;
          case 'leave':
            icon = <img src={leaveIcon} alt="Leave" className="icon-class" />;
            break;
          default:
            return null;
        }
        return (
          <li key={item.date}>
            {icon} {item.status.charAt(0).toUpperCase() + item.status?.slice(1)}
          </li>
        );
      })}
    </ul>
  );
};
