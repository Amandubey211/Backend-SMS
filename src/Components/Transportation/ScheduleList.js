import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Button, Input, Empty, Spin } from "antd";
import { DownOutlined, UpOutlined, CarOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getSchedules } from "../../Store/Slices/Transportation/Schedule/schedule.action";

const ScheduleList = () => {
  const { loading, error, schedules } = useSelector(
    (state) => state.transportation.transportSchedule
  );
  const dispatch = useDispatch();

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Fetch schedules
  useEffect(() => {
    dispatch(getSchedules());
  }, [dispatch]);

  // Handle row expansion (ensure only one row is expanded at a time)
  const handleExpand = (exp, record) => {
    setExpandedRowKeys(exp ? [record._id] : []); // Only expand the clicked row
  };

  // Filter schedules based on search text
  const filteredSchedules = schedules?.filter((schedule) => {
    const q = searchText.toLowerCase();
    return (
      schedule.shift?.toLowerCase().includes(q) ||
      schedule.fromTime?.toLowerCase().includes(q) ||
      schedule.toTime?.toLowerCase().includes(q)
    );
  });

  // Expanded row render for vehicle details
  const expandedRowRender = (record) =>
    !record.vehicles.length ? (
      <div className="p-4 text-center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No vehicles assigned"
        >
        </Empty>
      </div>
    ) : (
      <Table
        size="small"
        pagination={false}
        rowKey="vehicleId"
        dataSource={record.vehicles}
        columns={[
          {
            title: "Vehicle",
            dataIndex: "vehicleNumber",
            render: (text) => <strong>{text}</strong>,
          },
          {
            title: "Type",
            dataIndex: "vehicleType",
          },
          {
            title: "Capacity",
            dataIndex: "seatingCapacity",
            render: (capacity) => `${capacity} seats`,
          },
          {
            title: "Driver",
            dataIndex: "driverName",
            render: (driver) => driver || "N/A",
          },
        ]}
      />
    );

  // Columns for the schedule table
  const columns = [
    {
      title: "Shift",
      dataIndex: "shift",
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
    },
    {
      title: "From Time",
      dataIndex: "fromTime",
    },
    {
      title: "To Time",
      dataIndex: "toTime",
    },
    {
      title: "Vehicles",
      render: (_, record) => (
        <div className="flex items-center">
          <CarOutlined className="mr-1" />
          {record.vehicles.length}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Search Bar */}
      <Input
        prefix={<SearchOutlined />}
        allowClear
        placeholder="Search schedules..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-6 w-full"
      />

      <Spin spinning={loading}>
        {error ? (
          <Empty description="Failed to load schedules">
            <Button type="primary" onClick={() => dispatch(getSchedules())}>
              Retry
            </Button>
          </Empty>
        ) : (
          <Table
            rowKey="_id"
            pagination={false}
            dataSource={filteredSchedules}
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
                  description="No schedules found"
                />
              ),
            }}
          />
        )}
      </Spin>
    </div>
  );
};

export default ScheduleList;
