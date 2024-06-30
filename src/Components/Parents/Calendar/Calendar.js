import React from 'react';
import { Calendar as AntCalendar } from 'antd';
import { dateCellRender } from '../../../Modules/Parents/utils/dateCellRender';
import './ChildrenAttendance.css';

const Calendar = () => (
  <div className="calendar-container">
    <AntCalendar cellRender={dateCellRender} />
  </div>
);

export default Calendar;
