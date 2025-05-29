// src/Modules/Admin/Verification/TopNavigation.js
import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Tabs, Input } from "antd";
import { CiSearch } from "react-icons/ci";
import {
  UserOutlined, // Unverified
  CloseCircleOutlined, // Rejected
  ClockCircleOutlined, // Pending (draft)
} from "@ant-design/icons";
import {
  setActiveTab,
  setSearchQuery,
} from "../../../Store/Slices/Admin/Verification/VerificationSlice";
import { useTranslation } from "react-i18next";

const { TabPane } = Tabs;

/** ----------  utility: return counts per status  ---------- */
const getCounts = (students = []) => {
  let unverified = 0,
    rejected = 0;

  students.forEach((s) => {
    // fallback to '' if field missing
    const status = s.verificationStatus ?? "";
    if (status === "rejected") rejected += 1;
    else unverified += 1; // includes empty / 'unverified'
  });

  return { unverified, rejected };
};

const TopNavigation = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("admVerification");

  const { activeTab, searchQuery, unVerifiedStudents, loadingUnverified } =
    useSelector(
      (s) => ({
        activeTab: s.admin.verification.activeTab,
        searchQuery: s.admin.verification.searchQuery,
        unVerifiedStudents: s.admin.verification.unVerifiedStudents,
        loadingUnverified: s.admin.verification.loadingUnverified,
      }),
      shallowEqual
    );

  /* ------------ derive counts once ------------ */
  const { unverified, rejected, pending } = getCounts(unVerifiedStudents);

  /** Build label: icon + text + (count) *only* for the active tab */
  const buildLabel = (key, icon, text, count) => (
    <span className="flex items-center gap-1">
      {icon}
      <span>{text}</span>
      {activeTab === key && !loadingUnverified && <span>({count})</span>}
    </span>
  );

  const extraContent = (
    <Input
      allowClear
      prefix={<CiSearch />}
      placeholder={t("Search By Email")}
      value={searchQuery}
      onChange={(e) => dispatch(setSearchQuery(e.target.value))}
      className="w-64"
    />
  );

  return (
    <Tabs
      activeKey={activeTab}
      onChange={(k) => dispatch(setActiveTab(k))}
      tabBarExtraContent={extraContent}
    >
      <TabPane
        key="unverified"
        tab={buildLabel(
          "unverified",
          <UserOutlined />,
          t("Unverified Students"),
          unverified
        )}
      />
      <TabPane
        key="rejected"
        tab={buildLabel(
          "rejected",
          <CloseCircleOutlined />,
          t("Rejected Students"),
          rejected
        )}
      />
      <TabPane
        key="Pending"
        tab={buildLabel(
          "Pending",
          <ClockCircleOutlined />,
          t("Pending Forms"),
          unverified
        )}
      />
    </Tabs>
  );
};

export default React.memo(TopNavigation);
