import React, { useState, useCallback, useEffect } from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import { useTranslation } from "react-i18next";

import RouteList from "../../../Components/Transportation/RouteList";
import Sidebar from "../../../Components/Common/Sidebar";
import AddSubRouteModal from "./RouteManagement/Components/AddSubRouteModal";
import RouteForm from "./RouteManagement/Components/AddRouteForm";

import { FaRoute } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { MdSubdirectoryArrowRight } from "react-icons/md";

import { Modal } from "antd";
import { getSubRoutesBySchool } from "../../../Store/Slices/Transportation/SubRoute/subRoute.action";
import { useDispatch } from "react-redux";

/* ------------------------------------------------------------------ */
/*  RouteManagement                                                    */
/* ------------------------------------------------------------------ */
const RouteManagement = () => {
  const { t } = useTranslation("transportation");

  /* -------- page heading ------------------------------------------------ */
  // useNavHeading adds the breadcrumb / navbar title in the admin shell
  // (keep it if your project uses this custom hook; otherwise remove)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const useNavHeading =
    require("../../../Hooks/CommonHooks/useNavHeading ").default;
  useNavHeading(t("Transportation"), t("Route Management"));
  const dispatch = useDispatch();
  /* -------- local state ------------------------------------------------- */
  const [sidebar, setSidebar] = useState({
    open: false,
    type: null, // "route"
    route: null, // data of the route being edited
  });

  const [subRouteModal, setSubRouteModal] = useState(false);

  /* a single Boolean lifted from RouteForm so we can guard close-actions */
  const [formDirty, setFormDirty] = useState(false);

  /* ------------------------------------------------------------------ */
  /*  Sidebar open / close helpers                                      */
  /* ------------------------------------------------------------------ */
  const hardCloseSidebar = () =>
    setSidebar({ open: false, type: null, route: null });

  const guardedCloseSidebar = useCallback(() => {
    if (!formDirty) return hardCloseSidebar();

    Modal.confirm({
      title: t("Discard unsaved changes?"),
      content: t("You’ll lose everything you typed."),
      okText: t("Discard"),
      cancelText: t("Keep editing"),
      onOk: hardCloseSidebar,
    });
  }, [formDirty, t]);
  useEffect(() => {
    dispatch(getSubRoutesBySchool());
  }, [dispatch]);
  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <Layout title={`${t("Route Management")} | Student diwan`}>
      <DashLayout>
        <div className="p-5">
          {/* -------- header row ---------------------------------------- */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <FaRoute size={34} />
              {t("All Routes")}
            </h1>

            <div className="flex gap-3">
              {/* + SubRoute button */}
              <button
                onClick={() => setSubRouteModal(true)}
                className="px-4 py-2 rounded-lg border border-[#C83B62]
                           text-[#C83B62] hover:bg-[#f9f0f5]
                           flex items-center gap-1"
              >
                <MdSubdirectoryArrowRight size={18} />
                {t("Add SubRoute")}
              </button>

              {/* + Route button */}
              <button
                onClick={() =>
                  setSidebar({ open: true, type: "route", route: null })
                }
                className="px-4 py-2 rounded-lg bg-gradient-to-r
                           from-[#C83B62] to-[#7F35CD] text-white
                           flex items-center gap-1 hover:opacity-90"
              >
                <AiOutlinePlus size={18} />
                {t("Add Route")}
              </button>
            </div>
          </div>

          {/* -------- list of routes ------------------------------------ */}
          <RouteList
            onEdit={(route) => setSidebar({ open: true, type: "route", route })}
          />

          {/* -------- right-hand sidebar -------------------------------- */}
          <Sidebar
            isOpen={sidebar.open}
            onClose={guardedCloseSidebar}
            title={sidebar.route ? t("Edit Route") : t("Add Route")}
            width="80%"
          >
            {sidebar.type === "route" && (
              <RouteForm
                routeData={sidebar.route}
                onSuccess={() => {
                  setFormDirty(false);
                  hardCloseSidebar();
                }}
                onDirtyChange={setFormDirty} /* <-- new prop */
                t={t}
              />
            )}
          </Sidebar>

          {/* -------- nested Create-SubRoute modal ---------------------- */}
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
