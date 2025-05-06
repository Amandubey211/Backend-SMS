import React, { useState } from "react";
import {
  Form,
  Button,
  Checkbox,
  Radio,
  Card,
  Modal,
  Result,
  message,
} from "antd";
import { CheckCircleFilled, DownloadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";

import {
  nextStep,
  prevStep,
  updateFormData,
  registerStudentDetails,
  resetSignup,
} from "../../../../../Store/Slices/Common/User/actions/studentSignupSlice";

const ConsentAcknowledgement = ({ formData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { formData: ApplicationData } = useSelector(
    (s) => s.common.studentSignup
  );
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  /* Generate and download PDF */

  const handleDownload = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set document properties
    doc.setProperties({
      title: `Student Registration - ${
        ApplicationData?.candidate?.firstName ?? "N/A"
      } ${ApplicationData?.candidate?.lastName ?? "N/A"}`,
      subject: "Student Registration Form",
      author: "School Management System",
      keywords: "student, registration, form",
      creator: "School Management System",
    });

    // Add header
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text("STUDENT REGISTRATION FORM", 105, 20, { align: "center" });

    // Add school info section
    doc.setFontSize(12);
    doc.setTextColor(80);
    doc.setFont("helvetica", "normal");
    doc.text(`School: ${ApplicationData?.school?.schoolId ?? "N/A"}`, 15, 30);
    doc.text(
      `Applying for Class: ${ApplicationData?.school?.applyingClass ?? "N/A"}`,
      15,
      36
    );
    doc.text(`Submission Date: ${moment().format("DD MMM YYYY")}`, 15, 42);

    // Add line separator
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(15, 46, 195, 46);

    // Candidate Information Section
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text("CANDIDATE INFORMATION", 15, 54);

    // Candidate table
    doc.autoTable({
      startY: 58,
      head: [["Field", "Details"]],
      body: [
        [
          "Full Name",
          `${ApplicationData?.candidate?.firstName ?? "N/A"} ${
            ApplicationData?.candidate?.lastName ?? "N/A"
          }`,
        ],
        [
          "Date of Birth",
          moment(ApplicationData?.candidate?.dob).format("DD MMM YYYY") ??
            "N/A",
        ],
        ["Gender", ApplicationData?.candidate?.gender ?? "N/A"],
        ["Place of Birth", ApplicationData?.candidate?.placeOfBirth ?? "N/A"],
        ["Religion", ApplicationData?.candidate?.religion ?? "N/A"],
        ["Blood Group", ApplicationData?.candidate?.bloodGroup ?? "N/A"],
        ["Email", ApplicationData?.candidate?.email ?? "N/A"],
      ],
      theme: "grid",
      headStyles: { fillColor: [220, 220, 220], textColor: [40, 40, 40] },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 15, right: 15 },
    });

    // Guardian Information Section
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text("GUARDIAN INFORMATION", 15, doc.autoTable.previous.finalY + 10);

    // Father info table
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 14,
      head: [["Father Information", ""]],
      body: [
        ["Full Name", ApplicationData?.guardian?.fatherInfo?.fullName ?? "N/A"],
        [
          "Contact Number 1",
          ApplicationData?.guardian?.fatherInfo?.cell1 ?? "N/A",
        ],
        [
          "Contact Number 2",
          ApplicationData?.guardian?.fatherInfo?.cell2 ?? "N/A",
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [240, 240, 240], textColor: [40, 40, 40] },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 15, right: 15 },
    });

    // Mother info table
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 2,
      head: [["Mother Information", ""]],
      body: [
        ["Full Name", ApplicationData?.guardian?.motherInfo?.fullName ?? "N/A"],
        [
          "Contact Number 1",
          ApplicationData?.guardian?.motherInfo?.cell1 ?? "N/A",
        ],
        [
          "Contact Number 2",
          ApplicationData?.guardian?.motherInfo?.cell2 ?? "N/A",
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [240, 240, 240], textColor: [40, 40, 40] },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 15, right: 15 },
    });

    // Guardian info table
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 2,
      head: [["Primary Guardian Information", ""]],
      body: [
        [
          "Name",
          ApplicationData?.guardian?.guardianInformation?.guardianName ?? "N/A",
        ],
        [
          "Relation",
          ApplicationData?.guardian?.guardianInformation
            ?.guardianRelationToStudent ?? "N/A",
        ],
        [
          "Contact Number",
          ApplicationData?.guardian?.guardianInformation
            ?.guardianContactNumber ?? "N/A",
        ],
        [
          "Email",
          ApplicationData?.guardian?.guardianInformation?.guardianEmail ??
            "N/A",
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [240, 240, 240], textColor: [40, 40, 40] },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 15, right: 15 },
    });

    // Address Information Section
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text("ADDRESS INFORMATION", 15, doc.autoTable.previous.finalY + 10);

    // Address table
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 14,
      head: [["Address Field", "Details"]],
      body: [
        ["Residence Type", ApplicationData?.address?.residenceType ?? "N/A"],
        [
          "Unit/Building",
          `${ApplicationData?.address?.unitNumber ?? "N/A"}, ${
            ApplicationData?.address?.buildingNumber ?? "N/A"
          }`,
        ],
        ["Street", ApplicationData?.address?.streetName ?? "N/A"],
        [
          "Zone",
          `${ApplicationData?.address?.zoneName ?? "N/A"} (${
            ApplicationData?.address?.zoneNumber ?? "N/A"
          })`,
        ],
        ["Compound", ApplicationData?.address?.compoundName ?? "N/A"],
        ["City", ApplicationData?.address?.city ?? "N/A"],
        ["Country", ApplicationData?.address?.country ?? "N/A"],
        [
          "Nearest Landmark",
          ApplicationData?.address?.nearestLandmark ?? "N/A",
        ],
        [
          "Transport Required",
          ApplicationData?.address?.transportRequired ? "Yes" : "No",
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [220, 220, 220], textColor: [40, 40, 40] },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 15, right: 15 },
    });

    // Academic Information Section
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text("ACADEMIC INFORMATION", 15, doc.autoTable.previous.finalY + 10);

    // Academic table
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 14,
      head: [["Academic Field", "Details"]],
      body: [
        ["Previous Class", ApplicationData?.academic?.previousClass ?? "N/A"],
        ["Curriculum", ApplicationData?.academic?.curriculum ?? "N/A"],
        ["Previous School", ApplicationData?.academic?.previousSchool ?? "N/A"],
        [
          "Last Day at Previous School",
          moment(ApplicationData?.academic?.lastDayAtSchool).format(
            "DD MMM YYYY"
          ) ?? "N/A",
        ],
        ["Source of Fee", ApplicationData?.academic?.sourceOfFee ?? "N/A"],
      ],
      theme: "grid",
      headStyles: { fillColor: [220, 220, 220], textColor: [40, 40, 40] },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 15, right: 15 },
    });

    // Language Preferences Section
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text("LANGUAGE PREFERENCES", 15, doc.autoTable.previous.finalY + 10);

    // Language table
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 14,
      head: [["Preference Type", "Selection"]],
      body: [
        [
          "Second Language",
          ApplicationData?.languagePreference?.secondLanguage?.join(", ") ??
            "N/A",
        ],
        [
          "Third Language",
          ApplicationData?.languagePreference?.thirdLanguage?.join(", ") ??
            "N/A",
        ],
        [
          "Value Education",
          ApplicationData?.languagePreference?.valueEducation?.join(", ") ??
            "N/A",
        ],
        [
          "Left Handed",
          ApplicationData?.languagePreference?.isLeftHanded ? "Yes" : "No",
        ],
        [
          "Medical Condition",
          ApplicationData?.languagePreference?.medicalCondition ?? "None",
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [220, 220, 220], textColor: [40, 40, 40] },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 15, right: 15 },
    });

    // Documents Section
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text("DOCUMENTS SUBMITTED", 15, doc.autoTable.previous.finalY + 10);

    // Documents table
    const docRows =
      ApplicationData?.documents?.files?.map((file) => [
        file.documentName ?? "N/A",
        file.name ?? "N/A",
        file.type ?? "N/A",
        `${(file.size / 1024).toFixed(2)} KB` ?? "N/A",
      ]) ?? [];

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 14,
      head: [["Document Type", "File Name", "File Type", "Size"]],
      body: docRows,
      theme: "grid",
      headStyles: { fillColor: [220, 220, 220], textColor: [40, 40, 40] },
      styles: { fontSize: 9, cellPadding: 2, overflow: "linebreak" },
      margin: { left: 15, right: 15 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20 },
      },
    });

    // Consent Section
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text(
      "CONSENT & ACKNOWLEDGEMENT",
      15,
      doc.autoTable.previous.finalY + 10
    );

    // Consent table
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 14,
      head: [["Consent Type", "Status"]],
      body: [
        [
          "Photo/Video Consent",
          ApplicationData?.consent?.photoConsent === "yes"
            ? "Granted"
            : "Not Granted",
        ],
        [
          "Information Accuracy",
          ApplicationData?.consent?.acknowledgements?.includes("infoAccurate")
            ? "Confirmed"
            : "Not Confirmed",
        ],
        [
          "Legal Custody",
          ApplicationData?.consent?.acknowledgements?.includes("legalCustody")
            ? "Confirmed"
            : "Not Confirmed",
        ],
        [
          "Accept Policies",
          ApplicationData?.consent?.acknowledgements?.includes("acceptPolicies")
            ? "Confirmed"
            : "Not Confirmed",
        ],
        [
          "Data Usage",
          ApplicationData?.consent?.acknowledgements?.includes("dataUsage")
            ? "Confirmed"
            : "Not Confirmed",
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [220, 220, 220], textColor: [40, 40, 40] },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 15, right: 15 },
    });

    // Footer
    const footerY = doc.internal.pageSize.height - 20;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "italic");
    doc.text(
      "This document is computer generated and does not require a signature.",
      105,
      footerY,
      { align: "center" }
    );
    doc.text(
      `Generated on: ${moment().format("DD MMM YYYY HH:mm")}`,
      105,
      footerY + 6,
      { align: "center" }
    );

    // Save the PDF
    doc.save(
      `StudentRegistration_${ApplicationData?.candidate?.firstName ?? "N/A"}_${
        ApplicationData?.candidate?.lastName ?? "N/A"
      }.pdf`
    );
    message.success("PDF downloaded successfully!");
  };
  /* handle back navigation */
  const handleBack = () => {
    dispatch(prevStep());
  };

  /* final submit */
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Update consent data in Redux store
      dispatch(updateFormData({ consent: values }));

      // Submit all form data to the server
      await dispatch(registerStudentDetails(navigate)).unwrap();

      // Show success modal
      setOpenModal(true);
    } catch (err) {
      console.log(err);
      message.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-6"
        initialValues={formData} // Initialize form with existing data
      >
        {/* ───────── photo / video consent ───────── */}
        <Card
          title="Parental Consent for Photos & Videos"
          className="rounded-xl shadow-md mb-6"
        >
          <Form.Item
            name="photoConsent"
            rules={[{ required: true, message: "Please select an option" }]}
          >
            <Radio.Group className="space-y-4">
              <Radio value="yes" className="text-lg">
                I give permission to use my child's photographs / videos
              </Radio>
              <Radio value="no" className="text-lg">
                I DO NOT give permission to use my child's photographs / videos
              </Radio>
            </Radio.Group>
          </Form.Item>
        </Card>

        {/* ───────── acknowledgements ───────── */}
        <Card title="Acknowledgement" className="rounded-xl shadow-md mb-6">
          <Form.Item
            name="acknowledgements"
            rules={[
              {
                validator: (_, v) =>
                  v && v.length >= 4
                    ? Promise.resolve()
                    : Promise.reject("Please acknowledge all statements"),
              },
            ]}
          >
            <Checkbox.Group className="grid gap-4">
              <Checkbox value="infoAccurate" className="text-lg">
                I confirm all provided information is true and accurate
              </Checkbox>
              <Checkbox value="legalCustody" className="text-lg">
                I confirm I have legal custody of the student
              </Checkbox>
              <Checkbox value="acceptPolicies" className="text-lg">
                I accept the school's policies and regulations
              </Checkbox>
              <Checkbox value="dataUsage" className="text-lg">
                I grant the school the right to use provided information for
                analytics and quality improvement
              </Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Card>

        {/* nav buttons */}
        <div className="flex justify-between mt-6">
          <Button
            size="large"
            className="text-gray-600 border-gray-300"
            onClick={handleBack}
          >
            Back
          </Button>

          <div className="flex gap-3">
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              size="large"
            >
              Download Copy
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white border-none hover:opacity-90 focus:opacity-90 transition-opacity"
            >
              Save&nbsp;&amp;&nbsp;Submit
            </Button>
          </div>
        </div>
      </Form>

      {/* Success confirmation modal */}
      {/* Success confirmation modal */}
      <Modal
        open={openModal}
        footer={null}
        centered
        onCancel={() => {
          navigate("/studentlogin");
          sessionStorage.removeItem("signupStep1");
          dispatch(resetSignup());
        }}
        width={500}
        closeIcon={<span className="text-gray-500 hover:text-gray-700">×</span>}
      >
        <Result
          icon={<CheckCircleFilled style={{ color: "#52c41a" }} />}
          title="Application Submitted!"
          subTitle="Thank you. Your application has been received. You may download a copy for your records."
          extra={[
            <Button
              key="download"
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
            >
              Download Copy
            </Button>,
            <Button
              key="done"
              onClick={() => {
                setOpenModal(false);
                navigate("/studentlogin");
                sessionStorage.removeItem("signupStep1");
                dispatch(resetSignup());
              }}
            >
              Done
            </Button>,
          ]}
        />
      </Modal>
    </div>
  );
};

export default ConsentAcknowledgement;
