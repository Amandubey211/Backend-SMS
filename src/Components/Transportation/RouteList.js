/* Path: Modules/Admin/Transportation/RouteManagement/Components/RouteList.jsx */
import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Input,
  Dropdown,
  Menu,
  Tooltip,
  Badge,
  Empty,
  Spin,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
  UpOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  deleteRoute,
  getRoutesBySchool,
} from "../../Store/Slices/Transportation/RoutesManagment/routes.action";
import DeleteModal from "../Common/DeleteModal";

const RouteList = ({ onEdit }) => {
  const { loading, error, transportRoutes } = useSelector(
    (s) => s.transportation.transportRoute
  );
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState("");
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [filters, setFilters] = useState({
    status: null,
    vehicleCount: null,
  });

  /* confirmation-modal state */
  const [deleteInfo, setDeleteInfo] = useState({
    open: false,
    id: null,
    name: "",
  });

  /* ------------ data fetch -------------- */
  useEffect(() => {
    dispatch(getRoutesBySchool());
  }, [dispatch]);

  /* ------------ handlers ---------------- */
  const handleExpand = (expanded, record) => {
    const keys = expanded
      ? [...expandedRowKeys, record._id]
      : expandedRowKeys.filter((k) => k !== record._id);
    setExpandedRowKeys(keys);
  };

  const handleFilterChange = (name, value) =>
    setFilters((prev) => ({ ...prev, [name]: value }));

  const confirmDelete = () =>
    dispatch(deleteRoute(deleteInfo.id)).then(() =>
      setDeleteInfo({ open: false, id: null, name: "" })
    );

  /* ------------ filtering --------------- */
  const filteredRoutes = transportRoutes?.filter((r) => {
    const q = searchText.toLowerCase();
    const matchesSearch =
      r.routeName.toLowerCase().includes(q) ||
      r.stops[0]?.stopName.toLowerCase().includes(q) ||
      r.stops[r.stops.length - 1]?.stopName.toLowerCase().includes(q);

    const matchesStatus =
      filters.status === null || r.isActive === filters.status;

    const matchesVehicle =
      filters.vehicleCount === null ||
      (filters.vehicleCount === "empty"
        ? r.vehicles.length === 0
        : r.vehicles.length > 0);

    return matchesSearch && matchesStatus && matchesVehicle;
  });

  /* ------------ dropdown menus ---------- */
  const statusMenu = (
    <Menu
      onClick={({ key }) =>
        handleFilterChange("status", key === "all" ? null : key === "active")
      }
      items={[
        { key: "all", label: "All Statuses" },
        { key: "active", label: "Active Only" },
        { key: "inactive", label: "Inactive Only" },
      ]}
    />
  );

  const vehicleMenu = (
    <Menu
      onClick={({ key }) =>
        handleFilterChange("vehicleCount", key === "all" ? null : key)
      }
      items={[
        { key: "all", label: "All Vehicles" },
        { key: "assigned", label: "With Vehicles" },
        { key: "empty", label: "No Vehicles" },
      ]}
    />
  );

  /* ------------ main columns ------------ */
  const columns = [
    {
      title: "Route Name",
      dataIndex: "routeName",
      render: (text, record) => (
        <div className="flex items-center">
          <Button
            type="text"
            icon={
              expandedRowKeys.includes(record._id) ? (
                <UpOutlined />
              ) : (
                <DownOutlined />
              )
            }
            onClick={(e) => {
              e.stopPropagation();
              handleExpand(!expandedRowKeys.includes(record._id), record);
            }}
          />
          <span className="ml-2 font-medium">{text}</span>
        </div>
      ),
      sorter: (a, b) => a.routeName.localeCompare(b.routeName),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (v, r) => r.isActive === v,
    },
    {
      title: "Start Point",
      render: (_, r) => r.stops?.[0]?.stopName || "N/A",
    },
    {
      title: "End Point",
      render: (_, r) => r.stops?.[r.stops.length - 1]?.stopName || "N/A",
    },
    {
      title: "Stops",
      render: (_, r) => (
        <span className="text-blue-500">
          {r.stops.length} {r.stops.length === 1 ? "Stop" : "Stops"}
        </span>
      ),
      sorter: (a, b) => a.stops.length - b.stops.length,
    },
    {
      title: "Vehicles",
      render: (_, r) => (
        <div className="flex items-center">
          <CarOutlined className="mr-1" />
          {r.vehicles.length}
        </div>
      ),
      sorter: (a, b) => a.vehicles.length - b.vehicles.length,
    },
    {
      title: "Actions",
      render: (_, r) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-500" />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit({
                  ...r,
                  stopage: r.stops.map((s, i) => ({
                    stopId: s.stopId ?? s._id,
                    order: i + 1,
                    isStartingPoint: i === 0,
                    isEndingPoint: i === r.stops.length - 1,
                  })),
                });
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined className="text-red-500" />}
              onClick={(e) => {
                e.stopPropagation();
                setDeleteInfo({ open: true, id: r._id, name: r.routeName });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  /* ------------ expanded row ------------- */
  const expandedRowRender = (r) =>
    !r.vehicles.length ? (
      <div className="p-4 text-center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No vehicles assigned"
        >
          <Button type="primary" icon={<PlusOutlined />}>
            Assign Vehicle
          </Button>
        </Empty>
      </div>
    ) : (
      <Table
        columns={[
          {
            title: "Vehicle",
            dataIndex: "vehicleNumber",
            render: (v) => <span className="font-medium">{v}</span>,
          },
          {
            title: "Driver",
            dataIndex: "driverName",
            render: (d) => (
              <div className="flex items-center">
                <UserOutlined className="mr-2" />
                {d || "N/A"}
              </div>
            ),
          },
          { title: "Type", dataIndex: "vehicleType" },
          {
            title: "Capacity",
            dataIndex: "seatingCapacity",
            render: (c) => `${c} seats`,
          },
          {
            title: "Students",
            render: (_, v) => (
              <Badge count={v.students?.length || 0} showZero color="#7F35CD" />
            ),
          },
        ]}
        dataSource={r.vehicles}
        rowKey="vehicleId"
        pagination={false}
        size="small"
      />
    );

  /* ------------ render ------------------- */
  return (
    <div>
      {/* top bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search routes..."
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full md:w-1/3"
        />

        <Space>
          <Dropdown overlay={statusMenu} trigger={["click"]}>
            <Button>
              <FilterOutlined /> Status&nbsp;
              {filters.status === null
                ? "All"
                : filters.status
                ? "Active"
                : "Inactive"}{" "}
              <DownOutlined />
            </Button>
          </Dropdown>
          <Dropdown overlay={vehicleMenu} trigger={["click"]}>
            <Button>
              <FilterOutlined /> Vehicles&nbsp;
              {filters.vehicleCount === null
                ? "All"
                : filters.vehicleCount === "assigned"
                ? "With Vehicles"
                : "No Vehicles"}{" "}
              <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      </div>

      <Spin spinning={loading}>
        {error ? (
          <Empty
            description={
              <span className="text-red-500">
                Failed to load routes. Try again.
              </span>
            }
          >
            <Button
              type="primary"
              onClick={() => dispatch(getRoutesBySchool())}
            >
              Retry
            </Button>
          </Empty>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredRoutes}
            rowKey="_id"
            pagination={false} /* ⬅️ removed paging */
            expandable={{
              expandedRowRender,
              expandedRowKeys,
              onExpand: handleExpand,
              rowExpandable: () => true,
            }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No routes found"
                >
                  <Button type="primary" icon={<PlusOutlined />}>
                    Create Route
                  </Button>
                </Empty>
              ),
            }}
            className="rounded-lg overflow-hidden"
          />
        )}
      </Spin>

      {/* delete-confirm modal */}
      <DeleteModal
        isOpen={deleteInfo.open}
        onClose={() => setDeleteInfo({ open: false, id: null, name: "" })}
        onConfirm={confirmDelete}
        title={deleteInfo.name}
      />
    </div>
  );
};

export default RouteList;
