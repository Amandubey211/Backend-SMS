// VehicleAssignment.jsx
import React, { useEffect, useState } from "react";
import {
  Select,
  Tag,
  Avatar,
  Button,
  Spin,
  Card,
  Divider,
  message,
} from "antd";
import { CarOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllVehicles } from "../../../../../Store/Slices/Transportation/Vehicles/vehicles.action";
import { assignVehiclesToRoute } from "../../../../../Store/Slices/Transportation/RoutesManagment/routes.action";

const { Option } = Select;

const VehicleAssignment = ({ routeId, currentVehicles = [], onSuccess }) => {
    console.log("Route ID:", routeId);
  console.log("Current Vehicles:", currentVehicles);
  const dispatch = useDispatch();
  const { vehicles, loading } = useSelector(
    (state) => state.transportation.transportVehicle
  );
  const [selectedVehicles, setSelectedVehicles] = useState(currentVehicles);
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllVehicles());
  }, [dispatch]);

  useEffect(() => {
    setSelectedVehicles(currentVehicles);
  }, [currentVehicles]);

  const handleAssignVehicles = async () => {
    console.log("Assigning vehicles:", selectedVehicles);
    console.log("Route ID:", routeId);
    
    if (!routeId) return;

    setAssignLoading(true);
    try {
      await dispatch(
        assignVehiclesToRoute({
          routeId,
          vehicleIds: selectedVehicles,
        })
      ).unwrap();
      message.success("Vehicles assigned successfully");
      onSuccess?.();
    } catch (error) {
      message.error("Failed to assign vehicles");
    } finally {
      setAssignLoading(false);
    }
  };

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const vehicle = vehicles?.find((v) => v._id === value);

    return (
      <Tag
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3, display: "flex", alignItems: "center" }}
      >
        <Avatar
          size="small"
          icon={<CarOutlined />}
          style={{
            marginRight: 4,
            backgroundColor:
              vehicle?.status === "active" ? "#52c41a" : "#f5222d",
          }}
        />
        {label}
      </Tag>
    );
  };

  return (
    <Card title="Assign Vehicles" bordered={false}>
      <Spin spinning={loading || assignLoading}>
        <div className="mb-4">
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Select vehicles"
            value={selectedVehicles}
            onChange={setSelectedVehicles}
            optionLabelProp="label"
            tagRender={tagRender}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
          >
            {vehicles?.map((vehicle) => (
              <Option
                key={vehicle._id}
                value={vehicle._id}
                label={`${vehicle.vehicleNumber} (${vehicle.vehicleType})`}
              >
                <div className="flex items-center gap-2">
                  <Avatar
                    size="small"
                    icon={<CarOutlined />}
                    style={{
                      backgroundColor:
                        vehicle.status === "active" ? "#52c41a" : "#f5222d",
                    }}
                  />
                  <div>
                    <div className="font-medium">
                      {vehicle.vehicleNumber}
                      <Tag
                        color={
                          vehicle.vehicleCategory === "ac" ? "blue" : "default"
                        }
                        className="ml-2"
                      >
                        {vehicle.vehicleType} ({vehicle.vehicleCategory})
                      </Tag>
                    </div>
                    <div className="text-xs">
                      Capacity: {vehicle.seatingCapacity} | Status:
                      <Tag
                        color={
                          vehicle.status === "active" ? "success" : "error"
                        }
                        className="ml-1"
                      >
                        {vehicle.status}
                      </Tag>
                    </div>
                  </div>
                </div>
              </Option>
            ))}
          </Select>
        </div>

        <Divider />

        <div className="flex justify-end">
          <Button
            type="primary"
            onClick={handleAssignVehicles}
            disabled={!selectedVehicles.length}
          >
            Assign Vehicles
          </Button>
        </div>
      </Spin>
    </Card>
  );
};

export default VehicleAssignment;
