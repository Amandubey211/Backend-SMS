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
      // case "weekly":
      //   return "#FF99CC"; // from TIMETABLE_TYPES
      case "exam":
        return "#29ABE2";
      case "event":
        return "#77DD77";
      case "others":
        return "#FFD700";
      default:
        return "#6B7280"; // Gray fallback
    }
  }

  getLightColorByType(type) {
    switch (type) {
      // case "weekly":
      //   return "rgba(255,153,204,0.2)";
      case "exam":
        return "rgba(41,171,226,0.2)";
      case "event":
        return "rgba(119,221,119,0.2)";
      case "others":
        return "rgba(255,215,0,0.2)";
      default:
        return "#F3F4F6"; // Light gray fallback
    }
  }

  getChartData() {
    return {
      // labels: ["Weekly", "Exam", "Event", "Others"],
      labels: ["Exam", "Event", "Others"],
      datasets: [
        {
          data: [
            // this.filteredTimetables.filter((t) => t?.type === "weekly").length,
            this.filteredTimetables.filter((t) => t?.type === "exam").length,
            this.filteredTimetables.filter((t) => t?.type === "event").length,
            this.filteredTimetables.filter((t) => t?.type === "others").length,
          ],
          // backgroundColor: ["#FF99CC", "#29ABE2", "#77DD77", "#FFD700"],
          backgroundColor: ["#29ABE2", "#77DD77", "#FFD700"],
          borderColor: "#fff",
          borderWidth: 2,
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
            color: "#111827",
            font: {
              size: 10,
              family: "Helvetica",
            },
            padding: 12,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          backgroundColor: "#1F2937",
          titleColor: "#F9FAFB",
          bodyColor: "#F9FAFB",
          titleFont: {
            family: "Helvetica",
            size: 12,
          },
          bodyFont: {
            family: "Helvetica",
            size: 10,
          },
        },
      },
    };
  }

  addHeader(doc, title, subtitle = "") {
    // Add gradient header
    doc.setFillColor(79, 70, 229); // Indigo
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 24, "F");

    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(title, 14, 16);

    // Add subtitle if provided
    if (subtitle) {
      doc.setFontSize(10);
      doc.text(subtitle, 14, 22);
    }

    // Add logo or school info (optional)
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(
      `Generated on: ${this.format(new Date(), "MMM dd, yyyy hh:mm a")}`,
      doc.internal.pageSize.getWidth() - 14,
      16,
      { align: "right" }
    );

    // Reset text color for content
    doc.setTextColor(0, 0, 0);
  }
  addFooter(doc) {
    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }
  }

  handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: this.viewMode === "week" ? "landscape" : "portrait",
      unit: "mm",
    });

    // Set default font
    doc.setFont("helvetica");

    // Prepare title based on view mode
    let title = "Timetable Report";
    let subtitle = "";

    if (this.viewMode === "month") {
      title = "Monthly Timetable";
      subtitle = `For ${this.format(this.selectedDate, "MMMM yyyy")}`;
    } else if (this.viewMode === "week") {
      const dayOfWeek = +this.format(this.selectedDate, "i");
      const monday = new Date(this.selectedDate);
      monday.setDate(monday.getDate() - (dayOfWeek - 1));

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      title = "Weekly Timetable";
      subtitle = `${this.format(monday, "MMM dd")} - ${this.format(
        sunday,
        "MMM dd, yyyy"
      )}`;
    } else {
      title = "Daily Timetable";
      subtitle = this.format(this.selectedDate, "EEEE, MMMM dd, yyyy");
    }

    this.addHeader(doc, title, subtitle);

    // Prepare data based on current view
    let tableData = [];
    let columns = [];
    let columnStyles = {};

    if (this.viewMode === "month") {
      // Month view export
      columns = [
        { header: "Date", dataKey: "date" },
        { header: "Day", dataKey: "day" },
        // { header: "Type", dataKey: "type" },
        { header: "Name", dataKey: "name" },
        { header: "Time", dataKey: "time" },
        { header: "Subject/Event", dataKey: "subject" },
        { header: "Teacher", dataKey: "teacher" },
      ];

      columnStyles = {
        date: { cellWidth: 20 },
        day: { cellWidth: 15 },
        type: { cellWidth: 15 },
        name: { cellWidth: 25 },
        time: { cellWidth: 20 },
        subject: { cellWidth: 30 },
        teacher: { cellWidth: 25 },
      };

      tableData = this.filteredTimetables.flatMap((timetable) =>
        timetable.days.flatMap(
          (day) =>
            day.slots?.map((slot) => ({
              date: day.date
                ? this.format(new Date(day.date), "dd MMM")
                : "Weekly",
              day:
                day.day ||
                (day.date ? this.format(new Date(day.date), "EEE") : "Weekly"),
              type: timetable.type,
              name: timetable.name || "N/A",
              time: `${this.dayjs(slot.startTime).format(
                "hh:mm A"
              )} - ${this.dayjs(slot.endTime).format("hh:mm A")}`,
              subject: slot.subjectId?.name || slot.eventName || "N/A",
              teacher: slot.teacherId?.name || "N/A",
              rowColor: this.getLightColorByType(timetable.type),
              textColor: this.getColorByType(timetable.type),
            })) || []
        )
      );
    } else if (this.viewMode === "week") {
      // Week view export
      columns = [
        { header: "Day", dataKey: "day" },
        { header: "Date", dataKey: "date" },
        { header: "Time", dataKey: "time" },
        { header: "Type", dataKey: "type" },
        { header: "Name", dataKey: "name" },
        { header: "Subject/Event", dataKey: "subject" },
        { header: "Teacher", dataKey: "teacher" },
      ];

      columnStyles = {
        day: { cellWidth: 15 },
        date: { cellWidth: 15 },
        time: { cellWidth: 20 },
        type: { cellWidth: 15 },
        name: { cellWidth: 25 },
        subject: { cellWidth: 30 },
        teacher: { cellWidth: 25 },
      };

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
                    day: this.format(day, "EEE"),
                    date: this.format(day, "dd MMM"),
                    time: `${this.dayjs(slot.startTime).format(
                      "hh:mm A"
                    )} - ${this.dayjs(slot.endTime).format("hh:mm A")}`,
                    type: tt.type,
                    name: tt.name || "N/A",
                    subject: slot.subjectId?.name || slot.eventName || "N/A",
                    teacher: slot.teacherId?.name || "N/A",
                    rowColor: this.getLightColorByType(tt.type),
                    textColor: this.getColorByType(tt.type),
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
                  day: this.format(day, "EEE"),
                  date: this.format(day, "dd MMM"),
                  time: `${this.dayjs(slot.startTime).format(
                    "hh:mm A"
                  )} - ${this.dayjs(slot.endTime).format("hh:mm A")}`,
                  type: tt.type,
                  name: tt.name || "N/A",
                  subject: slot.subjectId?.name || slot.eventName || "N/A",
                  teacher: slot.teacherId?.name || "N/A",
                  rowColor: this.getLightColorByType(tt.type),
                  textColor: this.getColorByType(tt.type),
                }))
              ) || []
          );
        });
      });
    } else {
      // Day view export
      columns = [
        { header: "Time", dataKey: "time" },
        { header: "Type", dataKey: "type" },
        { header: "Name", dataKey: "name" },
        { header: "Subject/Event", dataKey: "subject" },
        { header: "Teacher", dataKey: "teacher" },
      ];

      columnStyles = {
        time: { cellWidth: 25 },
        type: { cellWidth: 20 },
        name: { cellWidth: 30 },
        subject: { cellWidth: 40 },
        teacher: { cellWidth: 35 },
      };

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
                    "hh:mm A"
                  )} - ${this.dayjs(slot.endTime).format("hh:mm A")}`,
                  type: tt.type,
                  name: tt.name || "N/A",
                  subject: slot.subjectId?.name || slot.eventName || "N/A",
                  teacher: slot.teacherId?.name || "N/A",
                  rowColor: this.getLightColorByType(tt.type),
                  textColor: this.getColorByType(tt.type),
                }))
              ) || []
          );
        })
        .sort((a, b) => a.time.localeCompare(b.time));
    }

    // Add summary section
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text(`Total Entries: ${tableData.length}`, 14, 30);

    // Add table with styling
    doc.autoTable({
      columns,
      body: tableData,
      startY: 35,
      margin: { top: 35, right: 14, bottom: 20, left: 14 },
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 4,
        overflow: "linebreak",
        halign: "left",
        valign: "middle",
      },
      headStyles: {
        fillColor: [31, 41, 55], // Gray-800
        textColor: 255,
        fontStyle: "bold",
        fontSize: 9,
        halign: "center",
      },
      columnStyles,
      bodyStyles: {
        textColor: [31, 41, 55], // Gray-800
        lineColor: [229, 231, 235], // Gray-200
        lineWidth: 0.2,
      },
      didParseCell: (data) => {
        if (data.section === "body") {
          // Apply row-specific styling
          if (data.row.raw.rowColor) {
            data.cell.styles.fillColor = hexToRgb(data.row.raw.rowColor);
          }
          if (data.row.raw.textColor) {
            data.cell.styles.textColor = hexToRgb(data.row.raw.textColor);
          }
        }
      },
      willDrawCell: (data) => {
        // Add type indicator dots
        if (data.column.dataKey === "type" && data.section === "body") {
          const type = data.cell.raw;
          const color = this.getColorByType(type);

          doc.setFillColor(color);
          doc.circle(
            data.cell.x + 3,
            data.cell.y + data.cell.height / 2,
            2,
            "F"
          );

          // Adjust text position
          data.cell.text = [type.charAt(0).toUpperCase() + type.slice(1)];
          data.cell.x += 6;
        }
      },
    });

    // Add footer
    this.addFooter(doc);

    // Save the PDF
    doc.save(
      `timetable-${this.viewMode}-${this.format(new Date(), "yyyyMMdd")}.pdf`
    );
  };

  handlePrint = () => {
    const printWindow = window.open("", "_blank");

    // Prepare title based on view mode
    let title = "Timetable Report";
    let subtitle = "";

    if (this.viewMode === "month") {
      title = "Monthly Timetable";
      subtitle = `For ${this.format(this.selectedDate, "MMMM yyyy")}`;
    } else if (this.viewMode === "week") {
      const dayOfWeek = +this.format(this.selectedDate, "i");
      const monday = new Date(this.selectedDate);
      monday.setDate(monday.getDate() - (dayOfWeek - 1));

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      title = "Weekly Timetable";
      subtitle = `${this.format(monday, "MMM dd")} - ${this.format(
        sunday,
        "MMM dd, yyyy"
      )}`;
    } else {
      title = "Daily Timetable";
      subtitle = this.format(this.selectedDate, "EEEE, MMMM dd, yyyy");
    }

    // Prepare content based on current view
    let content = "";

    if (this.viewMode === "month") {
      // Month view print
      content = `
        <table class="print-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>Type</th>
              <th>Name</th>
              <th>Time</th>
              <th>Subject/Event</th>
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
                    <tr style="background-color: ${this.getLightColorByType(
                    timetable.type
                  )}; color: ${this.getColorByType(timetable.type)}">
                      <td>${day.date
                      ? this.format(new Date(day.date), "dd MMM")
                      : "Weekly"
                    }</td>
                      <td>${day.day ||
                    (day.date
                      ? this.format(new Date(day.date), "EEE")
                      : "Weekly")
                    }</td>
                      <td><span class="type-indicator" style="background-color: ${this.getColorByType(
                      timetable.type
                    )}"></span>${timetable.type.charAt(0).toUpperCase() +
                    timetable.type.slice(1)
                    }</td>
                      <td>${timetable.name || "N/A"}</td>
                      <td>${this.dayjs(slot.startTime).format(
                      "hh:mm A"
                    )} - ${this.dayjs(slot.endTime).format("hh:mm A")}</td>
                      <td>${slot.subjectId?.name || slot.eventName || "N/A"
                    }</td>
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
        <table class="print-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Date</th>
              <th>Time</th>
              <th>Type</th>
              <th>Name</th>
              <th>Subject/Event</th>
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
                          <tr style="background-color: ${this.getLightColorByType(
                          tt.type
                        )}; color: ${this.getColorByType(tt.type)}">
                            <td>${this.format(day, "EEE")}</td>
                            <td>${this.format(day, "dd MMM")}</td>
                            <td>${this.dayjs(slot.startTime).format(
                          "hh:mm A"
                        )} - ${this.dayjs(slot.endTime).format(
                          "hh:mm A"
                        )}</td>
                            <td><span class="type-indicator" style="background-color: ${this.getColorByType(
                          tt.type
                        )}"></span>${tt.type.charAt(0).toUpperCase() + tt.type.slice(1)
                          }</td>
                            <td>${tt.name || "N/A"}</td>
                            <td>${slot.subjectId?.name || slot.eventName || "N/A"
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
                        <tr style="background-color: ${this.getLightColorByType(
                        tt.type
                      )}; color: ${this.getColorByType(tt.type)}">
                          <td>${this.format(day, "EEE")}</td>
                          <td>${this.format(day, "dd MMM")}</td>
                          <td>${this.dayjs(slot.startTime).format(
                        "hh:mm A"
                      )} - ${this.dayjs(slot.endTime).format(
                        "hh:mm A"
                      )}</td>
                          <td><span class="type-indicator" style="background-color: ${this.getColorByType(
                        tt.type
                      )}"></span>${tt.type.charAt(0).toUpperCase() + tt.type.slice(1)
                        }</td>
                          <td>${tt.name || "N/A"}</td>
                          <td>${slot.subjectId?.name || slot.eventName || "N/A"
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
      const dayString = this.format(this.selectedDate, "yyyy-MM-dd");
      content = `
        <table class="print-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Name</th>
              <th>Subject/Event</th>
              <th>Teacher</th>
            </tr>
          </thead>
          <tbody>
            ${this.filteredTimetables
          .flatMap((tt) => {
            const filteredDays =
              tt.days?.filter(
                (d) =>
                  (d.date &&
                    this.format(new Date(d.date), "yyyy-MM-dd") ===
                    dayString) ||
                  (tt.type === "weekly" &&
                    d.day === this.format(this.selectedDate, "EEEE") &&
                    this.isWithinValidity(tt, this.selectedDate))
              ) || [];

            return filteredDays.flatMap(
              (d) =>
                d.slots?.map(
                  (slot) => `
                      <tr style="background-color: ${this.getLightColorByType(
                    tt.type
                  )}; color: ${this.getColorByType(tt.type)}">
                        <td>${this.dayjs(slot.startTime).format(
                    "hh:mm A"
                  )} - ${this.dayjs(slot.endTime).format("hh:mm A")}</td>
                        <td><span class="type-indicator" style="background-color: ${this.getColorByType(
                    tt.type
                  )}"></span>${tt.type.charAt(0).toUpperCase() + tt.type.slice(1)
                    }</td>
                        <td>${tt.name || "N/A"}</td>
                        <td>${slot.subjectId?.name || slot.eventName || "N/A"
                    }</td>
                        <td>${slot.teacherId?.name || "N/A"}</td>
                      </tr>
                    `
                ) || []
            );
          })
          .sort((a, b) => {
            const aTime =
              a.match(
                /<td>(\d{2}:\d{2} [AP]M) - \d{2}:\d{2} [AP]M<\/td>/
              )?.[1] || "";
            const bTime =
              b.match(
                /<td>(\d{2}:\d{2} [AP]M) - \d{2}:\d{2} [AP]M<\/td>/
              )?.[1] || "";
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
          <title>${title} - ${subtitle}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
            
            body { 
              font-family: 'Inter', sans-serif; 
              margin: 0; 
              padding: 20px; 
              color: #111827;
            }
            
            .print-header {
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 1px solid #E5E7EB;
            }
            
            .print-header h1 { 
              font-size: 24px; 
              font-weight: 600; 
              margin: 0 0 5px 0;
              color: #1F2937;
            }
            
            .print-header p { 
              font-size: 14px; 
              color: #6B7280; 
              margin: 0;
            }
            
            .print-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
              margin-top: 15px;
            }
            
            .print-table th {
              background-color: #1F2937;
              color: white;
              font-weight: 500;
              padding: 8px 12px;
              text-align: left;
            }
            
            .print-table td {
              padding: 8px 12px;
              border-bottom: 1px solid #E5E7EB;
            }
            
            .print-table tr:hover {
              background-color: #F9FAFB;
            }
            
            .type-indicator {
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              margin-right: 6px;
              vertical-align: middle;
            }
            
            .print-footer {
              margin-top: 20px;
              padding-top: 10px;
              border-top: 1px solid #E5E7EB;
              font-size: 11px;
              color: #6B7280;
              text-align: center;
            }
            
            @media print {
              body { 
                padding: 15px;
              }
              
              .no-print { 
                display: none; 
              }
              
              .print-table {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>${title}</h1>
            <p>${subtitle}</p>
            <p>Generated on: ${this.format(
      new Date(),
      "MMM dd, yyyy hh:mm a"
    )}</p>
          </div>
          
          ${content}
          
          <div class="print-footer">
            Page 1 of 1 • Total entries: ${this.filteredTimetables.length}
          </div>
          
          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()" style="padding: 8px 16px; background-color: #4F46E5; color: white; border: none; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif;">Print</button>
            <button onclick="window.close()" style="padding: 8px 16px; margin-left: 10px; background-color: #EF4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif;">Close</button>
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

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ]
    : [0, 0, 0];
}

export default ExportFunctions;
