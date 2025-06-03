import React from "react";
import { Skeleton, Divider, Card, Tag, Button } from "antd";
import { Doughnut } from "react-chartjs-2";
import { AiOutlineClear } from "react-icons/ai";

/**
 * Sidebar component showing statistics and filters
 * @param {Object} props - Component props
 */
const StatsSidebar = ({
  loadingFetch,
  loadingChildren,
  role,
  filteredTimetables,
  TIMETABLE_TYPES,
  filterType,
  setFilterType,
  clearAllFilters,
  exportFunctions,
  userDetails,
  children,
  selectedChildId,
  t,
}) => {
  // Loading state
  if (loadingFetch || (role === "parent" && loadingChildren)) {
    return (
      <div className="w-72 border-l p-4 bg-white flex flex-col justify-between fixed right-0 h-full overflow-y-auto">
        <div className="space-y-4">
          <Skeleton.Input active size="default" style={{ width: 150 }} />
          <div className="flex flex-col gap-2">
            <Skeleton.Button active block size="large" />
            <Skeleton.Button active block size="large" />
          </div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="border-l-4 p-2 h-[60px] flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Skeleton.Avatar
                    active
                    size={32}
                    shape="square"
                    className="mr-2"
                  />
                  <Skeleton.Input active size="small" style={{ width: 80 }} />
                </div>
                <Skeleton.Input active size="small" style={{ width: 30 }} />
              </div>
            ))}
          </div>
          <div className="border rounded p-4">
            <Skeleton.Input
              active
              size="default"
              style={{ width: 150, margin: "0 auto" }}
            />
            <div className="flex justify-center mt-4">
              <Skeleton.Avatar active size={200} shape="circle" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 border-l p-4 bg-white flex flex-col justify-between fixed right-0 h-full overflow-y-auto">
      <div>
        <div className="flex justify-between items-center px-1 mb-4">
          <h3 className="text-lg font-semibold">{t("Stats & Filters")}</h3>
          {filterType && (
            <Button
              type="default"
              onClick={clearAllFilters}
              icon={<AiOutlineClear />}
              danger
            >
              {t("Clear")}
            </Button>
          )}
        </div>

        {/* Timetable Type Stats */}
        <div className="space-y-2 mb-4">
          {TIMETABLE_TYPES.map((stat) => {
            const count = filteredTimetables.filter(
              (t) => t.type === stat.type
            ).length;
            return (
              <Card
                key={stat.type}
                className={`cursor-pointer transition-all ${filterType === stat.type ? "ring-2 ring-offset-4" : ""
                  }`}
                style={{
                  borderLeft: `4px solid ${stat.color}`,
                  transform:
                    filterType === stat.type ? "scale(1.02)" : "scale(1)",
                  height: "60px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                onClick={() =>
                  setFilterType(filterType === stat.type ? null : stat.type)
                }
                bodyStyle={{ padding: "8px" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded mr-2"
                      style={{ backgroundColor: stat.bgColor }}
                    >
                      {stat.icon}
                    </div>
                    <span className="text-xs">{stat.label}</span>
                  </div>
                  <span
                    className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white rounded-full"
                    style={{ backgroundColor: stat.color }}
                  >
                    {count}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        <Divider />

        {/* Doughnut Chart */}
        <div className="border rounded p-4 mb-4">
          <h4 className="font-semibold mb-2 text-center">
            {t("Timetable Types")}
          </h4>
          {filteredTimetables.length > 0 ? (
            <Doughnut
              data={exportFunctions.getChartData()}
              options={exportFunctions.getChartOptions()}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-500">
                {t("No timetable data available")}
              </p>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="border rounded p-4">
          <h4 className="font-semibold mb-2">
            {role === "student"
              ? t("Your Schedule Info")
              : selectedChildId
                ? t("Child's Schedule Info")
                : t("Schedule Info")}
          </h4>
          <div className="space-y-2">
            {role === "student" ? (
              <>
                <div>
                  <span className="text-gray-600 text-sm">{t("Class:")}</span>
                  <Tag color="blue" className="ml-2">
                    {userDetails.className || t("No Class")}
                  </Tag>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">{t("Section:")}</span>
                  <Tag color="purple" className="ml-2">
                    {userDetails.section || t("No Section")}
                  </Tag>
                </div>
              </>
            ) : selectedChildId ? (
              <>
                <div>
                  <span className="text-gray-600 text-sm">{t("Child:")}</span>
                  <Tag color="blue" className="ml-2">
                    {children.find((c) => c.id === selectedChildId)?.name ||
                      t("No Child Selected")}
                  </Tag>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">{t("Class:")}</span>
                  <Tag color="blue" className="ml-2">
                    {children.find((c) => c.id === selectedChildId)?.class ||
                      t("No Class")}
                  </Tag>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">{t("Section:")}</span>
                  <Tag color="purple" className="ml-2">
                    {children.find((c) => c.id === selectedChildId)?.section ||
                      t("No Section")}
                  </Tag>
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-sm">
                {t("No child selected")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSidebar;