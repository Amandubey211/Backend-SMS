import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Input,
  Empty,
  Spin,
  Typography,
  Card,
  Select,
  Row,
  Col,
} from "antd";
import {
  DownOutlined,
  UpOutlined,
  CarOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getSchedules } from "../../Store/Slices/Transportation/Schedule/schedule.action";

const { Title } = Typography;
const { Option } = Select;

const ScheduleList = () => {
  const { loading, error, schedules } = useSelector(
    (state) => state.transportation.transportSchedule
  );
  const dispatch = useDispatch();

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [shiftFilter, setShiftFilter] = useState("");

  useEffect(() => {
    dispatch(getSchedules());
  }, [dispatch]);
  const handleExpand = (exp, record) => {
    setExpandedRowKeys(exp ? [record.shift] : []);
  };

  const handleResetFilters = () => {
    setSearchText("");
    setShiftFilter("");
  };

  const filteredSchedules = schedules?.filter((schedule) => {
    const q = searchText.toLowerCase();
    const matchesSearch =
      schedule.shift?.toLowerCase().includes(q) ||
      schedule.fromTime?.toLowerCase().includes(q) ||
      schedule.toTime?.toLowerCase().includes(q);
    const matchesShift = shiftFilter ? schedule.shift === shiftFilter : true;
    return matchesSearch && matchesShift;
  });

  const expandedRowRender = (record) => (
    <Card className="bg-gray-50 shadow-md">
      {!record.vehicles.length ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No vehicles assigned"
        />
      ) : (
        <Table
          size="small"
          pagination={false}
          rowKey="vehicleId"
          dataSource={record.vehicles}
          columns={[
            {
              title: "Vehicle Number",
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
      )}
    </Card>
  );

  const columns = [
    {
      title: "Shift",
      dataIndex: "shift",
      render: (text, record) => (
        <div className="flex items-center">
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
        <Tag icon={<CarOutlined />} color="blue">
          {record.vehicles.length}
        </Tag>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Title level={3} className="mb-4">
        Transportation Schedules
      </Title>

      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={12} md={8}>
          <Input
            prefix={<SearchOutlined />}
            allowClear
            placeholder="Search schedules..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Select
            placeholder="Filter by Shift"
            allowClear
            value={shiftFilter}
            onChange={(value) => setShiftFilter(value)}
            style={{ width: "100%" }}
          >
            <Option value="">All</Option>
            {[...new Set(schedules?.map((s) => s.shift))].map((shift) => (
              <Option key={shift} value={shift}>
                {shift}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Button type="default" onClick={handleResetFilters} block>
            Reset Filters
          </Button>
        </Col>
      </Row>

      <Spin spinning={loading} tip="Loading schedules...">
        {error ? (
          <Empty description="Failed to load schedules">
            <Button type="primary" onClick={() => dispatch(getSchedules())}>
              Retry
            </Button>
          </Empty>
        ) : (
          <Table
            rowKey="shift"
            pagination={{ pageSize: 5 }}
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
