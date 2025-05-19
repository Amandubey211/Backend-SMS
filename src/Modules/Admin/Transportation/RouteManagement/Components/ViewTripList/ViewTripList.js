import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Tabs, Table, Empty, Modal } from "antd";
import { ExclamationOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import advancedFormat from "dayjs/plugin/advancedFormat";
import MapView from "./MapView";
import Pagination from "../Common/pagination";
import TripColumns from "./Components/TripColumns";
import { getTripLogsByVehicle } from "../../Store/Slices/Transportation/TripExecutionLog/tripExecutionLog.action";
import { setCurrentLocation } from "../../Store/Slices/Transportation/TripExecutionLog/tripExecutionLogSlice";
import {
  useSocket,
  useSocketStatus,
} from "../../../../../../Components/Common/SocketContext";
import { useTripLocationSocket } from "../../../../../../Hooks/Transportation/useTripLocationSocket";
import TripDetailsSidebar from "./Components/TripDetailsSidebar";

/* extend dayjs */
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(advancedFormat);

const ViewTripsList = () => {
  /* ───────────────────────────── state */
  const [activeTab, setActiveTab] = useState("today");
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedTripForMap, setSelectedTripForMap] = useState(null);
  const [showDetailsSidebar, setShowDetailsSidebar] = useState(false);
  const [selectedTripForDetails, setSelectedTripForDetails] = useState(null);

  const socket = useSocket();
  const socketStatus = useSocketStatus(); // 'connected' | 'disconnected' | 'error'
  const socketConnected = socketStatus === "connected";

  const dispatch = useDispatch();
  const { vehicleId } = useParams();

  /* ───────────────────────────── redux */
  const {
    loading,
    currentLocation,
    vehicleWiseLogs = [],
    pagination = {},
  } = useSelector((s) => s.transportation.tripExecutionLog);

  /* ───────────────────────────── live-location handler */
  const handleSocketUpdate = useCallback(
    ({ lat, lng, speed }) => {
      dispatch(setCurrentLocation({ lat, lng, speed }));
    },
    [dispatch]
  );

  /* auto join / leave room for the sidebar trip */
  useTripLocationSocket(selectedTripForDetails?._id, handleSocketUpdate);

  /* ───────────────────────────── fetch trips */
  useEffect(() => {
    dispatch(
      getTripLogsByVehicle({
        vehicleId,
        page: pagination.currentPage,
        limit: pagination.limit,
        type: activeTab,
      })
    );
  }, [
    vehicleId,
    activeTab,
    pagination.currentPage,
    pagination.limit,
    dispatch,
  ]);

  const handlePageChange = (page) =>
    dispatch(
      getTripLogsByVehicle({
        vehicleId,
        page,
        limit: pagination.limit,
        type: activeTab,
      })
    );

  const handleLimitChange = (limit) =>
    dispatch(
      getTripLogsByVehicle({
        vehicleId,
        page: 1,
        limit,
        type: activeTab,
      })
    );

  /* ───────────────────────────── computed list */
  const filteredTrips = useMemo(() => {
    return vehicleWiseLogs;
  }, [vehicleWiseLogs]);

  /* ───────────────────────────── actions */
  const handleViewDetails = (trip) => {
    setSelectedTripForDetails(trip);
    setShowDetailsSidebar(true);
  };

  const handleViewMap = (trip) => {
    setSelectedTripForMap(trip);
    setShowMapModal(true);
  };

  /* ───────────────────────────── render */
  return (
    <div className="p-6">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane key="today" tab="Today's Trips">
          <Table
            rowKey="_id"
            loading={loading}
            pagination={false}
            dataSource={filteredTrips}
            columns={TripColumns({
              handleViewDetails,
              handleViewMap,
              socketConnected,
            })}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No trips scheduled"
                />
              ),
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane key="history" tab="Trip History">
          <Table
            rowKey="_id"
            loading={loading}
            pagination={false}
            dataSource={filteredTrips}
            columns={TripColumns({
              handleViewDetails,
              handleViewMap,
              socketConnected,
            })}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No historical trips found"
                />
              ),
            }}
          />
        </Tabs.TabPane>
      </Tabs>

      {/* <TripDetailsSidebar
        showDetailsSidebar={showDetailsSidebar}
        setShowDetailsSidebar={setShowDetailsSidebar}
        selectedTripForDetails={selectedTripForDetails}
        currentLocation={currentLocation}
      /> */}

      <Modal
        open={showMapModal}
        onCancel={() => setShowMapModal(false)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        destroyOnClose
        title={`Route Map: ${selectedTripForMap?.routeId?.routeName || "Trip"}`}
      >
        {selectedTripForMap && (
          <div style={{ height: "70vh" }}>
            <MapView
              trip={selectedTripForMap}
              stops={selectedTripForMap.stopLogs}
              currentLocation={
                selectedTripForMap._id === selectedTripForDetails?._id
                  ? currentLocation
                  : null
              }
            />
          </div>
        )}
      </Modal>

      {vehicleWiseLogs.length > 0 && (
        <Pagination
          page={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalRecords={pagination.totalItems}
          limit={pagination.limit}
          setPage={handlePageChange}
          setLimit={handleLimitChange}
        />
      )}
    </div>
  );
};

export default ViewTripsList;
