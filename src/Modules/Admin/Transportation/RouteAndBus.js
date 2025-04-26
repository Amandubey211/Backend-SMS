// RouteAndBus.js
import React, { useState } from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import { useTranslation } from "react-i18next";
import { Tabs, Button } from "antd";
import { FaRoute, FaBus } from "react-icons/fa";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";

const { TabPane } = Tabs;

const RouteAndBus = () => {
  const { t } = useTranslation("transportation");
  const [activeTab, setActiveTab] = useState("routes"); // 'routes' or 'buses'
  
  // Set navigation heading
  useNavHeading(t("Transportation"), t("Route & Bus"));

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <Layout title={t("Route & Bus Management") + " | Student diwan"}>
      <DashLayout>
        <div className="p-5">
          <h1 className="text-2xl font-bold mb-4">Route & Bus Management</h1>
          
          {/* Simple tabs */}
          <Tabs activeKey={activeTab} onChange={handleTabChange} className="mb-6">
            <TabPane 
              tab={<span><FaRoute className="mr-2 inline" /> {t("Routes")}</span>} 
              key="routes" 
            />
            <TabPane 
              tab={<span><FaBus className="mr-2 inline" /> {t("Buses")}</span>} 
              key="buses" 
            />
          </Tabs>
          
          {/* Simple content based on active tab */}
          {activeTab === "routes" ? (
            <div>
              <p className="mb-4">Manage routes for transportation system.</p>
              <Button type="primary">Add Route</Button>
            </div>
          ) : (
            <div>
              <p className="mb-4">Manage buses and vehicle assignment.</p>
              <Button type="primary">Add Bus</Button>
            </div>
          )}
        </div>
      </DashLayout>
    </Layout>
  );
};

export default RouteAndBus;