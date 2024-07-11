import React from "react";
import ParentLoginBanner from "../../../Assets/ParentAssets/ParentLoginBanner.png";
import ParentForm from "./ParentForm";
import Layout from "../../../Components/Common/Layout";
const ParentLogin = () => {
  return (
    <Layout title="Parent Login | Student diwan">
      <div className="grid grid-cols-1 md:grid-cols-12 h-screen">
        <div className="md:col-span-7  flex items-center justify-center">
          <ParentForm />
        </div>
        <div className="md:col-span-5 relative">
          <div className="max-h-screen overflow-hidden">
            <img
              src={ParentLoginBanner}
              alt="Placeholder"
              className="w-full h-screen object-cover"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ParentLogin;
