import React from "react";
import { Card, Button, Tag } from "antd";
import {
  CalendarOutlined,
  BookOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  AiOutlineFilePdf,
  AiOutlinePrinter,
  AiOutlineFunnelPlot,
} from "react-icons/ai";

const TIMETABLE_TYPES = [
  {
    type: "weekly",
    label: "Weekly",
    icon: <CalendarOutlined />,
    color: "#FF99CC",
    bgColor: "rgba(255,153,204,0.2)",
  },
  {
    type: "exam",
    label: "Exams",
    icon: <BookOutlined />,
    color: "#29ABE2",
    bgColor: "rgba(41,171,226,0.2)",
  },
  {
    type: "event",
    label: "Events",
    icon: <CalendarOutlined />,
    color: "#77DD77",
    bgColor: "rgba(119,221,119,0.2)",
  },
  {
    type: "others",
    label: "Others",
    icon: <TeamOutlined />,
    color: "#FFD700",
    bgColor: "rgba(255,215,0,0.2)",
  },
];

export default function StatsSection({
  filteredTimetables,
  filterType,
  setFilterType,
  onExportPDF,
  onPrint,
  onAddTimetable,
  filters,
  onRemoveFilter,
  onOpenFilterDrawer,
  onClearFilters,
  onFilterChange, // Added this prop
  classList,
  sectionList,
  groupsList,
  allSubjects,
  reduxSemesters,
}) {
  const getFilterDisplayName = (key, value) => {
    switch (key) {
      case "class":
        return classList.find((item) => item._id === value)?.className || value;
      case "sections":
        return sectionList
          .filter((item) => value.includes(item._id))
          .map((item) => item.sectionName)
          .join(", ");
      case "groups":
        return groupsList
          .filter((item) => value.includes(item._id))
          .map((item) => item.groupName)
          .join(", ");
      case "subject":
        return allSubjects.find((item) => item._id === value)?.name || value;
      case "semester":
        return reduxSemesters.find((item) => item._id === value)?.name || value;
      default:
        return value;
    }
  };

  const filterTags = Object.entries(filters)
    .filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined;
    })
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((val) => ({
          key: `${key}-${val}`,
          filterKey: key,
          value: val,
          display: getFilterDisplayName(key, [val]),
        }));
      }
      return [
        {
          key,
          filterKey: key,
          value,
          display: getFilterDisplayName(key, value),
        },
      ];
    });

  const isAnyFilterApplied = filterTags.length > 0 || filterType !== null;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 flex-wrap items-center justify-between">
          {/* {filterTags.map(({ key, filterKey, value, display }) => (
            <Tag
              closable
              key={key}
              onClose={() => {
                if (Array.isArray(filters[filterKey])) {
                  onFilterChange(
                    filterKey,
                    filters[filterKey].filter((v) => v !== value)
                  );
                } else {
                  onRemoveFilter(filterKey);
                }
              }}
            >
              {`${filterKey}: ${display}`}
            </Tag>
          ))} */}
          <Button
            className="w-full"
            icon={<AiOutlineFunnelPlot />}
            onClick={onOpenFilterDrawer}
          >
            Filters
            {filterTags.length > 0 && (
              <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-pink-500 rounded-full">
                {filterTags.length}
              </span>
            )}
          </Button>
        </div>

        {isAnyFilterApplied && (
          <Button className="w-full ms-2"  onClick={onClearFilters}>
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {TIMETABLE_TYPES.map((stat) => {
          const count = filteredTimetables.filter(
            (t) => t.type === stat.type
          ).length;
          return (
            <Card
              key={stat.type}
              className={`cursor-pointer transition-all ${
                filterType === stat.type ? "ring-2 ring-offset-4" : ""
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
              onClick={() => setFilterType(stat.type)}
              bodyStyle={{ padding: "8px" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-8 h-8 flex items-center justify-center rounded mr-2"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    {React.cloneElement(stat.icon, { className: "text-sm" })}
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
    </div>
  );
}
