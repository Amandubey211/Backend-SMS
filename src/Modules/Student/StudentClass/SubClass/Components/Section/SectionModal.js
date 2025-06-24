import React from "react";
import PropTypes from "prop-types";
import { Tag, Space, Divider, Typography, Empty } from "antd";
import { UsergroupAddOutlined } from "@ant-design/icons";

const { Text } = Typography;

/**
 * Ant-Design tag-based presentation of a Section and its Groups.
 */
const SectionGroupModal = ({ modalData }) => {
  const sectionName = modalData?.section?.sectionName;

  const groups = modalData?.groups ?? [];

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {/* ── Section tag ─────────────────────────────────────────── */}
      <div>
        <Text type="secondary">Section</Text>
        <Divider type="vertical" />
        <Tag color="purple" style={{ fontWeight: 500 }}>
          {sectionName || "No Section Assigned"}
        </Tag>
      </div>

      {/* ── Group tags ─────────────────────────────────────────── */}
      <div>
        <Text type="secondary">Groups</Text>
        <Divider type="vertical" />
        {groups.length ? (
          <Space wrap>
            {groups?.map(({ groupName = "Unnamed" }, idx) => (
              <Tag
                key={idx}
                icon={<UsergroupAddOutlined />}
                color="cyan"
                style={{ marginBottom: 4 }}
              >
                {groupName}
              </Tag>
            ))}
          </Space>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<Text type="secondary">No Groups Assigned</Text>}
          />
        )}
      </div>
    </Space>
  );
};

SectionGroupModal.propTypes = {
  modalData: PropTypes.shape({
    section: PropTypes.shape({ sectionName: PropTypes.string }),
    groups: PropTypes.arrayOf(PropTypes.shape({ groupName: PropTypes.string })),
  }),
};

export default SectionGroupModal;
