import React from "react";
import { Button } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { addDays, subDays } from "date-fns";

export default function NavigationControls({
  selectedDate,
  viewMode,
  setSelectedDate,
}) {
  const navigateToToday = () => setSelectedDate(new Date());

  const navigateToPrevious = () => {
    const newDate =
      viewMode === "day"
        ? subDays(selectedDate, 1)
        : viewMode === "week"
        ? subDays(selectedDate, 7)
        : subDays(selectedDate, 30);
    setSelectedDate(newDate);
  };

  const navigateToNext = () => {
    const newDate =
      viewMode === "day"
        ? addDays(selectedDate, 1)
        : viewMode === "week"
        ? addDays(selectedDate, 7)
        : addDays(selectedDate, 30);
    setSelectedDate(newDate);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <Button icon={<ArrowLeftOutlined />} onClick={navigateToPrevious} />
      <Button type="text" onClick={navigateToToday}>
        Today
      </Button>
      <Button icon={<ArrowRightOutlined />} onClick={navigateToNext} />
    </div>
  );
}
