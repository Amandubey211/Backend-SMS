import React from "react";
import Layout from "../../../../../Components/Common/Layout";
import StudentSpecificReportCard from "./StudentSpecificReportCard";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";
import StudentDashLayout from "../../../../../Components/Student/StudentDashLayout";


const SRCLayout = () => {
    useNavHeading(` My Report Card`);

    return (
        <Layout title={`Report Card | Student diwan`}>
            <StudentDashLayout children={<StudentSpecificReportCard />} />;
        </Layout>
    );
};

export default SRCLayout;
