import React, { useState, useEffect } from "react";
import StudentDashLayout from "../../../Components/Student/StudentDashLayout";
import Layout from "../../../Components/Common/Layout";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import StudentFinances from '../../Admin/UsersProfiles/StudentProfile/Components/FinanceMenu/StudentFinance'

const StudentFinance = () => {

  const { t } = useTranslation();
  useNavHeading("Finance");
  const { userDetails } = useSelector((store) => store?.common?.user);
  const { userId } = userDetails;

  return (
    <>
      <Layout title="Student Finance">
        <StudentDashLayout>
          <StudentFinances studentId={userId}/>
        </StudentDashLayout>
      </Layout>
    </>
  );
};

export default StudentFinance;
