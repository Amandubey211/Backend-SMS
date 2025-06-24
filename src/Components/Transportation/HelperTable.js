import { Table, Tag } from "antd";
import { FiEdit3, FiXCircle } from "react-icons/fi";

const HelperTable = ({ helpers, loading, error, onEdit, openDeleteModal }) => {


  const columns = [
    {
      title: "Helper Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Badge Number",
      dataIndex: "helperBadgeNumber",
      key: "helperBadgeNumber",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        let color;
        let displayText = text.charAt(0).toUpperCase() + text.slice(1);
        if (text === "under_maintenance") displayText = "Under Maintenance";

        switch (text?.toLowerCase()) {
          case "active":
            color = "#34d399"; // Light green
            break;
          case "inactive":
            color = "#facc15"; // Light yellow
            break;
          case "under_maintenance":
            color = "#9ca3af"; // Light gray
            break;
          default:
            color = "#9ca3af"; // Light gray for undefined
        }
        return <Tag color={color}>{displayText}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onEdit(record)}
            className="text-blue-500 hover:text-blue-600"
          >
            <FiEdit3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => openDeleteModal(record)}
            className="text-red-500 hover:text-red-600"
          >
            <FiXCircle className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={helpers}
      loading={loading}
      rowKey="_id"
      pagination={false}
      className="ant-table-custom"
      style={{ backgroundColor: "#f9fafb" }}
    />
  );
};

export default HelperTable;