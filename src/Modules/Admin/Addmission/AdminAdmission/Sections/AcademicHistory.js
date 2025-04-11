import React from "react";
import { Row, Col } from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  ReadOutlined,
  UserOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import CompactIconInput from "../Components/CompactIconInput";
import CompactIconSelect from "../Components/CompactIconSelect";
import CompactIconDatePicker from "../Components/CompactIconDatePicker";

const AcademicHistory = () => {
  return (
    <div>
      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mb-0">
        Academic History
      </h2>
      <div className="p-3">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <CompactIconInput
              name="academicHistory.previousSchoolName"
              icon={<ReadOutlined />}
              tooltip="Previous School Name"
              placeholder="Previous School Name"
            />
          </Col>
          <Col xs={24} md={8}>
            <CompactIconSelect
              name="academicHistory.previousClass"
              icon={<UserOutlined />}
              tooltip="Previous Class"
              placeholder="Previous Class"
              options={[
                { label: "Class 1", value: "class1" },
                { label: "Class 2", value: "class2" },
                { label: "Class 3", value: "class3" },
              ]}
            />
          </Col>
          <Col xs={24} md={8}>
            <CompactIconSelect
              name="academicHistory.curriculum"
              icon={<BookOutlined />}
              tooltip="Curriculum"
              placeholder="Curriculum"
              options={[
                { label: "CBSE", value: "cbse" },
                { label: "IGCSE", value: "igcse" },
                { label: "IB", value: "ib" },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} md={8}>
            <CompactIconDatePicker
              name="academicHistory.lastDayAtSchool"
              icon={<CalendarOutlined />}
              tooltip="Last Day at School"
              placeholder="Last Day at School"
            />
          </Col>
          <Col xs={24} md={8}>
            <CompactIconSelect
              name="academicHistory.sourceOfFee"
              icon={<MoneyCollectOutlined />}
              tooltip="Source of Fee"
              placeholder="Source of Fee"
              options={[
                { label: "Parent", value: "parent" },
                { label: "Company", value: "company" },
              ]}
            />
          </Col>
          <Col xs={24} md={8}>
            {/* Empty column for layout alignment */}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AcademicHistory;
