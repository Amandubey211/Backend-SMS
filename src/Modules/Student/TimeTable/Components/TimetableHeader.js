import React from "react";
import { Radio, Button, Popover } from "antd";
import {
  AiOutlineFilter,
  AiOutlineFilePdf,
  AiOutlinePrinter,
} from "react-icons/ai";
import NavigationControls from "../../../Admin/TimeTables/Components/NavigationControls";

/**
 * Header component for timetable with view controls and export options
 * @param {Object} props - Component props
 */
const TimetableHeader = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  viewMode,
  setViewMode,
  exportFunctions,
  selectedDate,
  setSelectedDate,
  t,
}) => {
  // Export options content for popover
  const exportContent = (
    <div className="flex flex-col gap-2 p-2">
      <Button
        icon={<AiOutlineFilePdf />}
        onClick={exportFunctions.handleExportPDF}
        className="flex items-center"
      >
        {t("Export as PDF")}
      </Button>
      <Button
        icon={<AiOutlinePrinter />}
        onClick={exportFunctions.handlePrint}
        className="flex items-center"
      >
        {t("Print")}
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button
            type="default"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            icon={<AiOutlineFilter />}
          >
            {sidebarCollapsed ? t("Show Stats") : t("Hide Stats")}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Radio.Group
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="day">{t("Day")}</Radio.Button>
            <Radio.Button value="week">{t("Week")}</Radio.Button>
            <Radio.Button value="month">{t("Month")}</Radio.Button>
          </Radio.Group>
          <Popover
            content={exportContent}
            trigger="click"
            placement="bottomRight"
          >
            <Button>{t("Export")}</Button>
          </Popover>
        </div>
      </div>
      <NavigationControls
        selectedDate={selectedDate}
        viewMode={viewMode}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
};

export default TimetableHeader;
