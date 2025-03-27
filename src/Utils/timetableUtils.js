import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import dayjs from "dayjs";

class ExportFunctions {
  constructor({
    viewMode,
    selectedDate,
    filteredTimetables,
    format,
    dayjs,
    isWithinValidity,
  }) {
    this.viewMode = viewMode;
    this.selectedDate = selectedDate;
    this.filteredTimetables = filteredTimetables;
    this.format = format;
    this.dayjs = dayjs;
    this.isWithinValidity = isWithinValidity;
  }

  getColorByType(type) {
    switch (type) {
      case "weekly":
        return "#FF99CC";
      case "exam":
        return "#29ABE2";
      case "event":
        return "#77DD77";
      case "others":
        return "#FFD700";
      default:
        return "#D3D3D3";
    }
  }

  getChartData() {
    return {
      labels: ["Weekly", "Exam", "Event", "Others"],
      datasets: [
        {
          data: [
            this.filteredTimetables.filter((t) => t?.type === "weekly").length,
            this.filteredTimetables.filter((t) => t?.type === "exam").length,
            this.filteredTimetables.filter((t) => t?.type === "event").length,
            this.filteredTimetables.filter((t) => t?.type === "others").length,
          ],
          backgroundColor: ["#FF99CC", "#29ABE2", "#77DD77", "#FFD700"],
          borderColor: "#fff",
          borderWidth: 4,
          hoverOffset: 20,
        },
      ],
    };
  }

