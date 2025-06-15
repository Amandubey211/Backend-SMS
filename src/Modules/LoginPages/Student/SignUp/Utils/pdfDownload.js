// helpers/pdfDownload.js
import { message } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import QRCode from "qrcode";

/* ─────────────────────────── CONSTANTS ─────────────────────────── */
const PRIMARY_COLOR = [200, 59, 98]; // #C83B62
const WHITE = [255, 255, 255];

const IMAGE_X = 15; // photo X-coordinate (left side)
const IMAGE_W = 30; // photo width & height
const DEFAULT_LEFT = 15; // normal page left margin

/* ─────────────────────────── HELPERS ─────────────────────────── */
const showLoadingIndicator = () => {
  const el = document.createElement("div");
  el.id = "pdf-loading-indicator";
  Object.assign(el.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  });
  const spinner = document.createElement("div");
  Object.assign(spinner.style, {
    border: "4px solid rgba(255,255,255,0.3)",
    borderRadius: "50%",
    borderTop: `4px solid rgb(${PRIMARY_COLOR.join(",")})`,
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
  });
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin { 0% {transform:rotate(0deg);} 100% {transform:rotate(360deg);} }
  `;
  el.appendChild(style);
  el.appendChild(spinner);
  document.body.appendChild(el);
};
const hideLoadingIndicator = () =>
  document.getElementById("pdf-loading-indicator")?.remove();

const loadImage = (url, retries = 3, delay = 100) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    const attemptLoad = (count = 1) => {
      img.onload = () => resolve(img);
      img.onerror = () =>
        count <= retries
          ? setTimeout(() => attemptLoad(count + 1), delay)
          : reject(new Error("Image load failed"));
      img.src = url;
    };
    attemptLoad();
  });

const createPlaceholderImage = (text, w = 200, h = 200) => {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, w, h);
  ctx.fillStyle = "#999";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);
  return canvas.toDataURL("image/png");
};

const safeUpper = (str) => str?.toString()?.toUpperCase() || "N/A";
const safeDate = (d) =>
  d && moment(d).isValid() ? moment(d).format("DD MMM YYYY") : "N/A";

/* ─────────────────────────── FOOTER & HEADER ─────────────────────────── */
const addFooter = (doc) => {
  const pages = doc.internal.getNumberOfPages();
  doc.setPage(pages);
  const y = doc.internal.pageSize.height - 15;
  doc
    .setDrawColor(200)
    .setLineWidth(0.3)
    .line(15, y - 20, 195, y - 20);
  doc
    .setFont("helvetica", "italic")
    .setFontSize(8)
    .setTextColor(100)
    .text(
      "This document is computer-generated and does not require a signature.",
      105,
      y - 15,
      { align: "center" }
    )
    .setFont("helvetica", "normal")
    .setTextColor(80)
    .text(
      "For any queries, contact: info@studentdiwan.com | +974 74449111",
      105,
      y - 10,
      { align: "center" }
    )
    .setFontSize(7)
    .text(`Generated on: ${moment().format("DD MMM YYYY HH:mm")}`, 105, y - 5, {
      align: "center",
    });
};
const addPageAndHeader = (doc, title) => {
  doc.addPage();
  doc
    .setFont("helvetica", "bold")
    .setFontSize(18)
    .setTextColor(...PRIMARY_COLOR)
    .text(title, 105, 20, { align: "center" });
  doc
    .setDrawColor(...PRIMARY_COLOR)
    .setLineWidth(0.8)
    .line(50, 22, 160, 22);
  return 30; // return starting Y
};

/* ─────────────────────────── MAIN ─────────────────────────── */
export const handleDownload = async (ApplicationData) => {
  try {
    showLoadingIndicator();

    /* ---------- safely destructure data ---------- */
    const data = ApplicationData || {};
    const {
      candidate = {},
      guardian = {},
      address = {},
      academic = {},
      languagePreference = {},
      documents = {},
    } = data;
    const fatherInfo = guardian.fatherInfo || {};
    const motherInfo = guardian.motherInfo || {};
    const guardianInfo = guardian.guardianInformation || {};
    const { residentialAddress = {}, permanentAddress = {} } = address;
    const files = documents.files || [];

    /* ---------- preload images ---------- */
    const [logoImg, studentImg, fatherImg, motherImg, qrB64] =
      await Promise.all([
        loadImage(
          "https://i.ibb.co/9HLp987z/Chat-GPT-Image-May-9-2025-02-32-43-PM.png"
        ).catch(() => null),
        candidate.profile
          ? loadImage(candidate.profile).catch(() => null)
          : Promise.resolve(createPlaceholderImage("Student Photo")),
        fatherInfo.photo
          ? loadImage(fatherInfo.photo).catch(() => null)
          : Promise.resolve(createPlaceholderImage("Father Photo")),
        motherInfo.photo
          ? loadImage(motherInfo.photo).catch(() => null)
          : Promise.resolve(createPlaceholderImage("Mother Photo")),
        QRCode.toDataURL("https://app.studentdiwan.com/", {
          errorCorrectionLevel: "L",
          margin: 0,
        }).catch(() => null),
      ]);

    /* ---------- init jsPDF ---------- */
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    doc.setProperties({
      title: `Student Registration – ${candidate.firstName || "N/A"} ${
        candidate.lastName || "N/A"
      }`,
      author: "School Management System",
    });

    /* ---------- header banner ---------- */
    /* ---------- HEADER BANNER (updated) ---------- */
    if (logoImg) {
      doc.setDrawColor(200).setFillColor(...WHITE);
      doc.roundedRect(14, 9, 32, 17, 2, 2, "FD");
      doc.addImage(logoImg, "PNG", 15, 10, 30, 15);
    }

    // Main title
    doc
      .setFont("helvetica", "bold")
      .setFontSize(18)
      .setTextColor(...PRIMARY_COLOR)
      .text("STUDENT REGISTRATION FORM", 105, 20, { align: "center" });

    // **NEW** generated timestamp line (smaller font)
    const generatedText = `Generated on: ${moment().format(
      "DD MMM YYYY HH:mm"
    )}`;
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .setTextColor(80)
      .text(generatedText, 105, 24, { align: "center" });

    // Horizontal divider (moved down to y = 26)
    doc
      .setDrawColor(...PRIMARY_COLOR)
      .setLineWidth(0.8)
      .line(50, 26, 160, 26);

    // QR code (unchanged)
    if (qrB64) {
      doc.setDrawColor(200).roundedRect(169, 9, 27, 27, 2, 2, "S");
      doc.addImage(qrB64, "PNG", 170, 10, 25, 25);
    }

    /* ---------- reusable table options ---------- */
    const tableOpts = {
      theme: "grid",
      headStyles: {
        fillColor: PRIMARY_COLOR,
        textColor: WHITE,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: "linebreak",
      },
      margin: { left: DEFAULT_LEFT, right: DEFAULT_LEFT },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      didDrawPage: () => {
        const page = doc.internal.getCurrentPageInfo().pageNumber;
        const pages = doc.internal.getNumberOfPages();
        doc
          .setFontSize(8)
          .setTextColor(150)
          .text(
            `Page ${page} of ${pages}`,
            doc.internal.pageSize.width - 20,
            doc.internal.pageSize.height - 10
          );
      },
    };

    /* ─────────────── 1. CANDIDATE ─────────────── */
    const topPad = 30;
    let imgBottom = topPad;
    if (studentImg) {
      doc.setDrawColor(200).setFillColor(240);
      doc.roundedRect(
        IMAGE_X - 1,
        topPad - 1,
        IMAGE_W + 2,
        IMAGE_W + 2,
        2,
        2,
        "FD"
      );
      doc.addImage(studentImg, "JPEG", IMAGE_X, topPad, IMAGE_W, IMAGE_W);
      doc
        .setFontSize(6)
        .setTextColor(150)
        .text(
          `Photo of ${candidate.firstName || "student"}`,
          IMAGE_X + IMAGE_W / 2,
          topPad + IMAGE_W + 3,
          { align: "center" }
        );
      imgBottom = topPad + IMAGE_W + 3;
    }

    autoTable(doc, {
      startY: imgBottom + 5,
      head: [["CANDIDATE INFORMATION", "Details"]],
      body: [
        [
          "Full Name",
          `${candidate.firstName || "N/A"} ${candidate.middleName || ""} ${
            candidate.lastName || "N/A"
          }`.trim(),
        ],
        [
          "Date of Birth",
          candidate.dob
            ? `${safeDate(candidate.dob)} (Age: ${candidate.age || "N/A"})`
            : "N/A",
        ],
        ["Gender", safeUpper(candidate.gender)],
        ["Passport Number", candidate.passportNumber || "N/A"],
        ["Passport Expiry", safeDate(candidate.passportExpiry)],
        ["ID Expiry", safeDate(candidate.idExpiry)],
        ["Place of Birth", candidate.placeOfBirth || "N/A"],
        ["Nationality", safeUpper(candidate.nationality)],
        ["Religion", safeUpper(candidate.religion)],
        ["Blood Group", candidate.bloodGroup || "N/A"],
        ["Native Language", safeUpper(candidate.nativeLanguage)],
        ["Email", candidate.email || "N/A"],
        ["Phone Number", candidate.contactNumber || "N/A"],
        ["Emergency Number", candidate.emergencyNumber || "N/A"],
      ],
      ...tableOpts,
    });

    /* ─────────────── 2. FATHER ─────────────── */
    let startY = addPageAndHeader(doc, "FATHER INFORMATION");

    if (fatherImg) {
      doc.setDrawColor(200).setFillColor(240);
      doc.roundedRect(
        IMAGE_X - 1,
        startY - 1,
        IMAGE_W + 2,
        IMAGE_W + 2,
        2,
        2,
        "FD"
      );
      doc.addImage(fatherImg, "JPEG", IMAGE_X, startY, IMAGE_W, IMAGE_W);
      doc
        .setFontSize(6)
        .setTextColor(150)
        .text("Photo of father", IMAGE_X + IMAGE_W / 2, startY + IMAGE_W + 3, {
          align: "center",
        });
    }

    autoTable(doc, {
      startY: startY + IMAGE_W + 10,
      head: [["FATHER'S INFORMATION", ""]],
      body: [
        [
          "Full Name",
          `${fatherInfo.firstName || "N/A"} ${fatherInfo.middleName || ""} ${
            fatherInfo.lastName || ""
          }`.trim(),
        ],
        ["ID Number", fatherInfo.idNumber || "N/A"],
        ["ID Expiry", safeDate(fatherInfo.idExpiry)],
        ["Nationality", safeUpper(fatherInfo.nationality)],
        ["Religion", safeUpper(fatherInfo.religion)],
        ["Company", fatherInfo.company || "N/A"],
        ["Job Title", fatherInfo.jobTitle || "N/A"],
        ["Primary Phone", fatherInfo.cell1 || "N/A"],
        ["Secondary Phone", fatherInfo.cell2 || "N/A"],
        ["Primary Email", fatherInfo.email1 || "N/A"],
        ["Secondary Email", fatherInfo.email2 || "N/A"],
      ],
      ...tableOpts,
    });

    /* ─────────────── 3. MOTHER ─────────────── */
    startY = addPageAndHeader(doc, "MOTHER & GUARDIAN INFORMATION");

    if (motherImg) {
      doc.setDrawColor(200).setFillColor(240);
      doc.roundedRect(
        IMAGE_X - 1,
        startY - 1,
        IMAGE_W + 2,
        IMAGE_W + 2,
        2,
        2,
        "FD"
      );
      doc.addImage(motherImg, "JPEG", IMAGE_X, startY, IMAGE_W, IMAGE_W);
      doc
        .setFontSize(6)
        .setTextColor(150)
        .text("Photo of mother", IMAGE_X + IMAGE_W / 2, startY + IMAGE_W + 3, {
          align: "center",
        });
    }

    autoTable(doc, {
      startY: startY + IMAGE_W + 10,
      head: [["MOTHER'S INFORMATION", ""]],
      body: [
        [
          "Full Name",
          `${motherInfo.firstName || "N/A"} ${motherInfo.middleName || ""} ${
            motherInfo.lastName || ""
          }`.trim(),
        ],
        ["ID Number", motherInfo.idNumber || "N/A"],
        ["ID Expiry", safeDate(motherInfo.idExpiry)],
        ["Nationality", safeUpper(motherInfo.nationality)],
        ["Religion", safeUpper(motherInfo.religion)],
        ["Company", motherInfo.company || "N/A"],
        ["Job Title", motherInfo.jobTitle || "N/A"],
        ["Primary Phone", motherInfo.cell1 || "N/A"],
        ["Secondary Phone", motherInfo.cell2 || "N/A"],
        ["Primary Email", motherInfo.email1 || "N/A"],
        ["Secondary Email", motherInfo.email2 || "N/A"],
      ],
      ...tableOpts,
    });

    /* ─────────────── 4. GUARDIAN (same page) ─────────────── */
    startY = doc.lastAutoTable.finalY + 15;
    autoTable(doc, {
      startY,
      head: [["PRIMARY GUARDIAN INFORMATION", ""]],
      body: [
        ["Name", guardianInfo.guardianName || "N/A"],
        ["Relation", guardianInfo.guardianRelationToStudent || "N/A"],
        ["Contact Number", guardianInfo.guardianContactNumber || "N/A"],
        ["Email", guardianInfo.guardianEmail || "N/A"],
      ],
      ...tableOpts,
    });

    /* ─────────────── 5. ADDRESS & ACADEMIC ─────────────── */
    startY = addPageAndHeader(doc, "ADDRESS & ACADEMIC INFORMATION");
    doc
      .setFont("helvetica", "bold")
      .setFontSize(14)
      .setTextColor(...PRIMARY_COLOR)
      .text("ADDRESS INFORMATION", DEFAULT_LEFT, startY);

    autoTable(doc, {
      startY: startY + 5,
      head: [["Address Type", "Details"]],
      body: [
        ["Unit/Building", residentialAddress.buildingNumber || "N/A"],
        ["Street", residentialAddress.streetName || "N/A"],
        ["City", residentialAddress.city || "N/A"],
        ["Postal Code", residentialAddress.postalCode || "N/A"],
        ["Country", safeUpper(residentialAddress.country)],
        ["Transport Required", address.transportRequirement ? "YES" : "NO"],
        ["", ""],
        ["PERMANENT ADDRESS", ""],
        ["Unit/Building", permanentAddress.buildingNumber || "N/A"],
        ["Street", permanentAddress.streetName || "N/A"],
        ["City", permanentAddress.city || "N/A"],
        ["Postal Code", permanentAddress.postalCode || "N/A"],
        ["Country", safeUpper(permanentAddress.country)],
      ],
      ...tableOpts,
      didDrawCell: (d) => {
        if (d.cell.raw === "PERMANENT ADDRESS") {
          doc.setFillColor(240);
          doc.rect(d.cell.x, d.cell.y, d.cell.width, d.cell.height, "F");
          doc
            .setTextColor(...PRIMARY_COLOR)
            .setFont("helvetica", "bold")
            .text(
              "PERMANENT ADDRESS",
              d.cell.x + 2,
              d.cell.y + d.cell.height / 2 + 2
            );
        }
      },
    });

    startY = doc.lastAutoTable.finalY + 15;
    doc
      .setFont("helvetica", "bold")
      .setFontSize(14)
      .setTextColor(...PRIMARY_COLOR)
      .text("ACADEMIC INFORMATION", DEFAULT_LEFT, startY);

    autoTable(doc, {
      startY: startY + 10,
      head: [["Academic Field", "Details"]],
      body: [
        ["Previous Class", safeUpper(academic.previousClass)],
        ["Curriculum", safeUpper(academic.curriculum)],
        ["Previous School", academic.previousSchoolName || "N/A"],
        ["Source of Fee", safeUpper(academic.sourceOfFee)],
      ],
      ...tableOpts,
    });

    /* ─────────────── 6. LANGUAGE & DOCUMENTS ─────────────── */
    startY = addPageAndHeader(doc, "LANGUAGE & DOCUMENTS");
    doc
      .setFont("helvetica", "bold")
      .setFontSize(14)
      .setTextColor(...PRIMARY_COLOR)
      .text("LANGUAGE & PREFERENCES", DEFAULT_LEFT, startY);

    autoTable(doc, {
      startY: startY + 10,
      head: [["Preference Type", "Selection"]],
      body: [
        [
          "Second Language",
          (languagePreference.secondLanguage || []).map(safeUpper).join(", ") ||
            "N/A",
        ],
        [
          "Third Language",
          (languagePreference.thirdLanguage || []).map(safeUpper).join(", ") ||
            "N/A",
        ],
        [
          "Value Education",
          (languagePreference.valueEducation || []).map(safeUpper).join(", ") ||
            "N/A",
        ],
        ["Left Handed", languagePreference.isLeftHanded ? "YES" : "NO"],
        [
          "Medical Condition",
          safeUpper(languagePreference.medicalCondition) || "NONE",
        ],
      ],
      ...tableOpts,
    });

    startY = doc.lastAutoTable.finalY + 15;
    doc
      .setFont("helvetica", "bold")
      .setFontSize(14)
      .setTextColor(...PRIMARY_COLOR)
      .text("DOCUMENTS SUBMITTED", DEFAULT_LEFT, startY);

    const docRows = files.map((f) => [
      f.fieldname || "N/A",
      f.documentName?.length > 30
        ? `${f.documentName.slice(0, 27)}…`
        : f.documentName || "N/A",
      { content: "View", url: f.url || "#", action: true },
    ]);

    autoTable(doc, {
      startY: startY + 10,
      head: [["Document Type", "File Name", "Action"]],
      body: docRows.length ? docRows : [["No documents uploaded", "", ""]],
      styles: { ...tableOpts.styles, fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 80 },
        2: { cellWidth: 30, halign: "center" },
      },
      ...tableOpts,
      didParseCell: (d) => {
        if (d.cell.raw?.action) {
          d.cell.styles.textColor = [0, 0, 255];
          d.cell.styles.fontStyle = "underline";
          delete d.cell.styles.fillColor;
        }
      },
      didDrawCell: (d) => {
        if (d.cell.raw?.action) {
          doc.link(d.cell.x, d.cell.y, d.cell.width, d.cell.height, {
            url: d.cell.raw.url,
            newWindow: true, // forces browser to open link in a new tab/window
          });
        }
      },
    });

    /* ---------- footer & save ---------- */
    addFooter(doc);
    const fileName = `StudentRegistration_${candidate.firstName || "Unknown"}_${
      candidate.lastName || "Student"
    }_${moment().format("YYYYMMDD_HHmmss")}.pdf`;
    hideLoadingIndicator();
    doc.save(fileName);
  } catch (err) {
    console.error("PDF generation error:", err);
    hideLoadingIndicator();
    message.error("Failed to generate PDF. Please try again.");
  }
};
