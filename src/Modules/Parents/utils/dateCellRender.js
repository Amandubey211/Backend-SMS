import React from 'react';
import { Badge } from 'antd';

export const dateCellRender = (value, attendanceData) => {
  const listData = attendanceData.filter(entry => 
    new Date(entry.date).toDateString() === value.toDate().toDateString()
  );

  return (
    <ul className="events">
      {listData.map((item) => (
        <li key={item.date}>
          <Badge status={item.status === 'present' ? 'success' : 'error'} text={item.status} />
        </li>
      ))}
    </ul>
  );
};
