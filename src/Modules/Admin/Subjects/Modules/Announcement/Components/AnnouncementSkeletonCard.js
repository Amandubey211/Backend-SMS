import React from "react";
import { Skeleton, Divider } from "antd";
import { Tag } from "antd";

const AnnouncementSkeletonCard = () => {
  return (
    <div className="ps-1 rounded-md h-40 hover:scale-105 transition-all duration-200 ease-in-out hover:shadow-lg">
      <div className="border rounded-md shadow-sm relative flex flex-col bg-white p-4 h-40">
        {/* Skeleton for badge placeholder */}
        <div className="absolute top-2 right-2">
          <Skeleton.Avatar active size="small" shape="circle" />
        </div>
        <div className="flex flex-col h-full justify-between">
          <div>
            <Skeleton.Input
              style={{ width: 150, marginBottom: 8 }}
              active
              size="small"
            />
            <Skeleton.Input
              style={{ width: 100, marginBottom: 8 }}
              active
              size="small"
            />
            <Skeleton.Input
              style={{ width: 80, marginBottom: 8 }}
              active
              size="small"
            />
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Skeleton.Input
              style={{ width: 80, marginRight: 8 }}
              active
              size="small"
            />
            <Divider type="vertical" />
            <Skeleton.Input style={{ width: 80 }} active size="small" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementSkeletonCard;
