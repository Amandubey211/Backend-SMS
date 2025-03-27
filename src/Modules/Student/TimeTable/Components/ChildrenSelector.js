import React from "react";
import { Card, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

/**
 * Component for selecting a child (for parent role)
 * @param {Object} props - Component props
 * @param {Array} props.children - List of children
 * @param {string} props.selectedChildId - Currently selected child ID
 * @param {Function} props.setSelectedChildId - Function to set selected child
 * @param {Function} props.t - Translation function
 */
const ChildrenSelector = ({
  children,
  selectedChildId,
  setSelectedChildId,
  t,
}) => {
  if (children.length === 0) return null;

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-600 mb-2">
        {t("Select Child")}
      </h4>
      <div className="flex flex-wrap gap-3">
        {children.map((child) => (
          <Card
            key={child.id}
            onClick={() => setSelectedChildId(child.id)}
            className={`cursor-pointer transition-all ${
              selectedChildId === child.id
                ? "border-blue-500 border-2"
                : "border-gray-200"
            }`}
            bodyStyle={{ padding: "12px" }}
          >
            <div className="flex items-center gap-3">
              <Avatar
                src={child.profile}
                icon={<UserOutlined />}
                size="large"
              />
              <div>
                <div className="font-medium">{child.name}</div>
                <div className="text-xs text-gray-600">
                  {child.class} • {child.sectionName}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChildrenSelector;
