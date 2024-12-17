import React from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import EarningMainSection from "./EarningMainSection";

const EarningDash = () => {
  return (
    <Layout title="Finance | Earnings">
      <DashLayout>
        <div className="w-full overflow-x-hidden">
          <EarningMainSection />
        </div>
      </DashLayout>
    </Layout>
  );
};

export default EarningDash;