  getChartOptions() {
    return {
      responsive: true,
      cutout: "50%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#333",
            font: {
              size: 12,
            },
            padding: 20,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          titleColor: "#fff",
          bodyColor: "#fff",
        },
        datalabels: {
          color: "#fff",
          display: false,
        },
      },
    };
  }

  handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: this.viewMode === "week" ? "landscape" : "portrait",
    });

    // Add title with gradient background
    doc.setFillColor(147, 51, 234); // Purple
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, "F");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("Timetable Report", 105, 15, { align: "center" });

    // Add date range
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`Date: ${this.format(new Date(), "MMMM dd, yyyy")}`, 14, 25);

    // Reset text color for content
    doc.setTextColor(0, 0, 0);

    // Prepare data based on current view
    let tableData = [];
    let columns = [];

    if (this.viewMode === "month") {
      // Month view export
      columns = ["Date", "Day", "Type", "Name", "Time", "Subject", "Teacher"];
      tableData = this.filteredTimetables.flatMap((timetable) =>
        timetable.days.flatMap(
          (day) =>
            day.slots?.map((slot) => ({
              date: day.date
                ? this.format(new Date(day.date), "dd MMM yyyy")
                : "Weekly",
              day:
                day.day ||
                (day.date ? this.format(new Date(day.date), "EEEE") : "Weekly"),
              type: timetable.type,
              name: timetable.name,
              time: `${this.dayjs(slot.startTime).format(
                "HH:mm"
              )} - ${this.dayjs(slot.endTime).format("HH:mm")}`,
              subject: slot.subjectId?.name || slot.eventName || "N/A",
              teacher: slot.teacherId?.name || "N/A",
            })) || []
        )
      );
    } else if (this.viewMode === "week") {
      // Week view export
      columns = ["Day", "Date", "Time", "Type", "Name", "Subject", "Teacher"];
      const dayOfWeek = +this.format(this.selectedDate, "i");
      const monday = new Date(this.selectedDate);
      monday.setDate(monday.getDate() - (dayOfWeek - 1));

      const daysInWeek = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
      });

      tableData = daysInWeek.flatMap((day) => {
        const dayString = this.format(day, "yyyy-MM-dd");
        return this.filteredTimetables.flatMap((tt) => {
          if (tt.type === "weekly") {
            if (!this.isWithinValidity(tt, day)) return [];
            return (
              tt.days
                ?.filter((d) => d.day === this.format(day, "EEEE"))
                .flatMap((d) =>
                  d.slots?.map((slot) => ({
                    day: this.format(day, "EEEE"),
                    date: this.format(day, "dd MMM yyyy"),
                    time: `${this.dayjs(slot.startTime).format(
                      "HH:mm"
                    )} - ${this.dayjs(slot.endTime).format("HH:mm")}`,
                    type: tt.type,
                    name: tt.name,
                    subject: slot.subjectId?.name || slot.eventName || "N/A",
                    teacher: slot.teacherId?.name || "N/A",
                  }))
                ) || []
            );
          }
          return (
            tt.days
              ?.filter(
                (d) =>
                  d.date &&
                  this.format(new Date(d.date), "yyyy-MM-dd") === dayString
              )
              .flatMap((d) =>
                d.slots?.map((slot) => ({
                  day: this.format(day, "EEEE"),
                  date: this.format(day, "dd MMM yyyy"),
                  time: `${this.dayjs(slot.startTime).format(
                    "HH:mm"
                  )} - ${this.dayjs(slot.endTime).format("HH:mm")}`,
                  type: tt.type,
                  name: tt.name,
                  subject: slot.subjectId?.name || slot.eventName || "N/A",
                  teacher: slot.teacherId?.name || "N/A",
                }))
              ) || []
          );
        });
      });
    } else {
      // Day view export
      columns = ["Time", "Type", "Name", "Subject", "Teacher"];
      const dayString = this.format(this.selectedDate, "yyyy-MM-dd");
      tableData = this.filteredTimetables
        .flatMap((tt) => {
          return (
            tt.days
              ?.filter(
                (d) =>
                  (d.date &&
                    this.format(new Date(d.date), "yyyy-MM-dd") ===
                      dayString) ||
                  (tt.type === "weekly" &&
                    d.day === this.format(this.selectedDate, "EEEE") &&
                    this.isWithinValidity(tt, this.selectedDate))
              )
              .flatMap((d) =>
                d.slots?.map((slot) => ({
                  time: `${this.dayjs(slot.startTime).format(
                    "HH:mm"
                  )} - ${this.dayjs(slot.endTime).format("HH:mm")}`,
                  type: tt.type,
                  name: tt.name,
                  subject: slot.subjectId?.name || slot.eventName || "N/A",
                  teacher: slot.teacherId?.name || "N/A",
                }))
              ) || []
          );
        })
        .sort((a, b) => a.time.localeCompare(b.time));
    }

    // Add table with gradient header
    doc.autoTable({
      head: [columns],
      body: tableData.map((item) =>
        columns.map((col) => item[col.toLowerCase()])
      ),
      startY: 40,
      headStyles: {
        fillColor: [236, 72, 153], // Pink
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [249, 240, 243], // Light pink
      },
      margin: { top: 40 },
    });

    doc.save(`timetable-${this.viewMode}-view.pdf`);
  };

  handlePrint = () => {
    const printWindow = window.open("", "_blank");

    // Prepare content based on current view
    let content = "";

    if (this.viewMode === "month") {
      // Month view print
      content = `
        <h1>Timetable Report (Month View)</h1>
        <p>Generated on: ${this.format(new Date(), "MMMM dd, yyyy")}</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>Type</th>
              <th>Name</th>
              <th>Time</th>
              <th>Subject</th>
              <th>Teacher</th>
            </tr>
          </thead>
          <tbody>
            ${this.filteredTimetables
              .flatMap((timetable) =>
                timetable.days.flatMap(
                  (day) =>
                    day.slots?.map(
                      (slot) => `
                  <tr>
                    <td>${
                      day.date
                        ? this.format(new Date(day.date), "dd MMM yyyy")
                        : "Weekly"
                    }</td>
                    <td>${
                      day.day ||
                      (day.date
                        ? this.format(new Date(day.date), "EEEE")
                        : "Weekly")
                    }</td>
                    <td>${timetable.type}</td>
                    <td>${timetable.name}</td>
                    <td>${this.dayjs(slot.startTime).format(
                      "HH:mm"
                    )} - ${this.dayjs(slot.endTime).format("HH:mm")}</td>
                    <td>${slot.subjectId?.name || slot.eventName || "N/A"}</td>
                    <td>${slot.teacherId?.name || "N/A"}</td>
                  </tr>
                `
                    ) || []
                )
              )
              .join("")}
          </tbody>
        </table>
      `;
    } else if (this.viewMode === "week") {
      // Week view print
      const dayOfWeek = +this.format(this.selectedDate, "i");
      const monday = new Date(this.selectedDate);
      monday.setDate(monday.getDate() - (dayOfWeek - 1));

      const daysInWeek = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
      });

      content = `
        <h1>Timetable Report (Week View)</h1>
        <p>Week of ${this.format(daysInWeek[0], "dd MMM")} - ${this.format(
        daysInWeek[6],
        "dd MMM"
      )}</p>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Date</th>
              <th>Time</th>
              <th>Type</th>
              <th>Name</th>
              <th>Subject</th>
              <th>Teacher</th>
            </tr>
          </thead>
          <tbody>
            ${daysInWeek
              .flatMap((day) => {
                const dayString = this.format(day, "yyyy-MM-dd");
                return this.filteredTimetables.flatMap((tt) => {
                  if (tt.type === "weekly") {
                    if (!this.isWithinValidity(tt, day)) return [];
                    return (
                      tt.days
                        ?.filter((d) => d.day === this.format(day, "EEEE"))
                        .flatMap((d) =>
                          d.slots?.map(
                            (slot) => `
                      <tr>
                        <td>${this.format(day, "EEEE")}</td>
                        <td>${this.format(day, "dd MMM yyyy")}</td>
                        <td>${this.dayjs(slot.startTime).format(
                          "HH:mm"
                        )} - ${this.dayjs(slot.endTime).format("HH:mm")}</td>
                        <td>${tt.type}</td>
                        <td>${tt.name}</td>
                        <td>${
                          slot.subjectId?.name || slot.eventName || "N/A"
                        }</td>
                        <td>${slot.teacherId?.name || "N/A"}</td>
                      </tr>
                    `
                          )
                        ) || []
                    );
                  }
                  return (
                    tt.days
                      ?.filter(
                        (d) =>
                          d.date &&
                          this.format(new Date(d.date), "yyyy-MM-dd") ===
                            dayString
                      )
                      .flatMap((d) =>
                        d.slots?.map(
                          (slot) => `
                    <tr>
                      <td>${this.format(day, "EEEE")}</td>
                      <td>${this.format(day, "dd MMM yyyy")}</td>
                      <td>${this.dayjs(slot.startTime).format(
                        "HH:mm"
                      )} - ${this.dayjs(slot.endTime).format("HH:mm")}</td>
                      <td>${tt.type}</td>
                      <td>${tt.name}</td>
                      <td>${
                        slot.subjectId?.name || slot.eventName || "N/A"
                      }</td>
                      <td>${slot.teacherId?.name || "N/A"}</td>
                    </tr>
                  `
                        )
                      ) || []
                  );
                });
              })
              .join("")}
          </tbody>
        </table>
      `;
    } else {
      // Day view print
      // Day view export with corrected chaining
      const dayString = this.format(this.selectedDate, "yyyy-MM-dd");
      content = `
  <h1>Timetable Report (Day View)</h1>
  <p>Date: ${this.format(this.selectedDate, "EEEE, dd MMM yyyy")}</p>
  <table>
    <thead>
      <tr>
        <th>Time</th>
        <th>Type</th>
        <th>Name</th>
        <th>Subject</th>
        <th>Teacher</th>
      </tr>
    </thead>
    <tbody>
      ${this.filteredTimetables
        .flatMap((tt) => {
          // Filter the days first, then flatMap over the slots
          const filteredDays =
            tt.days?.filter(
              (d) =>
                (d.date &&
                  this.format(new Date(d.date), "yyyy-MM-dd") === dayString) ||
                (tt.type === "weekly" &&
                  d.day === this.format(this.selectedDate, "EEEE") &&
                  this.isWithinValidity(tt, this.selectedDate))
            ) || [];

          return filteredDays.flatMap(
            (d) =>
              d.slots?.map(
                (slot) => `
            <tr>
              <td>${this.dayjs(slot.startTime).format("HH:mm")} - ${this.dayjs(
                  slot.endTime
                ).format("HH:mm")}</td>
              <td>${tt.type}</td>
              <td>${tt.name}</td>
              <td>${slot.subjectId?.name || slot.eventName || "N/A"}</td>
              <td>${slot.teacherId?.name || "N/A"}</td>
            </tr>
          `
              ) || []
          );
        })
        .sort((a, b) => {
          const aTime =
            a.match(/<td>(\d{2}:\d{2}) - \d{2}:\d{2}<\/td>/)?.[1] || "";
          const bTime =
            b.match(/<td>(\d{2}:\d{2}) - \d{2}:\d{2}<\/td>/)?.[1] || "";
          return aTime.localeCompare(bTime);
        })
        .join("")}
    </tbody>
  </table>
`;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Timetable Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #6B46C1; text-align: center; margin-bottom: 10px; }
            .report-info { text-align: center; margin-bottom: 20px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: linear-gradient(to right, #8B5CF6, #EC4899); color: white; padding: 10px; text-align: left; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
            tr:nth-child(even) { background-color: #F9F0F3; }
            @media print {
              body { margin: 0; padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${content}
          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()" style="padding: 8px 16px; background: linear-gradient(to right, #8B5CF6, #EC4899); color: white; border: none; border-radius: 4px; cursor: pointer;">Print</button>
            <button onclick="window.close()" style="padding: 8px 16px; margin-left: 10px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 200);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };
}

export default ExportFunctions;
