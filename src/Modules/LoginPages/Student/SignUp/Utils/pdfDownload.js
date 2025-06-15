// helpers/pdfDownload.js
import { message } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import QRCode from "qrcode";

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
  spinner.style.borderTop = "4px solid #2196F3";
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

export const handleDownload = async (ApplicationData) => {
  try {
    showLoadingIndicator();

    // Create a promise for each image to load in parallel
    const imagePromises = [];

    // School logo promise
    const logoSrc =
      ApplicationData?.school?.logoUrl ||
      "https://i.ibb.co/9HLp987z/Chat-GPT-Image-May-9-2025-02-32-43-PM.png";
    imagePromises.push(loadImage(logoSrc).catch(() => null));

    // Student photo promise
    if (ApplicationData?.candidate?.profile) {
      imagePromises.push(
        loadImage(ApplicationData.candidate.profile).catch(() => null)
      );
    }

    // Father's photo promise
    if (ApplicationData?.guardian?.fatherInfo?.photo) {
      imagePromises.push(
        loadImage(ApplicationData.guardian.fatherInfo.photo).catch(() => null)
      );
    }

    // Mother's photo promise
    if (ApplicationData?.guardian?.motherInfo?.photo) {
      imagePromises.push(
        loadImage(ApplicationData.guardian.motherInfo.photo).catch(() => null)
      );
    }

    // QR code promise
    const id =
      ApplicationData?.applicationId ||
      ApplicationData?.candidate?.studentId ||
      "UNKNOWN";
    const qrPromise = QRCode.toDataURL(id, {
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
      title: `Student Registration – ${
        ApplicationData?.candidate?.firstName ?? "N/A"
      } ${ApplicationData?.candidate?.lastName ?? "N/A"}`,
      subject: "Student Registration Form",
      author: "School Management System",
      keywords: "student, registration, form",
      creator: "School Management System",
    });

    // Add watermark if draft status
    if (ApplicationData?.status === "draft") {
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
        doc.setFillColor(255, 255, 255);
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
      .setTextColor(33, 150, 243)
      .text("STUDENT REGISTRATION FORM", 105, 20, { align: "center" });
    doc.setDrawColor(33, 150, 243).setLineWidth(0.8).line(50, 22, 160, 22);

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

    // ────────────── APPLICATION DETAILS BOX ──────────────
    // doc
    //   .setFillColor(245, 245, 245)
    //   .roundedRect(15, 30, 180, 15, 3, 3, "F")
    //   .setFont("helvetica", "bold")
    //   .setFontSize(10)
    //   .setTextColor(66, 66, 66)
    //   .text("APPLICATION DETAILS", 22, 36)
    //   .setFont("helvetica", "normal")
    //   .setTextColor(80)
    //   .text(`School ID: ${ApplicationData?.school?.schoolId ?? "N/A"}`, 120, 36)
    //   .text(
    //     `Class ID:  ${ApplicationData?.school?.applyingClass ?? "N/A"}`,
    //     120,
    //     42
    //   )
    //   .text(`Submission: ${moment().format("DD MMM YYYY")}`, 120, 48);
    // doc.setDrawColor(200).setLineWidth(0.3).line(15, 52, 195, 52);

    // ──────────────────────────────────────────────────────────
    // helpers for tables
    const nextY = () => doc.lastAutoTable.finalY + 15;
    const tableOpts = {
      theme: "grid",
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: [255, 255, 255],
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
        // Footer on each page
        const footY = doc.internal.pageSize.height - 10;
        doc
          .setFont("helvetica", "italic")
          .setFontSize(8)
          .setTextColor(100)
          .text(
            "This document is computer-generated and does not require a signature.",
            105,
            footY - 5,
            { align: "center" }
          )
          .text(
            `Generated on: ${moment().format("DD MMM YYYY HH:mm")}`,
            105,
            footY,
            {
              align: "center",
            }
          );
      },
    };

    // ───────────────── CANDIDATE INFORMATION ─────────────────
    doc
      .setFont("helvetica", "bold")
      .setFontSize(14)
      .setTextColor(33, 150, 243)
      .text("CANDIDATE INFORMATION", 15, 60);

    // student photo
    if (studentImg) {
      try {
        // Add border and shadow to photo
        doc.setDrawColor(200);
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(159, 54, 32, 32, 2, 2, "FD");
        doc.addImage(studentImg, "JPEG", 160, 55, 30, 30);
        // Add alt text description
        doc.setFontSize(6).setTextColor(150);
        doc.text(
          `Photo of ${ApplicationData?.candidate?.firstName || "student"}`,
          175,
          88,
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
          `${ApplicationData?.candidate?.firstName ?? "N/A"} ` +
            `${ApplicationData?.candidate?.middleName || ""} ` +
            `${ApplicationData?.candidate?.lastName ?? "N/A"}`.trim(),
        ],
        [
          "Date of Birth",
          moment(ApplicationData?.candidate?.dob).isValid()
            ? `${moment(ApplicationData.candidate.dob).format(
                "DD MMM YYYY"
              )} (Age: ${ApplicationData?.candidate?.age || "N/A"})`
            : "N/A",
        ],
        ["Gender", (ApplicationData?.candidate?.gender || "N/A").toUpperCase()],
        [
          "Passport Number",
          ApplicationData?.candidate?.passportNumber || "N/A",
        ],
        [
          "Passport Expiry",
          moment(ApplicationData?.candidate?.passportExpiry).isValid()
            ? moment(ApplicationData.candidate.passportExpiry).format(
                "DD MMM YYYY"
              )
            : "N/A",
        ],
        [
          "ID Expiry",
          moment(ApplicationData?.candidate?.idExpiry).isValid()
            ? moment(ApplicationData.candidate.idExpiry).format("DD MMM YYYY")
            : "N/A",
        ],
        ["Place of Birth", ApplicationData?.candidate?.placeOfBirth || "N/A"],
        [
          "Nationality",
          (ApplicationData?.candidate?.nationality || "N/A").toUpperCase(),
        ],
        [
          "Religion",
          (ApplicationData?.candidate?.religion || "N/A").toUpperCase(),
        ],
        ["Blood Group", ApplicationData?.candidate?.bloodGroup || "N/A"],
        [
          "Native Language",
          (ApplicationData?.candidate?.nativeLanguage || "N/A").toUpperCase(),
        ],
        ["Email", ApplicationData?.candidate?.email || "N/A"],
        ["Phone Number", ApplicationData?.candidate?.phoneNumber || "N/A"],
        [
          "Emergency Number",
          ApplicationData?.candidate?.emergencyNumber || "N/A",
        ],
        [
          "Primary Contact",
          (ApplicationData?.candidate?.primaryContact || "N/A").toUpperCase(),
        ],
      ],
      ...tableOpts,
    });

    // ──────────────── GUARDIAN INFORMATION ────────────────
    const fatherY = nextY() - 5;
    doc
      .setFont("helvetica", "bold")
      .setFontSize(14)
      .setTextColor(33, 150, 243)
      .text("FATHER'S INFORMATION", 15, fatherY);

    // father's photo
    if (fatherImg) {
      try {
        doc.setDrawColor(200);
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(159, fatherY + 4, 22, 22, 2, 2, "FD");
        doc.addImage(fatherImg, "JPEG", 160, fatherY + 5, 20, 20);
        doc.setFontSize(6).setTextColor(150);
        doc.text(`Photo of father`, 170, fatherY + 27, { align: "center" });
      } catch {}
    }

    autoTable(doc, {
      startY: fatherY + 25,
      head: [["FATHER'S INFORMATION", ""]],
      body: [
        [
          "Full Name",
          `${ApplicationData?.guardian?.fatherInfo?.firstName ?? "N/A"} ` +
            `${ApplicationData?.guardian?.fatherInfo?.middleName || ""} ` +
            `${ApplicationData?.guardian?.fatherInfo?.lastName || ""}`.trim(),
        ],
        ["ID Number", ApplicationData?.guardian?.fatherInfo?.idNumber || "N/A"],
        [
          "ID Expiry",
          moment(ApplicationData?.guardian?.fatherInfo?.idExpiry).isValid()
            ? moment(ApplicationData.guardian.fatherInfo.idExpiry).format(
                "DD MMM YYYY"
              )
            : "N/A",
        ],
        [
          "Nationality",
          (
            ApplicationData?.guardian?.fatherInfo?.nationality || "N/A"
          ).toUpperCase(),
        ],
        [
          "Religion",
          (
            ApplicationData?.guardian?.fatherInfo?.religion || "N/A"
          ).toUpperCase(),
        ],
        ["Company", ApplicationData?.guardian?.fatherInfo?.company || "N/A"],
        ["Job Title", ApplicationData?.guardian?.fatherInfo?.jobTitle || "N/A"],
        [
          "Primary Phone",
          ApplicationData?.guardian?.fatherInfo?.cell1 || "N/A",
        ],
        [
          "Secondary Phone",
          ApplicationData?.guardian?.fatherInfo?.cell2 || "N/A",
        ],
        [
          "Primary Email",
          ApplicationData?.guardian?.fatherInfo?.email1 || "N/A",
        ],
        [
          "Secondary Email",
          ApplicationData?.guardian?.fatherInfo?.email2 || "N/A",
        ],
      ],
      margin: { left: 15, right: 40 },
      ...tableOpts,
    });

    // ───────────────── MOTHER'S INFORMATION ─────────────────
    const motherY = nextY() - 5;
    doc
      .setFont("helvetica", "bold")
      .setFontSize(14)
      .setTextColor(33, 150, 243)
      .text(" MOTHER'S INFORMATION", 15, motherY);

    // mother's photo
    if (motherImg) {
      try {
        doc.setDrawColor(200);
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(159, motherY + 4, 22, 22, 2, 2, "FD");
        doc.addImage(motherImg, "JPEG", 160, motherY + 5, 20, 20);
        doc.setFontSize(6).setTextColor(150);
        doc.text(`Photo of mother`, 170, motherY + 27, { align: "center" });
      } catch {}
    }

    autoTable(doc, {
      startY: motherY + 25,
      head: [["MOTHER'S INFORMATION", ""]],
      body: [
        [
          "Full Name",
          `${ApplicationData?.guardian?.motherInfo?.firstName ?? "N/A"} ` +
            `${ApplicationData?.guardian?.motherInfo?.middleName || ""} ` +
            `${ApplicationData?.guardian?.motherInfo?.lastName || ""}`.trim(),
        ],
        ["ID Number", ApplicationData?.guardian?.motherInfo?.idNumber || "N/A"],
        [
          "ID Expiry",
          moment(ApplicationData?.guardian?.motherInfo?.idExpiry).isValid()
            ? moment(ApplicationData.guardian.motherInfo.idExpiry).format(
                "DD MMM YYYY"
              )
            : "N/A",
        ],
        [
          "Nationality",
          (
            ApplicationData?.guardian?.motherInfo?.nationality || "N/A"
          ).toUpperCase(),
        ],
        [
          "Religion",
          (
            ApplicationData?.guardian?.motherInfo?.religion || "N/A"
          ).toUpperCase(),
        ],
        ["Company", ApplicationData?.guardian?.motherInfo?.company || "N/A"],
        ["Job Title", ApplicationData?.guardian?.motherInfo?.jobTitle || "N/A"],
        [
          "Primary Phone",
          ApplicationData?.guardian?.motherInfo?.cell1 || "N/A",
        ],
        [
          "Secondary Phone",
          ApplicationData?.guardian?.motherInfo?.cell2 || "N/A",
        ],
        [
          "Primary Email",
          ApplicationData?.guardian?.motherInfo?.email1 || "N/A",
        ],
        [
          "Secondary Email",
          ApplicationData?.guardian?.motherInfo?.email2 || "N/A",
        ],
      ],
      margin: { left: 15, right: 40 },
      ...tableOpts,
    });

    // ─────────────── PRIMARY GUARDIAN INFORMATION ───────────────
    autoTable(doc, {
      startY: nextY(),
      head: [["PRIMARY GUARDIAN INFORMATION", ""]],
      body: [
        [
          "Name",
          ApplicationData?.guardian?.guardianInformation?.guardianName || "N/A",
        ],
        [
          "Relation",
          ApplicationData?.guardian?.guardianInformation
            ?.guardianRelationToStudent || "N/A",
        ],
        [
          "Contact Number",
          ApplicationData?.guardian?.guardianInformation
            ?.guardianContactNumber || "N/A",
        ],
        [
          "Email",
          ApplicationData?.guardian?.guardianInformation?.guardianEmail ||
            "N/A",
        ],
      ],
      ...tableOpts,
    });

    // ───────────────── ADDRESS INFORMATION ─────────────────
    const addSection = (title, icon = "📋") => {
      doc
        .setFont("helvetica", "bold")
        .setFontSize(14)
        .setTextColor(33, 150, 243);
      doc.text(`${icon} ${title}`, 15, nextY());
    };

    addSection("ADDRESS INFORMATION", "🏠");
    autoTable(doc, {
      startY: nextY() + 5,
      head: [["Address Type", "Details"]],
      body: [
        [
          "Unit/Building",
          `${
            ApplicationData?.address?.residentialAddress?.buildingNumber ||
            "N/A"
          }`,
        ],
        [
          "Street",
          ApplicationData?.address?.residentialAddress?.streetName || "N/A",
        ],

        ["City", ApplicationData?.address?.residentialAddress?.city || "N/A"],
        [
          "Country",
          (
            ApplicationData?.address?.residentialAddress?.country || "N/A"
          ).toUpperCase(),
        ],

        [
          "Transport Required",
          ApplicationData?.address?.transportRequirement ? "YES" : "NO",
        ],
        ["", ""], // spacer
        ["PERMANENT ADDRESS", ""],

        [
          "Building",

          `${ApplicationData?.address?.permanentAddress?.buildingNumber}`,
        ],
        [
          "Street",
          ApplicationData?.address?.permanentAddress?.streetName || "N/A",
        ],

        [
          "Compound",
          ApplicationData?.address?.permanentAddress?.compoundName || "N/A",
        ],
        ["City", ApplicationData?.address?.permanentAddress?.city || "N/A"],
        [
          "Country",
          (
            ApplicationData?.address?.permanentAddress?.country || "N/A"
          ).toUpperCase(),
        ],
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
              .setTextColor(33, 150, 243)
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
            data.cell.styles.textColor = [33, 150, 243];
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
    });

    // ───────────────── ACADEMIC INFORMATION ─────────────────
    addSection("ACADEMIC INFORMATION", "🎓");
    autoTable(doc, {
      startY: nextY() + 5,
      head: [["Academic Field", "Details"]],
      body: [
        [
          "Previous Class",
          (ApplicationData?.academic?.previousClass || "N/A").toUpperCase(),
        ],
        [
          "Curriculum",
          (ApplicationData?.academic?.curriculum || "N/A").toUpperCase(),
        ],
        [
          "Previous School",
          ApplicationData?.academic?.previousSchoolName || "N/A",
        ],
        [
          "Source of Fee",
          (ApplicationData?.academic?.sourceOfFee || "N/A").toUpperCase(),
        ],
      ],
      ...tableOpts,
    });

    // ───────────── LANGUAGE & PREFERENCES ────────────────
    addSection("LANGUAGE & PREFERENCES", "🗣️");
    autoTable(doc, {
      startY: nextY() + 5,
      head: [["Preference Type", "Selection"]],
      body: [
        [
          "Second Language",
          (ApplicationData?.languagePreference?.secondLanguage || [])
            .join(", ")
            .toUpperCase() || "N/A",
        ],
        [
          "Third Language",
          (ApplicationData?.languagePreference?.thirdLanguage || [])
            .join(", ")
            .toUpperCase() || "N/A",
        ],
        [
          "Value Education",
          (ApplicationData?.languagePreference?.valueEducation || [])
            .join(", ")
            .toUpperCase() || "N/A",
        ],
        [
          "Left Handed",
          ApplicationData?.languagePreference?.isLeftHanded ? "YES" : "NO",
        ],
        [
          "Medical Condition",
          (
            ApplicationData?.languagePreference?.medicalCondition || "NONE"
          ).toUpperCase(),
        ],
      ],
      ...tableOpts,
    });

    // ─────────────── DOCUMENTS SUBMITTED ────────────────
    addSection("DOCUMENTS SUBMITTED", "📄");
    const docRows = (ApplicationData?.documents?.files || []).map((f) => [
      f.fieldname || "N/A",
      {
        content:
          f.documentName.length > 30
            ? f.documentName.slice(0, 27) + "…"
            : f.documentName,
        url: f.url,
        alt: `Document: ${f.documentName} (${f.type})`,
      },
      (f.type || "N/A").toUpperCase(),
    ]);

    autoTable(doc, {
      startY: nextY() + 5,
      head: [["Document Type", "File Name (click)", "File Type"]],
      body: docRows.length ? docRows : [["No documents uploaded", "", ""]],
      styles: { ...tableOpts.styles, fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: "bold" },
        1: { cellWidth: 80 },
        2: { cellWidth: 30 },
      },
      ...tableOpts,
      didParseCell: (data) => {
        if (data.cell.raw?.url) {
          data.cell.text = data.cell.raw.content;
          data.cell.styles.textColor = [0, 0, 255];
          data.cell.styles.fontStyle = "underline";
          data.cell.link = data.cell.raw.url;
          // Add alt text for accessibility
          data.cell.alt = data.cell.raw.alt;
        }
      },
    });

    // ──────────── CONSENT & ACKNOWLEDGEMENT ─────────────
    // addSection("CONSENT & ACKNOWLEDGEMENT", "✅");
    // autoTable(doc, {
    //   startY: nextY() + 5,
    //   head: [["Consent Type", "Status"]],
    //   body: [
    //     [
    //       "Photo/Video Consent",
    //       ApplicationData?.consent?.photoConsent === "yes"
    //         ? { content: "GRANTED", color: [0, 128, 0] }
    //         : { content: "NOT GRANTED", color: [255, 0, 0] },
    //     ],
    //     [
    //       "Information Accuracy",
    //       ApplicationData?.consent?.acknowledgements?.includes("infoAccurate")
    //         ? { content: "CONFIRMED", color: [0, 128, 0] }
    //         : { content: "NOT CONFIRMED", color: [255, 0, 0] },
    //     ],
    //     [
    //       "Legal Custody",
    //       ApplicationData?.consent?.acknowledgements?.includes("legalCustody")
    //         ? { content: "CONFIRMED", color: [0, 128, 0] }
    //         : { content: "NOT CONFIRMED", color: [255, 0, 0] },
    //     ],
    //     [
    //       "Accept Policies",
    //       ApplicationData?.consent?.acknowledgements?.includes("acceptPolicies")
    //         ? { content: "CONFIRMED", color: [0, 128, 0] }
    //         : { content: "NOT CONFIRMED", color: [255, 0, 0] },
    //     ],
    //     [
    //       "Data Usage",
    //       ApplicationData?.consent?.acknowledgements?.includes("dataUsage")
    //         ? { content: "CONFIRMED", color: [0, 128, 0] }
    //         : { content: "NOT CONFIRMED", color: [255, 0, 0] },
    //     ],
    //   ],
    //   ...tableOpts,
    //   didParseCell: (data) => {
    //     if (data.cell.raw?.color) {
    //       data.cell.styles.textColor = data.cell.raw.color;
    //       data.cell.text = data.cell.raw.content;
    //     }
    //   },
    // });

    // page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc
        .setPage(i)
        .setFontSize(8)
        .setTextColor(150)
        .text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 10
        );
    }

    // ─────────────────────── DOWNLOAD ───────────────────────
    const fileName = `StudentRegistration_${
      ApplicationData?.candidate?.firstName || "Unknown"
    }_${ApplicationData?.candidate?.lastName || "Student"}_${moment().format(
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
