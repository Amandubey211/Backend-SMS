import React, { useEffect } from "react";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import CardSection from "./Components/CardSection";
import TotalEarningGraph from "./TotalEarningGraph";
import SummaryTotalRevenue from "./SummaryTotalRevenue";
import Layout from "../../../../Components/Common/Layout";
import { useDispatch } from "react-redux";
import {
  fetchCardDataRevenue,
  fetchEarningGraph,
} from "../../../../Store/Slices/Finance/Earnings/earningsThunks";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
const EarningMainSection = () => {
  useNavHeading("Finance", "Earnings");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEarningGraph({ groupBy: "month" }));
    dispatch(fetchCardDataRevenue({ year: new Date().getFullYear() }));
  }, [dispatch]);

  return (
    <Layout title="Earning Dashboard | Student Diwan">
      <AdminDashLayout>
        <div className="w-[100%] p-2">
          <ProtectedSection requiredPermission={PERMISSIONS.SHOWS_REVENUE_CARD_DATA_IN_DASHBOARD}>
            <CardSection />
          </ProtectedSection>
          <TotalEarningGraph />
          <SummaryTotalRevenue />
        </div>
      </AdminDashLayout>
    </Layout>
  );
};

export default EarningMainSection;
