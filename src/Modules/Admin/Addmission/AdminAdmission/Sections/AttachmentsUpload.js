import React from "react";
import { Row, Col } from "antd";
import SingleFileUpload from "../Components/SingleFileUpload";

const AttachmentsUpload = () => {
  return (
    <div>
      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mb-0">
        Attachments
      </h2>
      <div className="p-3">
        <h3 className="text-base font-bold mb-3">Mandatory</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <SingleFileUpload
              label="Student ID Copy*"
              name="attachments.mandatory.studentIdCopy"
            />
          </Col>
          <Col xs={24} md={12}>
            <SingleFileUpload
              label="Student Passport*"
              name="attachments.mandatory.studentPassport"
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} md={12}>
            <SingleFileUpload
              label="Last Report Card*"
              name="attachments.mandatory.lastReportCard"
            />
          </Col>
        </Row>
        <h3 className="text-base font-bold my-3">Optional</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <SingleFileUpload
              label="Medical Report"
              name="attachments.optional.medicalReport"
            />
          </Col>
          <Col xs={24} md={12}>
            <SingleFileUpload
              label="Birth Certificate"
              name="attachments.optional.birthCertificate"
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} md={12}>
            <SingleFileUpload
              label="Vaccination Card / Certificate"
              name="attachments.optional.vaccinationCard"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AttachmentsUpload;
