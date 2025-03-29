import React from 'react';
import MyChildAttendance from '../../../Components/Parents/ChildAttendance/MyChildAttendance';
import Layout from "../../../Components/Common/Layout";
import ParentDashLayout from "../../../Components/Parents/ParentDashLayout";

function ChildrenAttendance() {
  return (
    <Layout title="Parents | Child Attendance">
      <ParentDashLayout>
        <MyChildAttendance />
      </ParentDashLayout>
    </Layout>
  );
}

export default ChildrenAttendance;
