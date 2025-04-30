import React, { memo } from "react";
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

const AcademicHistory = memo(({ formRefs, errors, touched }) => {
  return (
    <div>
      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mb-0">
        Academic History
      </h2>
      <div className="p-3">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <CompactIconInput
              name="academicHistory.previousSchoolName"
              icon={<ReadOutlined />}
              tooltip="Previous School Name"
              placeholder="Previous School Name"
              ref={(el) =>
                (formRefs.current["academicHistory.previousSchoolName"] = el)
              }
              error={
                touched.academicHistory?.previousSchoolName &&
                errors.academicHistory?.previousSchoolName
              }
            />
          </Col>
          <Col xs={24} md={12}>
            <CompactIconInput
              name="academicHistory.previousClass"
              icon={<UserOutlined />}
              tooltip="Previous Class"
              placeholder="Previous Class"
              ref={(el) =>
                (formRefs.current["academicHistory.previousClass"] = el)
              }
              error={
                touched.academicHistory?.previousClass &&
                errors.academicHistory?.previousClass
              }
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} md={8}>
            <CompactIconSelect
              name="academicHistory.curriculum"
              icon={<BookOutlined />}
              tooltip="Curriculum"
              placeholder="Curriculum"
              options={[
                { label: "American", value: "american" },
                { label: "British", value: "british" },
                { label: "IB (International Baccalaureate)", value: "ib" },
                { label: "CBSE", value: "cbse" },
                { label: "ICSE", value: "icse" },
                { label: "K-12", value: "k12" },
                { label: "Cambridge", value: "cambridge" },
                { label: "Australian", value: "australian" },
                { label: "Agha Khan", value: "agha_khan" },
                { label: "Lebanese", value: "lebanese" },
                { label: "Jordanian", value: "jordanian" },
                { label: "Qatari", value: "qatari" },
                { label: "Pakistani", value: "pakistani" },
                { label: "Bangladeshi", value: "bangladeshi" },
                { label: "Filipino", value: "filipino" },
                { label: "Malaysian", value: "malaysian" },
                { label: "Srilankan", value: "srilankan" },
                { label: "Egyptian", value: "egyptian" },
                { label: "Palestinian", value: "palestinian" },
                { label: "Other (Please Specify)", value: "other" },
              ]}
              ref={(el) =>
                (formRefs.current["academicHistory.curriculum"] = el)
              }
              error={
                touched.academicHistory?.curriculum &&
                errors.academicHistory?.curriculum
              }
            />
          </Col>
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
                { label: "Parent", value: "Parent" },
                { label: "Company", value: "Company" },
              ]}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
});

export default AcademicHistory;
