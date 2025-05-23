import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Row, Col, Input, DatePicker, Select } from "antd";
import PhoneInput from "react-phone-input-2";
import moment from "moment";
import "react-phone-input-2/lib/style.css";
import {
  UserOutlined,
  IdcardOutlined,
  CalendarOutlined,
  HeartOutlined,
  GlobalOutlined,
  MailOutlined,
  ContactsOutlined,
} from "@ant-design/icons";

import { fetchAcademicYear } from "../../../../../Store/Slices/Common/AcademicYear/academicYear.action";
import { fetchAllClasses } from "../../../../../Store/Slices/Admin/Class/actions/classThunk";
import {
  GENDER_OPTIONS,
  COUNTRY_OPTIONS,
  RELIGION_OPTIONS,
  bloodGroupOptions,
  CONTACT_TYPE_OPTIONS,
} from "../Configs/selectOptionsConfig";
import LanguagePreferences from "./LanguagePreferences";
import CustomUploadCard from "../../../../LoginPages/Student/SignUp/Components/CustomUploadCard";

const { Option } = Select;

const AcademicSessionCandidate = ({ form }) => {
  const dispatch = useDispatch();
  const academicYears = useSelector((s) => s.common.academicYear.academicYears);
  const classes = useSelector((s) => s.admin.class.classes);

  // fetch dropdown data
  useEffect(() => {
    dispatch(fetchAcademicYear());
    dispatch(fetchAllClasses());
  }, [dispatch]);

  // build Select options
  const academicYearOptions = academicYears.map((ay) => (
    <Option key={ay._id} value={ay._id}>
      {ay.year}
    </Option>
  ));
  const classOptions = classes.map((cls) => (
    <Option key={cls._id} value={cls._id}>
      {cls.className}
    </Option>
  ));

  // watch DOB to auto-calculate age
  const dob = Form.useWatch(["candidateInformation", "dob"], form);
  useEffect(() => {
    if (dob) {
      const birth = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      form.setFieldsValue({
        candidateInformation: {
          ...form.getFieldValue("candidateInformation"),
          age,
        },
      });
    }
  }, [dob, form]);

  // determine if we should show 3rd language (grade >=3)
  const selectedClassId = form.getFieldValue(["academicSession", "class"]);
  const clsLabel =
    classes.find((c) => c._id === selectedClassId)?.className || "";
  const gradeNum = parseInt(clsLabel.replace(/\D/g, ""), 10);
  const showThirdLang = gradeNum >= 3;

  return (
    <>
      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mb-0">
        Candidate Information
      </h2>
      <div className="p-3">
        <Row gutter={16}>
          {/* Left Column - Profile, DOB & Age */}
          <Col xs={24} md={6}>
            <Form.Item
              name="profile"
              label="Profile Picture"
              rules={[
                { required: true, message: "Profile picture is required" },
              ]}
            >
              <CustomUploadCard
                name="profile"
                form={form}
                recommendedSize="300x400"
                width="w-full"
                height="h-52"
                required
              />
            </Form.Item>

            <Form.Item
              name={["candidateInformation", "dob"]}
              label="Date of Birth"
              rules={[
                {
                  required: true,
                  message: "DOB is required",
                },
                () => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.resolve();
                    }
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Reset time part for accurate comparison

                    if (selectedDate >= today) {
                      return Promise.reject(
                        new Error("Date of Birth must be in the past")
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                suffixIcon={<CalendarOutlined />}
                disabledDate={(current) => {
                  // Disable dates that are today or in the future
                  return current && current >= moment().startOf("day");
                }}
              />
            </Form.Item>

            {/* Moved Age right below DOB */}
            <Form.Item name={["candidateInformation", "age"]} label="Age">
              <Input disabled placeholder="Age" suffix="years" />
            </Form.Item>
          </Col>

          {/* Right Column - All other fields */}
          <Col xs={24} md={18}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["candidateInformation", "firstName"]}
                  label="First Name"
                  rules={[
                    { required: true, message: "First name is required" },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["candidateInformation", "middleName"]}
                  label="Middle Name"
                >
                  <Input prefix={<UserOutlined />} placeholder="Middle Name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["candidateInformation", "lastName"]}
                  label="Last Name"
                  rules={[{ required: true, message: "Last name is required" }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Last Name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["candidateInformation", "studentId"]}
                  label="Student ID"
                  rules={[
                    { required: true, message: "Student ID is required" },
                  ]}
                >
                  <Input prefix={<IdcardOutlined />} placeholder="Student ID" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["candidateInformation", "idExpiry"]}
                  label="ID Expiry"
                  rules={[{ required: true, message: "ID expiry is required" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    suffixIcon={<CalendarOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["candidateInformation", "passportNumber"]}
                  label="Passport Number"
                >
                  <Input
                    prefix={<IdcardOutlined />}
                    placeholder="Passport Number"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["candidateInformation", "passportExpiry"]}
                  label="Passport Expiry"
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    suffixIcon={<CalendarOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["candidateInformation", "placeOfBirth"]}
                  label="Place of Birth"
                >
                  <Select
                    placeholder="Place of Birth"
                    suffixIcon={<GlobalOutlined />}
                    showSearch
                    optionFilterProp="children"
                  >
                    {COUNTRY_OPTIONS.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["candidateInformation", "nationality"]}
                  label="Nationality"
                  rules={[
                    { required: true, message: "Nationality is required" },
                  ]}
                >
                  <Select
                    placeholder="Nationality"
                    suffixIcon={<GlobalOutlined />}
                    showSearch
                    optionFilterProp="children"
                  >
                    {COUNTRY_OPTIONS.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["candidateInformation", "height"]}
                  label="Height (cm)"
                  rules={[
                    {
                      pattern: /^[0-9]+$/,
                      message: "Please enter a valid height",
                    },
                  ]}
                >
                  <Input suffix="cm" placeholder="Height" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["candidateInformation", "weight"]}
                  label="Weight (kg)"
                  rules={[
                    {
                      pattern: /^[0-9]+$/,
                      message: "Please enter a valid weight",
                    },
                  ]}
                >
                  <Input suffix="kg" placeholder="Weight" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["candidateInformation", "bloodGroup"]}
                  label="Blood Group"
                  rules={[
                    { required: true, message: "Blood group is required" },
                  ]}
                >
                  <Select
                    placeholder="Blood Group"
                    suffixIcon={<HeartOutlined />}
                  >
                    {bloodGroupOptions.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["candidateInformation", "gender"]}
                  label="Gender"
                  rules={[{ required: true, message: "Gender is required" }]}
                >
                  <Select placeholder="Gender" suffixIcon={<UserOutlined />}>
                    {GENDER_OPTIONS.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["candidateInformation", "religion"]}
                  label="Religion"
                >
                  <Select
                    placeholder="Religion"
                    suffixIcon={<GlobalOutlined />}
                    showSearch
                    optionFilterProp="children"
                  >
                    {RELIGION_OPTIONS.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["candidateInformation", "primaryContactType"]}
                  label="Primary Contact Type"
                  rules={[
                    { required: true, message: "Contact type is required" },
                  ]}
                >
                  <Select
                    placeholder="Select Type"
                    suffixIcon={<ContactsOutlined />}
                  >
                    {CONTACT_TYPE_OPTIONS.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["candidateInformation", "email"]}
                  label="Email"
                  rules={[
                    { type: "email", message: "Invalid email" },
                    { required: true, message: "Email is required" },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["candidateInformation", "contactNumber"]}
                  label="Primary Contact"
                  rules={[
                    { required: true, message: "Contact number is required" },
                  ]}
                >
                  <PhoneInput country="qa" inputStyle={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                {" "}
                <Form.Item
                  name={["candidateInformation", "emergencyContactNumber"]}
                  label="Emergency Contact"
                  rules={[
                    {
                      required: true,
                      message: "Emergency contact is required",
                    },
                  ]}
                >
                  <PhoneInput country="qa" inputStyle={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mt-6 mb-0">
        Academic Session
      </h2>
      <div className="p-3">
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              name={["academicSession", "class"]}
              label="Class"
              rules={[{ required: true, message: "Please select class" }]}
            >
              <Select
                placeholder="Select Class"
                suffixIcon={<IdcardOutlined />}
              >
                {classOptions}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name={["academicSession", "academicYear"]}
              label="Academic Year"
              rules={[
                { required: true, message: "Please select academic year" },
              ]}
            >
              <Select
                placeholder="Select Year"
                suffixIcon={<CalendarOutlined />}
              >
                {academicYearOptions}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name={["academicSession", "enrollmentStats"]}
              label="Enrollment Status"
              initialValue="Full Time"
              rules={[
                { required: true, message: "Please select enrollment status" },
              ]}
            >
              <Select placeholder="Enrollment Status">
                <Option value="Full Time">Full Time</Option>
                <Option value="Part Time">Part Time</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>

      {/* Language & Preferences */}
      <LanguagePreferences showThirdLang={showThirdLang} />
    </>
  );
};

export default AcademicSessionCandidate;
