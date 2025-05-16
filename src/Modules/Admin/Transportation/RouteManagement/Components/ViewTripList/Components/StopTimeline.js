import React from "react";
import { Timeline, Tag } from "antd";
import dayjs from "dayjs";

/* colour maps come from parent via props */
const StopTimeline = ({ logs, colourMap, textMap }) => {
  const fmt = (d) => (d ? dayjs(d).format("ddd, MMM D • h:mm A") : "—");

  return (
    <Timeline mode="left" className="custom-timeline">
      {logs.map((log, i) => (
        <Timeline.Item
          key={i}
          color={colourMap[log.status] || "gray"}
          dot={<div className={`timeline-dot ${log.status}`} />}
          label={
            <div className="bg-white p-3 rounded-lg shadow-xs border border-gray-100">
              <div className="font-semibold text-gray-800 flex items-center">
                <span
                  className="stop-order mr-2 bg-indigo-100 text-indigo-800 rounded-full w-6 h-6
                                 flex items-center justify-center text-xs"
                >
                  {log.order}
                </span>
                {log.stopId?.stopName}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {fmt(log.scheduledArrival)} → {fmt(log.scheduledDeparture)}
              </div>
            </div>
          }
        >
          <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-100 ml-4">
            <Tag color={colourMap[log.status]}>{textMap[log.status]}</Tag>
            {log.notes && (
              <div className="text-sm mt-2 text-gray-600">
                <strong>Notes:</strong> {log.notes}
              </div>
            )}
          </div>
        </Timeline.Item>
      ))}
    </Timeline>
  );
};

export default StopTimeline;
