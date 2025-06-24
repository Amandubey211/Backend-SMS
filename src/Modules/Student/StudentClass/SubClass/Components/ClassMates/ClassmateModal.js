import React from "react";
import PropTypes from "prop-types";
import { Avatar, Tag, Typography, Space, Button, Tooltip, message } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import profileImage from "../../../../../../Assets/DashboardAssets/profileIcon.png";

const { Text } = Typography;

/**
 * Glam-styled classmate sheet for the SidebarSlide (30 % width).
 */
const ClassmateModal = ({ classmate = {} }) => {
  /* ─── destructure with fallbacks ───────────────────────────── */
  const {
    profile = profileImage,
    name = "N/A",
    number = "N/A",
    admissionNumber = "N/A",
    group = "",
  } = classmate;

  const groups = group
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);

  /* ─── handlers ─────────────────────────────────────────────── */
  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(number.toString());
      message.success("Contact copied");
    } catch {
      message.error("Copy failed");
    }
  };

  /* ─── ui ───────────────────────────────────────────────────── */
  return (
    <div
      className="
        relative flex flex-col items-center
        max-h-full overflow-y-auto
        px-6 pt-24 pb-8 border
      "
      /* glass card */
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 100%)",
        border: "1px solid rgba(255,255,255,0.25)",
        borderRadius: 20,
      }}
    >
      {/* ── gradient header ───────────────────────────────────── */}
      <div
        className="absolute inset-x-0 top-0 h-40 rounded-t-[20px] z-0"
        style={{
          background: "linear-gradient(135deg, #ff7af5 0%, #8f00ff 100%)",
        }}
      />

      {/* ── avatar (overlaps header) ──────────────────────────── */}
      <Avatar
        size={112}
        src={profile}
        icon={<UserOutlined />}
        className="shadow-xl z-10"
        style={{
          border: "4px solid white",
          transform: "translateY(-50%)",
        }}
      />

      {/* ── name ──────────────────────────────────────────────── */}
      <Text
        strong
        style={{
          fontSize: 24,
          marginTop: "-2rem",
          background: "linear-gradient(135deg, #ff7af5 0%, #8f00ff 100%)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        {name}
      </Text>

      {/* ── meta rows ─────────────────────────────────────────── */}
      <Space
        direction="vertical"
        size="middle"
        style={{ marginTop: 24, width: "100%" }}
      >
        {/* phone */}
        <Space
          align="center"
          style={{
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Space className="mr-4">
            <PhoneOutlined />
            <Text className="text-gray-900 ">+{number}</Text>
          </Space>
          <Tooltip title="Copy">
            <Button
              icon={<CopyOutlined />}
              type="text"
              size="small"
              onClick={copyPhone}
            />
          </Tooltip>
        </Space>

        {/* admission number */}
        <Space align="center" className="mr-4">
          <IdcardOutlined />
          <Text className="text-gray-800">{admissionNumber}</Text>
        </Space>

        {/* groups */}
        <div className="w-full">
          <Text className="mr-4" strong style={{ fontSize: 12, opacity: 0.7 }}>
            GROUPS
          </Text>
          <Space wrap style={{ marginTop: 8 }}>
            {groups.length ? (
              groups.map((g, i) => (
                <Tag
                  key={i}
                  color="purple"
                  className="px-3 capitalize py-1 text-sm font-medium animate-fadeIn"
                >
                  {g}
                </Tag>
              ))
            ) : (
              <Tag color="default">No Groups</Tag>
            )}
          </Space>
        </div>
      </Space>
    </div>
  );
};

ClassmateModal.propTypes = {
  classmate: PropTypes.shape({
    profile: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    admissionNumber: PropTypes.string,
    group: PropTypes.string,
  }),
};

export default ClassmateModal;
