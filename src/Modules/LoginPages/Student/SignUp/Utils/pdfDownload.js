// helpers/pdfDownload.js
import { message } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import QRCode from "qrcode";

// Primary theme colors
const PRIMARY_COLOR = [200, 59, 98]; // #C83B62
const SECONDARY_COLOR = [127, 53, 205]; // #7F35CD
const WHITE = [255, 255, 255];

// Helper function to add loading indicator
const showLoadingIndicator = () => {
  const loadingElement = document.createElement("div");
  loadingElement.id = "pdf-loading-indicator";
  loadingElement.style.position = "fixed";
  loadingElement.style.top = "0";
  loadingElement.style.left = "0";
  loadingElement.style.width = "100%";
  loadingElement.style.height = "100%";
  loadingElement.style.backgroundColor = "rgba(0,0,0,0.5)";
  loadingElement.style.display = "flex";
  loadingElement.style.justifyContent = "center";
  loadingElement.style.alignItems = "center";
  loadingElement.style.zIndex = "9999";

  const spinner = document.createElement("div");
  spinner.style.border = "4px solid rgba(255,255,255,0.3)";
  spinner.style.borderRadius = "50%";
  spinner.style.borderTop = `4px solid rgb(${PRIMARY_COLOR.join(",")})`;
  spinner.style.width = "40px";
  spinner.style.height = "40px";
  spinner.style.animation = "spin 1s linear infinite";

  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  loadingElement.appendChild(style);
  loadingElement.appendChild(spinner);
  document.body.appendChild(loadingElement);
};

const hideLoadingIndicator = () => {
  const loadingElement = document.getElementById("pdf-loading-indicator");
  if (loadingElement) {
    document.body.removeChild(loadingElement);
  }
};

// Helper function to load images with retries
const loadImage = (url, retries = 3, delay = 100) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    const attemptLoad = (attempt) => {
      img.onload = () => resolve(img);
      img.onerror = () => {
        if (attempt <= retries) {
          setTimeout(() => attemptLoad(attempt + 1), delay);
        } else {
          reject(new Error(`Failed to load image after ${retries} attempts`));
        }
      };
      img.src = url;
    };

    attemptLoad(1);
  });
};

// Placeholder image for missing photos
const createPlaceholderImage = (text, width = 200, height = 200) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Fill background
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, width, height);

  // Draw border
  ctx.strokeStyle = "#cccccc";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, width, height);

  // Draw text
  ctx.fillStyle = "#999999";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);

  return canvas.toDataURL("image/png");
};

// Function to safely convert to uppercase
const safeUpperCase = (str) => {
  return str?.toString()?.toUpperCase() || "N/A";
};

// Function to safely format date
const safeDateFormat = (date) => {
  return date && moment(date).isValid()
    ? moment(date).format("DD MMM YYYY")
    : "N/A";
};

// Function to add footer only on last page
const addFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  doc.setPage(pageCount);

  const footerY = doc.internal.pageSize.height - 15;

  // Footer divider
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(15, footerY - 20, 195, footerY - 20);

  // Main footer text
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(
    "This document is computer-generated and does not require a signature.",
    105,
    footerY - 15,
    { align: "center" }
  );

  // Contact information
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80);
  doc.text(
    "For any queries, contact: info@studentdiwan.com | +974 74449111",
    105,
    footerY - 10,
    { align: "center" }
  );

  // Generated timestamp
  doc.setFontSize(7);
  doc.text(
    `Generated on: ${moment().format("DD MMM YYYY HH:mm")}`,
    105,
    footerY - 5,
    { align: "center" }
  );
};

// Helper function to add a new page with header
const addNewPage = (doc, title) => {
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
  return 30; // Return starting Y position
};

