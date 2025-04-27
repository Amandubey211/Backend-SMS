import React, { useState } from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import { useTranslation } from "react-i18next";
import RouteList from "../../../Components/Transportation/RouteList";
import { FaRoute } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { MdSubdirectoryArrowRight } from "react-icons/md";
import Sidebar from "../../../Components/Common/Sidebar";
import AddSubRouteModal from "./RouteManagement/Components/AddSubRouteModal";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import RouteForm from "./RouteManagement/Components/AddRouteForm";

const RouteManagement = () => {
  const { t } = useTranslation("transportation");
  useNavHeading(t("Transportation"), t("Route Management"));

  const [sidebar, setSidebar] = useState({
    open: false,
    type: null,
    route: null,
  });
  const [subRouteModal, setSubRouteModal] = useState(false);

  const closeSidebar = () =>
    setSidebar({ open: false, type: null, route: null });

  const handleEditRoute = (route) => {
    setSidebar({ open: true, type: "route", route });
  };

  return (
    <Layout title={`${t("Route Management")} | Student diwan`}>
      <DashLayout>
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <FaRoute size={34} />
              {t("All Routes")}
            </h1>

            <div className="flex gap-3">
              <button
                onClick={() => setSubRouteModal(true)}
                className="px-4 py-2 rounded-lg border border-[#C83B62] text-[#C83B62] hover:bg-[#f9f0f5] flex items-center gap-1"
              >
                <MdSubdirectoryArrowRight size={18} />
                {t("Add SubRoute")}
              </button>

              <button
                onClick={() =>
                  setSidebar({ open: true, type: "route", route: null })
                }
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white flex items-center gap-1 hover:opacity-90"
              >
                <AiOutlinePlus size={18} />
                {t("Add Route")}
              </button>
            </div>
          </div>

          <RouteList onEdit={handleEditRoute} />

          <Sidebar
            isOpen={sidebar.open}
            onClose={closeSidebar}
            title={sidebar.route ? t("Edit Route") : t("Add Route")}
            width="90%"
          >
            {sidebar.type === "route" && (
              <RouteForm
                routeData={sidebar.route}
                onSuccess={closeSidebar}
                t={t}
              />
            )}
          </Sidebar>

          <AddSubRouteModal
            open={subRouteModal}
            onClose={() => setSubRouteModal(false)}
            t={t}
          />
        </div>
      </DashLayout>
    </Layout>
  );
};

export default RouteManagement;
