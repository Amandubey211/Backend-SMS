import React from "react";
import Layout from "../../../Components/Common/Layout";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import TimeTableDash from "./TimeTableDash";

const Timetable = () => {
  useNavHeading("Time Table");
  return (
    <Layout title={"Timetable | Student Diwan"}>
      <DashLayout children={<TimeTableDash />} hideSearchbar={true} />
    </Layout>
  );
};

export default Timetable;