export const handleDownload = async (ApplicationData) => {
  try {
    showLoadingIndicator();

    // Safely access application data with fallbacks
    const data = ApplicationData || {};
    const candidate = data?.candidate || {};
    const guardian = data?.guardian || {};
    const fatherInfo = guardian?.fatherInfo || {};
    const motherInfo = guardian?.motherInfo || {};
    const guardianInfo = guardian?.guardianInformation || {};
    const address = data?.address || {};
    const residentialAddress = address?.residentialAddress || {};
    const permanentAddress = address?.permanentAddress || {};
    const academic = data?.academic || {};
    const languagePreference = data?.languagePreference || {};
    const documents = data?.documents || {};
    const files = documents?.files || [];

    // Create a promise for each image to load in parallel
    const imagePromises = [];

    // School logo promise
    const logoSrc =
      "https://i.ibb.co/9HLp987z/Chat-GPT-Image-May-9-2025-02-32-43-PM.png";
    imagePromises.push(loadImage(logoSrc).catch(() => null));

    // Student photo promise
    const studentPhoto = candidate?.profile
      ? loadImage(candidate.profile).catch(() => null)
      : Promise.resolve(createPlaceholderImage("Student Photo"));
    imagePromises.push(studentPhoto);

    // Father's photo promise
    const fatherPhoto = fatherInfo?.photo
      ? loadImage(fatherInfo.photo).catch(() => null)
      : Promise.resolve(createPlaceholderImage("Father's Photo"));
    imagePromises.push(fatherPhoto);

    // Mother's photo promise
    const motherPhoto = motherInfo?.photo
      ? loadImage(motherInfo.photo).catch(() => null)
      : Promise.resolve(createPlaceholderImage("Mother's Photo"));
    imagePromises.push(motherPhoto);

    // QR code promise
    const qrPromise = QRCode.toDataURL(`https://app.studentdiwan.com/`, {
      errorCorrectionLevel: "L",
      margin: 0,
    }).catch(() => null);
    imagePromises.push(qrPromise);

    // Wait for all images to load or fail
    const [logoImg, studentImg, fatherImg, motherImg, qrB64] =
      await Promise.all(imagePromises);

    // ─────────────────────────── SET-UP ───────────────────────────
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    doc.setProperties({
      title: `Student Registration – ${candidate?.firstName || "N/A"} ${
        candidate?.lastName || "N/A"
      }`,
      subject: "Student Registration Form",
      author: "School Management System",
      keywords: "student, registration, form",
      creator: "School Management System",
    });

    // Add watermark if draft status
    if (data?.status === "draft") {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(60);
      doc.setTextColor(200, 200, 200);
      doc.setGState(new doc.GState({ opacity: 0.2 }));
      doc.text("DRAFT", 105, 150, { angle: 45, align: "center" });
      doc.setGState(new doc.GState({ opacity: 1 }));
    }

    // ────────────────────── SCHOOL LOGO ──────────────────────
    if (logoImg) {
      try {
        // Add subtle shadow and border
        doc.setDrawColor(200);
        doc.setFillColor(...WHITE);
        doc.roundedRect(14, 9, 32, 17, 2, 2, "FD");
        doc.addImage(logoImg, "PNG", 15, 10, 30, 15);
      } catch {
        /* ignore if it fails */
      }
    }

    // ─────────────────────────── HEADER ───────────────────────────
    doc
      .setFont("helvetica", "bold")
      .setFontSize(18)
      .setTextColor(...PRIMARY_COLOR)
      .text("STUDENT REGISTRATION FORM", 105, 20, { align: "center" });
    doc
      .setDrawColor(...PRIMARY_COLOR)
      .setLineWidth(0.8)
      .line(50, 22, 160, 22);

    // ──────────────────── QR-CODE (Application ID) ───────────────────
    if (qrB64) {
      try {
        // Add border to QR code
        doc.setDrawColor(200);
        doc.roundedRect(169, 9, 27, 27, 2, 2, "S");
        doc.addImage(qrB64, "PNG", 170, 10, 25, 25);
      } catch {
        /* ignore if it fails */
      }
    }

    // helpers for tables
    const nextY = () => doc.lastAutoTable.finalY + 15;
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
        minCellHeight: 6,
      },
      margin: { left: 15, right: 15 },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: "bold" },
        1: { cellWidth: "auto" },
      },
      alternateRowStyles: {
        fillColor: [248, 248, 248],
      },
      didDrawPage: (data) => {
        // Only add page numbers on each page
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8).setTextColor(150);
        doc.text(
          `Page ${
            doc.internal.getCurrentPageInfo().pageNumber
          } of ${pageCount}`,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 10
        );
      },
    };

    // ───────────────── CANDIDATE INFORMATION (PAGE 1) ─────────────────
    doc
      .setFont("helvetica", "bold")
      .setFontSize(14)
      .setTextColor(...PRIMARY_COLOR)
      .text("CANDIDATE INFORMATION", 15, 60);

    // Add student photo above the table to the right
    if (studentImg) {
      try {
        const photoX = 160;
        const photoY = 60;
        doc.setDrawColor(200);
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(photoX - 1, photoY - 1, 32, 32, 2, 2, "FD");
        doc.addImage(studentImg, "JPEG", photoX, photoY, 30, 30);
        doc.setFontSize(6).setTextColor(150);
        doc.text(
          `Photo of ${candidate?.firstName || "student"}`,
          photoX + 15,
          photoY + 33,
          { align: "center" }
        );
      } catch {}
    }

    autoTable(doc, {
      startY: 95,
      head: [["Field", "Details"]],
      body: [
        [
          "Full Name",
          `${candidate?.firstName || "N/A"} ` +
            `${candidate?.middleName || ""} ` +
            `${candidate?.lastName || "N/A"}`.trim(),
        ],
        [
          "Date of Birth",
          candidate?.dob
            ? `${safeDateFormat(candidate.dob)} (Age: ${
                candidate?.age || "N/A"
              })`
            : "N/A",
        ],
        ["Gender", safeUpperCase(candidate?.gender)],
        ["Passport Number", candidate?.passportNumber || "N/A"],
        ["Passport Expiry", safeDateFormat(candidate?.passportExpiry)],
        ["ID Expiry", safeDateFormat(candidate?.idExpiry)],
        ["Place of Birth", candidate?.placeOfBirth || "N/A"],
        ["Nationality", safeUpperCase(candidate?.nationality)],
        ["Religion", safeUpperCase(candidate?.religion)],
        ["Blood Group", candidate?.bloodGroup || "N/A"],
        ["Native Language", safeUpperCase(candidate?.nativeLanguage)],
        ["Email", candidate?.email || "N/A"],
        ["Phone Number", candidate?.contactNumber || "N/A"],
        ["Emergency Number", candidate?.emergencyNumber || "N/A"],
      ],
      ...tableOpts,
    });

    // ──────────────── FATHER'S & MOTHER'S INFO (PAGE 2) ────────────────
    let startY = addNewPage(doc, "PARENT INFORMATION");

    // Father's Info
    doc
      .setFont("helvetica", "bold")
      .setFontSize(14)
      .setTextColor(...PRIMARY_COLOR)
      .text("FATHER'S INFORMATION", 15, startY);

    if (fatherImg) {
      try {
        const photoX = 160;
        const photoY = startY;
        doc.setDrawColor(200);
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(photoX - 1, photoY - 1, 32, 32, 2, 2, "FD");
        doc.addImage(fatherImg, "JPEG", photoX, photoY, 30, 30);
        doc.setFontSize(6).setTextColor(150);
        doc.text(`Photo of father`, photoX + 15, photoY + 33, {
          align: "center",
        });
      } catch {}
    }

    autoTable(doc, {
      startY: startY + 40,
      head: [["FATHER'S INFORMATION", ""]],
      body: [
        [
          "Full Name",
          `${fatherInfo?.firstName || "N/A"} ` +
            `${fatherInfo?.middleName || ""} ` +
            `${fatherInfo?.lastName || ""}`.trim(),
        ],
        ["ID Number", fatherInfo?.idNumber || "N/A"],
        ["ID Expiry", safeDateFormat(fatherInfo?.idExpiry)],
        ["Nationality", safeUpperCase(fatherInfo?.nationality)],
        ["Religion", safeUpperCase(fatherInfo?.religion)],
        ["Company", fatherInfo?.company || "N/A"],
        ["Job Title", fatherInfo?.jobTitle || "N/A"],
        ["Primary Phone", fatherInfo?.cell1 || "N/A"],
        ["Secondary Phone", fatherInfo?.cell2 || "N/A"],
        ["Primary Email", fatherInfo?.email1 || "N/A"],
        ["Secondary Email", fatherInfo?.email2 || "N/A"],
      ],
      margin: { left: 15, right: 40 },
      ...tableOpts,
    });

    // Mother's Info
    startY = doc.lastAutoTable.finalY + 15;
    doc
      .setFont("helvetica", "bold")
      .setFontSize(14)
      .setTextColor(...PRIMARY_COLOR)
      .text("MOTHER'S INFORMATION", 15, startY);

    if (motherImg) {
      try {
        const photoX = 160;
        const photoY = startY;
        doc.setDrawColor(200);
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(photoX - 1, photoY - 1, 32, 32, 2, 2, "FD");
        doc.addImage(motherImg, "JPEG", photoX, photoY, 30, 30);
        doc.setFontSize(6).setTextColor(150);
        doc.text(`Photo of mother`, photoX + 15, photoY + 33, {
          align: "center",
        });
      } catch {}
    }

    autoTable(doc, {
      startY: startY + 40,
      head: [["MOTHER'S INFORMATION", ""]],
      body: [
        [
          "Full Name",
          `${motherInfo?.firstName || "N/A"} ` +
            `${motherInfo?.middleName || ""} ` +
            `${motherInfo?.lastName || ""}`.trim(),
        ],
        ["ID Number", motherInfo?.idNumber || "N/A"],
        ["ID Expiry", safeDateFormat(motherInfo?.idExpiry)],
        ["Nationality", safeUpperCase(motherInfo?.nationality)],
        ["Religion", safeUpperCase(motherInfo?.religion)],
        ["Company", motherInfo?.company || "N/A"],
        ["Job Title", motherInfo?.jobTitle || "N/A"],
        ["Primary Phone", motherInfo?.cell1 || "N/A"],
        ["Secondary Phone", motherInfo?.cell2 || "N/A"],
        ["Primary Email", motherInfo?.email1 || "N/A"],
        ["Secondary Email", motherInfo?.email2 || "N/A"],
      ],
      margin: { left: 15, right: 40 },
      ...tableOpts,
    });

    // Guardian Info
    startY = doc.lastAutoTable.finalY + 15;
    autoTable(doc, {
      startY: startY,
      head: [["PRIMARY GUARDIAN INFORMATION", ""]],
      body: [
        ["Name", guardianInfo?.guardianName || "N/A"],
        ["Relation", guardianInfo?.guardianRelationToStudent || "N/A"],
        ["Contact Number", guardianInfo?.guardianContactNumber || "N/A"],
        ["Email", guardianInfo?.guardianEmail || "N/A"],
      ],
      ...tableOpts,
    });

    // ───────────────── ADDRESS & ACADEMIC INFO (PAGE 3) ─────────────────
    startY = addNewPage(doc, "ADDRESS & ACADEMIC INFORMATION");

    // Address Information
    doc
      .setFont("helvetica", "bold")
      .setFontSize(14)
      .setTextColor(...PRIMARY_COLOR)
      .text("ADDRESS INFORMATION", 15, startY);

    autoTable(doc, {
      startY: startY + 10,
      head: [["Address Type", "Details"]],
      body: [
        ["Unit/Building", residentialAddress?.buildingNumber || "N/A"],
        ["Street", residentialAddress?.streetName || "N/A"],
        ["City", residentialAddress?.city || "N/A"],
        ["Postal Code", residentialAddress?.postalCode || "N/A"],
        ["Country", safeUpperCase(residentialAddress?.country)],
        ["Transport Required", address?.transportRequirement ? "YES" : "NO"],
        ["", ""], // spacer
        ["PERMANENT ADDRESS", ""],
        ["Building", permanentAddress?.buildingNumber || "N/A"],
        ["Street", permanentAddress?.streetName || "N/A"],
        ["City", permanentAddress?.city || "N/A"],
        ["Postal Code", permanentAddress?.postalCode || "N/A"],
        ["Country", safeUpperCase(permanentAddress?.country)],
      ],
      ...tableOpts,
      didDrawCell: (data) => {
        if (data.cell.raw === "PERMANENT ADDRESS") {
          try {
            doc.setFillColor(240, 240, 240);
            doc.rect(
              data.cell.x,
              data.cell.y,
              data.cell.width +
                data.cell.styles.cellPadding.left +
                data.cell.styles.cellPadding.right,
              data.cell.height,
              "F"
            );

            doc
              .setTextColor(...PRIMARY_COLOR)
              .setFont("helvetica", "bold")
              .text(
                "PERMANENT ADDRESS",
                data.cell.x + data.cell.padding.left,
                data.cell.y + data.cell.padding.top + 4,
                {
                  maxWidth:
                    data.cell.width -
                    data.cell.padding.left -
                    data.cell.padding.right,
                }
              );
          } catch (error) {
            console.error("Error drawing permanent address header:", error);
            data.cell.styles.fillColor = [240, 240, 240];
            data.cell.styles.textColor = PRIMARY_COLOR;
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
    });

    // Academic Information
    startY = doc.lastAutoTable.finalY + 15;
    doc
      .setFont("helvetica", "bold")
      .setFontSize(14)
      .setTextColor(...PRIMARY_COLOR)
      .text("ACADEMIC INFORMATION", 15, startY);

    autoTable(doc, {
      startY: startY + 10,
      head: [["Academic Field", "Details"]],
      body: [
        ["Previous Class", safeUpperCase(academic?.previousClass)],
        ["Curriculum", safeUpperCase(academic?.curriculum)],
        ["Previous School", academic?.previousSchoolName || "N/A"],
        ["Source of Fee", safeUpperCase(academic?.sourceOfFee)],
      ],
      ...tableOpts,
    });

    // ───────────────── LANGUAGE & DOCUMENTS (PAGE 4) ─────────────────
    startY = addNewPage(doc, "LANGUAGE & DOCUMENTS");

    // Language Preferences
    doc
      .setFont("helvetica", "bold")
      .setFontSize(14)
      .setTextColor(...PRIMARY_COLOR)
      .text("LANGUAGE & PREFERENCES", 15, startY);

    autoTable(doc, {
      startY: startY + 10,
      head: [["Preference Type", "Selection"]],
      body: [
        [
          "Second Language",
          (languagePreference?.secondLanguage || [])
            .map((lang) => safeUpperCase(lang))
            .join(", ") || "N/A",
        ],
        [
          "Third Language",
          (languagePreference?.thirdLanguage || [])
            .map((lang) => safeUpperCase(lang))
            .join(", ") || "N/A",
        ],
        [
          "Value Education",
          (languagePreference?.valueEducation || [])
            .map((edu) => safeUpperCase(edu))
            .join(", ") || "N/A",
        ],
        ["Left Handed", languagePreference?.isLeftHanded ? "YES" : "NO"],
        [
          "Medical Condition",
          safeUpperCase(languagePreference?.medicalCondition) || "NONE",
        ],
      ],
      ...tableOpts,
    });

    // Documents
    startY = doc.lastAutoTable.finalY + 15;
    doc
      .setFont("helvetica", "bold")
      .setFontSize(14)
      .setTextColor(...PRIMARY_COLOR)
      .text("DOCUMENTS SUBMITTED", 15, startY);

    const docRows = files.map((f) => [
      f?.fieldname || "N/A",
      f?.documentName?.length > 30
        ? f.documentName.slice(0, 27) + "…"
        : f?.documentName || "N/A",
      {
        content: "View →",
        url: f?.url || "#",
        action: true,
      },
    ]);

    autoTable(doc, {
      startY: startY + 10,
      head: [["Document Type", "File Name", "Action"]],
      body: docRows.length ? docRows : [["No documents uploaded", "", ""]],
      styles: { ...tableOpts.styles, fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: "bold" },
        1: { cellWidth: 80 },
        2: { cellWidth: 30, halign: "center" },
      },
      ...tableOpts,
      didParseCell: (data) => {
        if (data.cell.raw?.action) {
          data.cell.styles.textColor = [0, 0, 255]; // Blue color
          data.cell.styles.fontStyle = "underline";
          delete data.cell.styles.fillColor;
        }
      },
      didDrawCell: (data) => {
        if (data.cell.raw?.action) {
          doc.link(
            data.cell.x,
            data.cell.y,
            data.cell.width,
            data.cell.height,
            {
              url: data.cell.raw.url,
              target: "_blank",
            }
          );
        }
      },
    });

    // Add footer only on last page
    addFooter(doc);

    // ─────────────────────── DOWNLOAD ───────────────────────
    const fileName = `StudentRegistration_${
      candidate?.firstName || "Unknown"
    }_${candidate?.lastName || "Student"}_${moment().format(
      "YYYYMMDD_HHmmss"
    )}.pdf`;

    // Hide loading indicator before saving
    setTimeout(() => {
      hideLoadingIndicator();
      doc.save(fileName);
    }, 100);
  } catch (error) {
    console.error("Error generating PDF:", error);
    hideLoadingIndicator();
    message.error("Failed to generate PDF. Please try again.");
  }
};
