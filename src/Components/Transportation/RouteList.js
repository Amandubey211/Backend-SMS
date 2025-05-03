// RouteList.jsx (updated)
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
  CarOutlined,
  UserOutlined,
  UserAddOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  deleteRoute,
  getRoutesBySchool,
} from "../../Store/Slices/Transportation/RoutesManagment/routes.action";
import DeleteModal from "../Common/DeleteModal";
import CreateTrip from "../../Modules/Admin/Transportation/RouteManagement/Components/CreateTrip";
import AddUsers from "../../Modules/Admin/Transportation/RouteManagement/Components/AddUsers";
import Sidebar from "../Common/Sidebar";
import VehicleAssignment from "../../Modules/Admin/Transportation/RouteManagement/Components/VehicleAssignment";

const RouteList = ({ onEdit }) => {
  const { loading, error, transportRoutes } = useSelector(
    (s) => s.transportation.transportRoute
  );
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState("");
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [filters, setFilters] = useState({ status: null, vehicleCount: null });

  /* Sidebar states */
  const [sidebarState, setSidebarState] = useState({
    isOpen: false,
    content: null,
    title: "",
  });

  /* delete-modal state */
  const [deleteInfo, setDeleteInfo] = useState({
    open: false,
    id: null,
    name: "",
  });

  const handleExpand = (expanded, record) => {
    const recordId = record._id ?? record.routeId;

    if (expanded) {
      if (expandedRowKeys.includes(recordId)) {
        setExpandedRowKeys([]);
      } else {
        setExpandedRowKeys([recordId]);
      }
    } else {
      setExpandedRowKeys(expandedRowKeys.filter((k) => k !== recordId));
    }
  };

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
      r.stops[r.stops?.length - 1]?.stopName.toLowerCase().includes(q);

    const matchStatus =
      filters.status === null || r.isActive === filters.status;
    const matchVeh =
      filters.vehicleCount === null ||
      (filters.vehicleCount === "empty"
        ? r.vehicles?.length === 0
        : r.vehicles?.length > 0);
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
      render: (txt, r) => {
        const isExpanded = expandedRowKeys.includes(r._id ?? r.routeId);
        return (
          <div className="flex items-center">
            <Button
              type="text"
              icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleExpand(!isExpanded, r);
              }}
            />
            <span className="ml-2 font-medium">{txt}</span>
          </div>
        );
      },
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
      render: (_, r) => r.stops?.[r.stops?.length - 1]?.stopName || "N/A",
    },
    {
      title: "Stops",
      render: (_, r) => (
        <Link
          to={`/transportation/routes/${r._id ?? r.routeId}/stoppages`}
          className="text-blue-500 underline"
          onClick={(e) => e.stopPropagation()}
        >
          {r.stops?.length} Stops
        </Link>
      ),
      sorter: (a, b) => a.stops?.length - b.stops?.length,
    },
    {
      title: "Vehicles",
      render: (_, r) => (
        <div className="flex items-center">
          <CarOutlined className="mr-1" />
          {r.vehicles?.length || 0}
        </div>
      ),
      sorter: (a, b) => (a.vehicles?.length || 0) - (b.vehicles?.length || 0),
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
                  _id: r._id ?? r.routeId,
                  stopage: r.stops.map((s, i) => ({
                    stopId: s.stopId ?? s._id,
                    order: i + 1,
                    isStartingPoint: i === 0,
                    isEndingPoint: i === r.stops?.length - 1,
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
  const expandedRowRender = (r) => {
    console.log(r, "sdfsdfsdfsdf");
    const isExpanded = expandedRowKeys.includes(r._id ?? r.routeId);

    return isExpanded ? (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-50 rounded-lg p-4 mb-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg m-0">Assigned Vehicles</h3>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSidebarState({
                isOpen: true,
                title: `Assign Vehicles to ${r.routeName}`,
                content: (
                  <VehicleAssignment
                    routeId={r._id ?? r.routeId}
                    currentVehicles={r.vehicles?.map((v) => v.vehicleId) || []}
                    onSuccess={() => {
                      dispatch(getRoutesBySchool());
                      setSidebarState({ isOpen: false });
                    }}
                  />
                ),
              });
            }}
          >
            Assign Vehicles
          </Button>
        </div>

        {!r.vehicles?.length ? (
          <div className="p-4 text-center bg-white rounded-lg">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No vehicles assigned"
            />
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
                  <Badge
                    count={v.students?.length || 0}
                    showZero
                    color="#7F35CD"
                  />
                ),
              },
              {
                title: "Actions",
                render: (_, v) => (
                  <Space>
                    <Tooltip title="Add Users">
                      <Button
                        size="small"
                        icon={<UserAddOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSidebarState({
                            isOpen: true,
                            title: `Add Users to ${v.vehicleNumber}`,
                            content: (
                              <AddUsers
                                vehicle={v}
                                onClose={() =>
                                  setSidebarState({ isOpen: false })
                                }
                              />
                            ),
                          });
                        }}
                      >
                        Add Users
                      </Button>
                    </Tooltip>
                    <Tooltip title="Create Trip">
                      <Button
                        size="small"
                        icon={<PlusCircleOutlined />}
                        type="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSidebarState({
                            isOpen: true,
                            title: `Create Trip for ${v.vehicleNumber}`,
                            content: (
                              <CreateTrip
                                vehicle={v}
                                onClose={() =>
                                  setSidebarState({ isOpen: false })
                                }
                              />
                            ),
                          });
                        }}
                      >
                        Create Trip
                      </Button>
                    </Tooltip>
                    <Tooltip title="View Trips">
                      <Button
                        size="small"
                        icon={<UnorderedListOutlined />}
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Trips
                      </Button>
                    </Tooltip>
                  </Space>
                ),
              },
            ]}
            className="rounded-lg overflow-hidden"
          />
        )}
      </motion.div>
    ) : null;
  };

  /* render */
  return (
    <div>
      {/* Sidebar for Add Users and Create Trip */}
      <Sidebar
        isOpen={sidebarState.isOpen}
        title={sidebarState.title}
        onClose={() => setSidebarState({ isOpen: false })}
      >
        {sidebarState.content}
      </Sidebar>

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
            rowKey={(record) => record._id ?? record.routeId}
            pagination={false}
            dataSource={filteredRoutes}
            columns={columns}
            expandable={{
              expandedRowRender,
              expandedRowKeys,
              onExpand: handleExpand,
              expandRowByClick: true,
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
