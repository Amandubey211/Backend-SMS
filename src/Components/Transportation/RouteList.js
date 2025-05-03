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
  const [filters, setFilters] = useState({ status: null, vehicleCount: null });

  /* delete-modal state */
  const [deleteInfo, setDeleteInfo] = useState({
    open: false,
    id: null,
    name: "",
  });

  /* fetch */
  useEffect(() => {
    dispatch(getRoutesBySchool());
  }, [dispatch]);

  /* helpers */
  const handleExpand = (exp, rec) =>
    setExpandedRowKeys((prev) =>
      exp ? [...prev, rec._id] : prev.filter((k) => k !== rec._id)
    );

  const confirmDelete = () =>
    dispatch(deleteRoute(deleteInfo.id)).then(() =>
      setDeleteInfo({ open: false, id: null, name: "" })
    );

  /* filter in memory */
  const filteredRoutes = transportRoutes?.filter((r) => {
    const q = searchText.toLowerCase();
    const matchTxt =
      r.routeName.toLowerCase().includes(q) ||
      r.stops[0]?.stopName.toLowerCase().includes(q) ||
      r.stops[r.stops.length - 1]?.stopName.toLowerCase().includes(q);

    const matchStatus =
      filters.status === null || r.isActive === filters.status;
    const matchVeh =
      filters.vehicleCount === null ||
      (filters.vehicleCount === "empty"
        ? r.vehicles.length === 0
        : r.vehicles.length > 0);
    return matchTxt && matchStatus && matchVeh;
  });

  /* menus */
  const statusMenu = (
    <Menu
      onClick={({ key }) =>
        setFilters((p) => ({
          ...p,
          status: key === "all" ? null : key === "active",
        }))
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
        setFilters((p) => ({ ...p, vehicleCount: key === "all" ? null : key }))
      }
      items={[
        { key: "all", label: "All Vehicles" },
        { key: "assigned", label: "With Vehicles" },
        { key: "empty", label: "No Vehicles" },
      ]}
    />
  );

  /* columns */
  const columns = [
    {
      title: "Route Name",
      dataIndex: "routeName",
      render: (txt, r) => (
        <div className="flex items-center">
          <Button
            type="text"
            icon={
              expandedRowKeys.includes(r._id) ? (
                <UpOutlined />
              ) : (
                <DownOutlined />
              )
            }
            onClick={(e) => {
              e.stopPropagation();
              handleExpand(!expandedRowKeys.includes(r._id), r);
            }}
          />
          <span className="ml-2 font-medium">{txt}</span>
        </div>
      ),
      sorter: (a, b) => a.routeName.localeCompare(b.routeName),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (v) => (
        <Tag color={v ? "green" : "red"}>{v ? "Active" : "Inactive"}</Tag>
      ),
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (v, r) => r.isActive === v,
    },
    { title: "Start Point", render: (_, r) => r.stops?.[0]?.stopName || "N/A" },
    {
      title: "End Point",
      render: (_, r) => r.stops?.[r.stops.length - 1]?.stopName || "N/A",
    },
    {
      title: "Stops",
      render: (_, r) => (
        <Link
          to={`/transportation/route-management/routes/${r._id ?? r.routeId}/stoppages`}
          className="text-blue-500 underline"
          onClick={(e) => e.stopPropagation()}
        >
          {r.stops.length} Stops
        </Link>
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
                /* pass id under _id for the form */
                onEdit({
                  ...r,
                  _id: r._id ?? r.routeId,
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
                setDeleteInfo({
                  open: true,
                  id: r._id ?? r.routeId,
                  name: r.routeName,
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  /* expanded vehicles */
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
        size="small"
        pagination={false}
        rowKey="vehicleId"
        dataSource={r.vehicles}
        columns={[
          {
            title: "Vehicle",
            dataIndex: "vehicleNumber",
            render: (v) => <strong>{v}</strong>,
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
      />
    );

  /* render */
  return (
    <div>
      {/* filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          prefix={<SearchOutlined />}
          allowClear
          placeholder="Search routes..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full md:w-1/3"
        />
        <Space>
          <Dropdown overlay={statusMenu}>
            <Button>
              <FilterOutlined /> Status{" "}
              {filters.status === null
                ? "All"
                : filters.status
                ? "Active"
                : "Inactive"}{" "}
              <DownOutlined />
            </Button>
          </Dropdown>
          <Dropdown overlay={vehicleMenu}>
            <Button>
              <FilterOutlined /> Vehicles{" "}
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
              <span className="text-red-500">Failed to load routes.</span>
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
            rowKey="_id"
            pagination={false}
            dataSource={filteredRoutes}
            columns={columns}
            expandable={{
              expandedRowRender,
              expandedRowKeys,
              onExpand: handleExpand,
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
          />
        )}
      </Spin>

      <DeleteModal
        isOpen={deleteInfo.open}
        title={deleteInfo.name}
        onConfirm={confirmDelete}
        onClose={() => setDeleteInfo({ open: false, id: null, name: "" })}
      />
    </div>
  );
};

export default RouteList;
