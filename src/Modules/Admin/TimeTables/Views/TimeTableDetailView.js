import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton, Radio, Button, Tag } from "antd";
import dayjs from "dayjs";
import { format } from "date-fns";
import { LeftOutlined } from "@ant-design/icons";

// Example color logic
function getTypeColor(type) {
  switch (type) {
    case "weekly":
      return "pink";
    case "exam":
      return "blue";
    case "event":
      return "green";
    case "others":
      return "yellow";
    default:
      return "default";
  }
}

export default function TimeTableDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Example local states
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("week"); // "day" or "week"

  // Simulate fetch from an API or Redux state
  useEffect(() => {
    setLoading(true);
    // pretend we fetch from some endpoint: /api/timetables/:id
    fetchOneTimetable(id)
      .then((data) => {
        setTimetable(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch timetable:", err);
        setLoading(false);
      });
  }, [id]);

  // A mock function that simulates an API call or a Redux "get" thunk
  const fetchOneTimetable = async (timetableId) => {
    // In a real app, you'd call your backend or retrieve from Redux store
    // This is just a placeholder that resolves a sample object
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          _id: timetableId,
          name: "Sample Timetable",
          type: "weekly",
          status: "active",
          validity: {
            startDate: "2025-01-01T00:00:00.000Z",
            endDate: "2025-02-01T00:00:00.000Z",
          },
          days: [
            {
              date: "2025-01-05T00:00:00.000Z",
              slots: [
                {
                  startTime: "2025-01-05T09:00:00.000Z",
                  endTime: "2025-01-05T11:00:00.000Z",
                  eventName: "Math Class",
                  description: "Algebra basics",
                },
              ],
            },
          ],
        });
      }, 1000);
    });
  };

  // Helpers to handle invalid date
  const formatDate = (dateStr, pattern = "dd-MM-yyyy") => {
    if (!dateStr) return "N/A";
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? "N/A" : format(parsed, pattern);
  };

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton active />
      </div>
    );
  }

  if (!timetable) {
    return (
      <div className="p-4">
        <p>Timetable not found.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  // color-coded type
  const typeTag = (
    <Tag color={getTypeColor(timetable.type)}>{timetable.type}</Tag>
  );
  const statusTag =
    timetable.status === "active" ? (
      <Tag color="green">Active</Tag>
    ) : (
      <Tag color="red">Inactive</Tag>
    );

  // Example day or week view
  // If "day" is selected, display a day-based breakdown
  // If "week" is selected, display a 7-day range, etc.
  // We'll just do minimal sample. You can integrate your existing DayView/WeekView logic, color-coded by type

  return (
    <div className="p-4">
      <Button icon={<LeftOutlined />} onClick={() => navigate(-1)}>
        Back
      </Button>
      <h2 className="text-2xl font-semibold mt-2">{timetable.name}</h2>
      <p>
        Type: {typeTag} &nbsp; Status: {statusTag}
      </p>
      <p>
        Valid from: {formatDate(timetable.validity?.startDate, "dd-MM-yyyy")} to{" "}
        {formatDate(timetable.validity?.endDate, "dd-MM-yyyy")}
      </p>
      <div className="my-4">
        <Radio.Group
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
        >
          <Radio.Button value="day">Day View</Radio.Button>
          <Radio.Button value="week">Week View</Radio.Button>
        </Radio.Group>
      </div>

      {viewMode === "day" ? (
        <DayBreakdown timetable={timetable} />
      ) : (
        <WeekBreakdown timetable={timetable} />
      )}
    </div>
  );
}

// EXAMPLE minimal Day Breakdown
function DayBreakdown({ timetable }) {
  if (!timetable?.days?.length) {
    return <p>No day data.</p>;
  }
  // Just show the first day as an example
  const dayObj = timetable.days[0];
  if (!dayObj) return <p>No days found.</p>;

  const dateLabel = dayObj.date
    ? format(new Date(dayObj.date), "EEEE, dd MMM yyyy")
    : "No Date";

  return (
    <div>
      <h4>{dateLabel}</h4>
      {dayObj.slots?.length
        ? dayObj.slots.map((slot, idx) => {
            const startTime = slot.startTime
              ? formatDateTime(slot.startTime)
              : "";
            const endTime = slot.endTime ? formatDateTime(slot.endTime) : "";
            return (
              <div
                key={idx}
                style={{
                  border: "1px solid #ddd",
                  marginBottom: "1rem",
                  padding: "0.5rem",
                }}
              >
                <strong>{slot.eventName}</strong>
                <p>
                  {startTime} - {endTime}
                </p>
                {slot.description && <p>{slot.description}</p>}
              </div>
            );
          })
        : "No slots for this day."}
    </div>
  );
}

// EXAMPLE minimal Week Breakdown
function WeekBreakdown({ timetable }) {
  // For demonstration, show a 7-day block from the first day in the timetable
  if (!timetable?.days?.length) {
    return <p>No weekly data.</p>;
  }
  // Suppose the user wants to see a 7-day range from the earliest day
  // In a real app, you'd pick a date from the timetable or from user input
  return (
    <div>
      <h4>Week Overview</h4>
      {timetable.days.map((dayObj, i) => {
        const dateLabel = dayObj.date
          ? format(new Date(dayObj.date), "EEEE, dd MMM yyyy")
          : "No Date";
        return (
          <div key={i} style={{ marginBottom: "1rem" }}>
            <h5 style={{ fontWeight: "bold" }}>{dateLabel}</h5>
            {dayObj.slots?.length ? (
              dayObj.slots.map((slot, idx) => {
                const startTime = slot.startTime
                  ? formatDateTime(slot.startTime)
                  : "";
                const endTime = slot.endTime
                  ? formatDateTime(slot.endTime)
                  : "";
                return (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid #ddd",
                      marginBottom: "0.5rem",
                      padding: "0.5rem",
                    }}
                  >
                    <strong>{slot.eventName}</strong>
                    <p>
                      {startTime} - {endTime}
                    </p>
                    {slot.description && <p>{slot.description}</p>}
                  </div>
                );
              })
            ) : (
              <p>No slots for this day.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Utility for date/time formatting (with invalid checks)
function formatDateTime(dateStr) {
  if (!dateStr) return "";
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return "Invalid date";
  return format(parsed, "h:mm a");
}
