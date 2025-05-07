import React, { useEffect, useState } from "react";
import {
  Select,
  Button,
  Card,
  Spin,
  message,
  Avatar,
  Tag,
  Divider,
} from "antd";
import { CarOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllVehicles } from "../../../../../Store/Slices/Transportation/Vehicles/vehicles.action";
import {
  assignVehiclesToRoute,
} from "../../../../../Store/Slices/Transportation/RoutesManagment/routes.action";
import {
  getShiftByvehicleId,
} from "../../../../../Store/Slices/Transportation/Shift/shift.action";

const { Option } = Select;

const VehicleAssignment = ({ routeId, onSuccess }) => {
  const dispatch = useDispatch();
  const { vehicles, loading: vehicleLoading } = useSelector(
    (state) => state.transportation.transportVehicle
  );

  const [assignments, setAssignments] = useState([
    { vehicleId: null, shifts: [] },
  ]);

  const [vehicleShiftMap, setVehicleShiftMap] = useState({});
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllVehicles());
  }, [dispatch]);

  const handleVehicleSelect = async (index, vehicleId) => {
    const updated = [...assignments];
    updated[index].vehicleId = vehicleId;
    updated[index].shifts = [];
    setAssignments(updated);

    if (!vehicleShiftMap[vehicleId]) {
      try {
        const result = await dispatch(getShiftByvehicleId(vehicleId)).unwrap();
        const shiftsArray = Array.isArray(result.data) ? result.data : [];
        setVehicleShiftMap((prev) => ({
          ...prev,
          [vehicleId]: shiftsArray,
        }));
      } catch (err) {
        message.error("Failed to fetch shifts");
      }
    }
  };

  const handleShiftSelect = (index, shiftIds) => {
    const updated = [...assignments];
    updated[index].shifts = shiftIds;
    setAssignments(updated);
  };

  const handleAddVehicle = () => {
    setAssignments([...assignments, { vehicleId: null, shifts: [] }]);
  };

  const handleAssignVehicles = async () => {
    const filteredAssignments = assignments.filter(
      (a) => a.vehicleId && a.shifts.length
    );

    if (!routeId || !filteredAssignments.length) {
      return message.warning("Please assign at least one vehicle with shifts");
    }

    setAssignLoading(true);
    try {
      await dispatch(
        assignVehiclesToRoute({
          routeId,
          vehiclesWithShifts: filteredAssignments?.map((a) => ({
            vehicleId: a.vehicleId,
            shiftIds: a.shifts,
          })),
        })
      ).unwrap();
      message.success("Vehicles with shifts assigned successfully");
      onSuccess?.();
    } catch (err) {
      message.error("Failed to assign vehicles");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleRemoveVehicle = (index) => {
    const updated = [...assignments];
    updated.splice(index, 1);
    setAssignments(updated);
  };

  return (
    <Card title="Assign Vehicles with Shifts">
      <Spin spinning={vehicleLoading || assignLoading}>
        {assignments?.map((assignment, index) => {
          const selectedVehicle = vehicles.find((v) => v._id === assignment.vehicleId);
          const availableShifts = vehicleShiftMap[assignment.vehicleId] || [];

          return (
            <Card
              key={index}
              type="inner"
              title={
                <div className="flex justify-between items-center">
                  <span>{`Vehicle ${index + 1}`}</span>
                  {assignments.length > 1 && (
                    <Button danger size="small" onClick={() => handleRemoveVehicle(index)}>
                      Remove
                    </Button>
                  )}
                </div>
              }
              className="mb-4"
            >
              <Select
                showSearch
                placeholder="Select Vehicle"
                style={{ width: "100%", marginBottom: "1rem" }}
                value={assignment.vehicleId}
                onChange={(value) => handleVehicleSelect(index, value)}
              >
                {vehicles?.map((vehicle) => (
                  <Option key={vehicle._id} value={vehicle._id}>
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="small"
                        icon={<CarOutlined />}
                        style={{
                          backgroundColor:
                            vehicle.status === "active" ? "#52c41a" : "#f5222d",
                        }}
                      />
                      <span>
                        {vehicle.vehicleNumber} - {vehicle.vehicleType}
                      </span>
                    </div>
                  </Option>
                ))}
              </Select>

              {assignment.vehicleId && (
                <Select
                  mode="multiple"
                  placeholder="Select Shifts"
                  style={{ width: "100%" }}
                  value={assignment.shifts}
                  onChange={(val) => handleShiftSelect(index, val)}
                >
                  {availableShifts?.map((shift) => (
                    <Option key={shift._id} value={shift._id}>
                      {shift.shiftName} ({shift.fromTime} - {shift.toTime})
                    </Option>
                  ))}
                </Select>
              )}
            </Card>
          );
        })}

        <Divider />

        <div className="flex justify-between">
          <Button icon={<PlusOutlined />} onClick={handleAddVehicle}>
            Add Vehicle
          </Button>
          <Button
            type="primary"
            onClick={handleAssignVehicles}
            disabled={assignments.every((a) => !a.vehicleId || !a.shifts.length)}
          >
            Assign Vehicles
          </Button>
        </div>
      </Spin>
    </Card>
  );
};

export default VehicleAssignment;
