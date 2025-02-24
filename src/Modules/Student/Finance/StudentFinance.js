import React, { useState, useEffect } from "react";
import StudentDashLayout from "../../../Components/Student/StudentDashLayout";
import Layout from "../../../Components/Common/Layout";
import FilterContainer from "./FilterContainer";
import FeeTable from "./FeeTable";
import FeeCard from "./FeeCard";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { StudentFinanceDetails } from "../../../Store/Slices/Student/Finance/finance.action";
import { gt } from "../../../Utils/translator/translation";
import Offline from "../../../Components/Common/Offline";
import { setShowError } from "../../../Store/Slices/Common/Alerts/alertsSlice";

const StudentFinance = () => {
  const dispatch = useDispatch();
  const {
    stdFinanceData,
    totalPaidFees,
    totalUnpaidFees,
    error,
    loading,
    filters,
  } = useSelector((store) => store?.student?.studentFinance);

  const { showError } = useSelector((store) => store?.common?.alertMsg);
  const { t } = useTranslation();
  useNavHeading("Finance");
  const { userDetails } = useSelector((store) => store?.common?.user);
  const { userId } = userDetails;

  // Filtered Data
  const filteredFeesDetails = stdFinanceData?.length
    ? stdFinanceData.filter(
        (item) =>
          (filters.feesType === "" || item?.feeType === filters.feesType) &&
          (filters.status === "Everyone" || item?.status === filters.status)
      )
    : [];

  const handleDismiss = () => {
    dispatch(setShowError(false));
  };

  useEffect(() => {
    dispatch(StudentFinanceDetails({ studentId: userId }));
  }, [dispatch]);

  console.log("student finance data", filteredFeesDetails, stdFinanceData);

  return (
    <>
      <Layout title="Student Finance">
        <StudentDashLayout>
          <div className="flex ">
            <div className="flex flex-col w-[100%] h-full  m-5">
              {/* Filter always on top */}
              <FilterContainer />

              <FeeTable feesDetails={filteredFeesDetails} />
            </div>

            {/* Summary Card Section */}
            <div className="w-[20%] border border-x border-b border-t-0 p-4">
              <h3 className="mb-5 text-gray-500">
                {t(`Your Finance Details`, gt.stdFinance)}
              </h3>
              <div className="flex flex-col gap-5 ">
                <FeeCard
                  title="Total Unpaid Fees"
                  amount={totalUnpaidFees}
                  buttonText="Pay Now"
                />
                <FeeCard title="Total Paid Fees" amount={totalPaidFees} />
              </div>
            </div>
          </div>
          {!loading && showError && (
            <Offline error={error} onDismiss={handleDismiss} />
          )}
        </StudentDashLayout>
      </Layout>
    </>
  );
};

export default StudentFinance;
