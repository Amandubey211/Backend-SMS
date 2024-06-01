import React from "react";
import HomeBackground from "../../Assets/HomeAssets/HomeBackground.png";
import HomeLeft from "./HomeLeft";
import Layout from "../../Components/Common/Layout";
const home = () => {
  return (
    <Layout title="Student Diwan">
      <div className="grid grid-cols-1 md:grid-cols-12 h-screen">
        <div className="md:col-span-7  flex items-center justify-center">
          <HomeLeft />
        </div>
        <div className="md:col-span-5 relative">
          <img
            src={HomeBackground}
            alt="Placeholder"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </Layout>
  );
};

export default home;
