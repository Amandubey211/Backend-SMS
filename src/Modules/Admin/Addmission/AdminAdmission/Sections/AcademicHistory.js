// import React, { memo } from "react";
// import { Row, Col } from "antd";
// import {
//   BookOutlined,
//   CalendarOutlined,
//   ReadOutlined,
//   UserOutlined,
//   MoneyCollectOutlined,
// } from "@ant-design/icons";
// import CompactIconInput from "../Components/CompactIconInput";
// import CompactIconSelect from "../Components/CompactIconSelect";
// import CompactIconDatePicker from "../Components/CompactIconDatePicker";

// const AcademicHistory = memo(({ formRefs, errors, touched }) => {
//   return (
//     <div>
//       <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mb-0">
//         Academic History
//       </h2>
//       <div className="p-3">
//         <Row gutter={[16, 16]}>
//           <Col xs={24} md={12}>
//             <CompactIconInput
//               name="academicHistory.previousSchoolName"
//               icon={<ReadOutlined />}
//               tooltip="Previous School Name"
//               placeholder="Previous School Name"
//               ref={(el) =>
//                 (formRefs.current["academicHistory.previousSchoolName"] = el)
//               }
//               error={
//                 touched.academicHistory?.previousSchoolName &&
//                 errors.academicHistory?.previousSchoolName
//               }
//             />
//           </Col>
//           <Col xs={24} md={12}>
//             <CompactIconInput
//               name="academicHistory.previousClass"
//               icon={<UserOutlined />}
//               tooltip="Previous Class"
//               placeholder="Previous Class"
//               ref={(el) =>
//                 (formRefs.current["academicHistory.previousClass"] = el)
//               }
//               error={
//                 touched.academicHistory?.previousClass &&
//                 errors.academicHistory?.previousClass
//               }
//             />
//           </Col>
//         </Row>

//         <Row gutter={[16, 16]} className="mt-4">
//           <Col xs={24} md={8}>
//             <CompactIconSelect
//               name="academicHistory.curriculum"
//               icon={<BookOutlined />}
//               tooltip="Curriculum"
//               placeholder="Curriculum"
//               options={[
//                 { label: "American", value: "american" },
//                 { label: "British", value: "british" },
//                 { label: "IB (International Baccalaureate)", value: "ib" },
//                 { label: "CBSE", value: "cbse" },
//                 { label: "ICSE", value: "icse" },
//                 { label: "K-12", value: "k12" },
//                 { label: "Cambridge", value: "cambridge" },
//                 { label: "Australian", value: "australian" },
//                 { label: "Agha Khan", value: "agha_khan" },
//                 { label: "Lebanese", value: "lebanese" },
//                 { label: "Jordanian", value: "jordanian" },
//                 { label: "Qatari", value: "qatari" },
//                 { label: "Pakistani", value: "pakistani" },
//                 { label: "Bangladeshi", value: "bangladeshi" },
//                 { label: "Filipino", value: "filipino" },
//                 { label: "Malaysian", value: "malaysian" },
//                 { label: "Srilankan", value: "srilankan" },
//                 { label: "Egyptian", value: "egyptian" },
//                 { label: "Palestinian", value: "palestinian" },
//                 { label: "Other (Please Specify)", value: "other" },
//               ]}
//               ref={(el) =>
//                 (formRefs.current["academicHistory.curriculum"] = el)
//               }
//               error={
//                 touched.academicHistory?.curriculum &&
//                 errors.academicHistory?.curriculum
//               }
//             />
//           </Col>
//           <Col xs={24} md={8}>
//             <CompactIconDatePicker
//               name="academicHistory.lastDayAtSchool"
//               icon={<CalendarOutlined />}
//               tooltip="Last Day at School"
//               placeholder="Last Day at School"
//             />
//           </Col>
//           <Col xs={24} md={8}>
//             <CompactIconSelect
//               name="academicHistory.sourceOfFee"
//               icon={<MoneyCollectOutlined />}
//               tooltip="Source of Fee"
//               placeholder="Source of Fee"
//               options={[
//                 { label: "Parent", value: "Parent" },
//                 { label: "Company", value: "Company" },
//               ]}
//             />
//           </Col>
//         </Row>
//       </div>
//     </div>
//   );
// });

// export default AcademicHistory;

// src/components/AdminAdmission/Sections/AcademicHistory.js

import React, { memo } from "react";
import { Form, Row, Col, Select, DatePicker, Input } from "antd";
import {
  ReadOutlined,
  UserOutlined,
  BookOutlined,
  CalendarOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const AcademicHistory = memo(() => {
  return (
    <>
      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mb-0">
        Academic History
      </h2>
      <div className="p-3">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name={["academicHistory", "previousSchoolName"]}
              label="Previous School Name"
              rules={[
                { required: true, message: "Previous school is required" },
              ]}
            >
              <Input
                prefix={<ReadOutlined />}
                placeholder="Previous School Name"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name={["academicHistory", "previousClass"]}
              label="Previous Class"
              rules={[
                { required: true, message: "Previous class is required" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Previous Class" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} md={8}>
            <Form.Item
              name={["academicHistory", "curriculum"]}
              label="Curriculum"
              rules={[{ required: true, message: "Curriculum is required" }]}
            >
              <Select
                placeholder="Select Curriculum"
                suffixIcon={<BookOutlined />}
                showSearch
                optionFilterProp="children"
              >
                <Option value="american">American</Option>
                <Option value="british">British</Option>
                <Option value="ib">IB (International Baccalaureate)</Option>
                <Option value="cbse">CBSE</Option>
                <Option value="icse">ICSE</Option>
                <Option value="k12">K-12</Option>
                <Option value="cambridge">Cambridge</Option>
                <Option value="australian">Australian</Option>
                <Option value="agha_khan">Agha Khan</Option>
                <Option value="lebanese">Lebanese</Option>
                <Option value="jordanian">Jordanian</Option>
                <Option value="qatari">Qatari</Option>
                <Option value="pakistani">Pakistani</Option>
                <Option value="bangladeshi">Bangladeshi</Option>
                <Option value="filipino">Filipino</Option>
                <Option value="malaysian">Malaysian</Option>
                <Option value="srilankan">Sri Lankan</Option>
                <Option value="egyptian">Egyptian</Option>
                <Option value="palestinian">Palestinian</Option>
                <Option value="other">Other (Please Specify)</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name={["academicHistory", "lastDayAtSchool"]}
              label="Last Day at School"
            >
              <DatePicker
                style={{ width: "100%" }}
                suffixIcon={<CalendarOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name={["academicHistory", "sourceOfFee"]}
              label="Source of Fee"
              initialValue="Parent"
              rules={[{ required: true, message: "Source of fee is required" }]}
            >
              <Select
                placeholder="Select Source"
                suffixIcon={<MoneyCollectOutlined />}
              >
                <Option value="Parent">Parent</Option>
                <Option value="Company">Company</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  );
});

export default AcademicHistory;
