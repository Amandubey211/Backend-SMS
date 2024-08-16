import React from 'react';
import Calendar from '../../../Components/Parents/Calendar/Calendar';
import Layout from "../../../Components/Common/Layout";
import AttendanceCard from './AttendanceCard';
import ParentDashLayout from "../../../Components/Parents/ParentDashLayout";

function ChildrenAttendance() {
  return (
    <Layout title="Parent Attendance">
      <ParentDashLayout>
        <AttendanceCard/>
        <Calendar />
      </ParentDashLayout>
    </Layout>
  );
}

export default ChildrenAttendance;
