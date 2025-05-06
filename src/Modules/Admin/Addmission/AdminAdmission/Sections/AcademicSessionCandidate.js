import React, { useEffect, useMemo, memo, useState } from "react";
import { Row, Col } from "antd";

import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  IdcardOutlined,
  CalendarOutlined,
  UserOutlined,
  GlobalOutlined,
  MailOutlined,
} from "@ant-design/icons";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { HeartOutlined } from "@ant-design/icons";
import CompactIconDatePicker from "../Components/CompactIconDatePicker";
import CompactIconInput from "../Components/CompactIconInput";
import CompactIconSelect from "../Components/CompactIconSelect";
import ImageUploader from "../Components/ImageUploader";
import { fetchAcademicYear } from "../../../../../Store/Slices/Common/AcademicYear/academicYear.action";
import { fetchAllClasses } from "../../../../../Store/Slices/Admin/Class/actions/classThunk";
import { useField } from "formik";
import LanguagePreferences from "./LanguagePreferences";
import {
  GENDER_OPTIONS,
  COUNTRY_OPTIONS,
  RELIGION_OPTIONS,
  NATIVE_LANGUAGE_OPTIONS,
  PRIMARY_CONTACT_OPTIONS,
  ENROLLMENT_STATUS_OPTIONS,
  bloodGroupOptions,
} from "../Configs/selectOptionsConfig";
import { fetchAdmissionOptions } from "../../../../../Store/Slices/Common/User/actions/userActions";

const PhoneInputField = memo(({ name, icon, tooltip, placeholder }) => {
  const [field, , helpers] = useField(name);
  const phoneValue = field.value || "";

  return (
    <div className="flex items-center w-full rounded hover:border-blue-500 transition-colors">
      {icon && (
        <span className="mr-2 text-gray-400" title={tooltip}>
          {icon}
        </span>
      )}
      <PhoneInput
        country={"qa"}
        value={phoneValue}
        onChange={(value) => helpers.setValue(value)}
        inputStyle={{
          width: "100%",
          height: "2rem",
          border: "1px solid #d9d9d9",
          borderRadius: "0.25rem",
        }}
        placeholder={placeholder}
        required={true}
      />
    </div>
  );
});

const AcademicSessionCandidate = memo(({ formRefs, errors, touched }) => {
  const dispatch = useDispatch();
  const { values, setFieldValue } = useFormikContext();

  const { academicYears, loading: ayLoading } = useSelector(
    (state) => state.common.academicYear
  );
  const { classes, loading: classLoading } = useSelector(
    (state) => state.admin.class
  );

  useEffect(() => {
    dispatch(fetchAcademicYear());
    dispatch(fetchAllClasses());
  }, []);

  const academicYearOptions = useMemo(
    () =>
      academicYears?.map((ay) => ({
        label: ay.year,
        value: ay._id,
      })),
    [academicYears]
  );

  const classOptions = useMemo(
    () =>
      classes?.map((cls) => ({
        label: cls.className,
        value: cls._id,
      })),
    [classes]
  );

  const showThirdLang = useMemo(() => {
    const clsLabel =
      classOptions?.find((c) => c.value === values.academicSession.class)
        ?.label || "";
    const gradeNum = parseInt(clsLabel.replace(/\D/g, ""), 10);
    return gradeNum >= 3;
  }, [values.academicSession.class, classOptions]);

  useEffect(() => {
    if (values.candidateInformation?.dob) {
      const birthDate = new Date(values.candidateInformation.dob);
      if (!isNaN(birthDate)) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        setFieldValue("candidateInformation.age", age);
      }
    }
  }, [values.candidateInformation?.dob, setFieldValue]);
  const { userDetails } = useSelector((store) => store.common.user);
  const [VALUE_ED_OPTIONS, setVALUE_ED_OPTIONS] = useState([]);
  const [LANGUAGE_OPTIONS, setLANGUAGE_OPTIONS] = useState([]);
  useEffect(() => {
    dispatch(fetchAdmissionOptions(userDetails?.schoolId)).then((res) => {
      const { languages = [], valueEducation = [] } = res.payload?.data || {};

      if (languages?.length > 0) {
        let la = languages.map((i) => ({ label: i, value: i }));
        setLANGUAGE_OPTIONS(la);
      }
      if (valueEducation?.length > 0) {
        let va = valueEducation.map((i) => ({ label: i, value: i }));
        setVALUE_ED_OPTIONS(va);
      }
    });
  }, []);
  return (
    <div>
      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mb-0">
        Candidate Information
      </h2>
      <div className="p-3 flex gap-2 flex-wrap">
        <div className="w-1/4 flex flex-col gap-6">
          <ImageUploader
            height="h-64"
            name="profile"
            recommendedSize="300x400px"
            previewTitle="Student Picture Preview"
          />
          <div className="flex flex-col">
            <CompactIconDatePicker
              name="candidateInformation.dob"
              icon={<CalendarOutlined />}
              tooltip="Date of Birth"
              placeholder="DOB"
            />
          </div>
        </div>

        <div className="flex-1 min-w-[60%] flex flex-col">
          <div className="flex gap-3">
            <div className="flex-1">
              <CompactIconInput
                name="candidateInformation.firstName"
                icon={<UserOutlined />}
                tooltip="First Name"
                placeholder="First Name"
                ref={(el) =>
                  (formRefs.current["candidateInformation.firstName"] = el)
                }
                error={
                  touched.candidateInformation?.firstName &&
                  errors.candidateInformation?.firstName
                }
              />
            </div>
            <div className="flex-1">
              <CompactIconInput
                name="candidateInformation.middleName"
                icon={<UserOutlined />}
                tooltip="Middle Name"
                placeholder="Middle Name"
              />
            </div>
            <div className="flex-1">
              <CompactIconInput
                name="candidateInformation.lastName"
                icon={<UserOutlined />}
                tooltip="Last Name"
                placeholder="Last Name"
                ref={(el) =>
                  (formRefs.current["candidateInformation.lastName"] = el)
                }
                error={
                  touched.candidateInformation?.lastName &&
                  errors.candidateInformation?.lastName
                }
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <CompactIconInput
                name="candidateInformation.studentId"
                icon={<IdcardOutlined />}
                tooltip="Student ID"
                placeholder="Student ID"
                ref={(el) =>
                  (formRefs.current["candidateInformation.studentId"] = el)
                }
                error={
                  touched.candidateInformation?.studentId &&
                  errors.candidateInformation?.studentId
                }
              />
            </div>
            <div className="flex-1">
              <CompactIconDatePicker
                name="candidateInformation.idExpiry"
                icon={<CalendarOutlined />}
                tooltip="ID Expiry"
                placeholder="ID Expiry"
              />
            </div>
            <div className="flex-1">
              <CompactIconSelect
                name="candidateInformation.bloodGroup"
                icon={<HeartOutlined />}
                tooltip="Blood Group"
                placeholder="Select Blood Group"
                options={bloodGroupOptions}
                ref={(el) =>
                  (formRefs.current["candidateInformation.bloodGroup"] = el)
                }
                error={
                  touched.candidateInformation?.bloodGroup &&
                  errors.candidateInformation?.bloodGroup
                }
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <CompactIconSelect
                name="candidateInformation.gender"
                icon={<UserOutlined />}
                tooltip="Gender"
                placeholder="Gender"
                options={GENDER_OPTIONS}
                ref={(el) =>
                  (formRefs.current["candidateInformation.gender"] = el)
                }
                error={
                  touched.candidateInformation?.gender &&
                  errors.candidateInformation?.gender
                }
              />
            </div>
            <div className="flex-1">
              <CompactIconInput
                name="candidateInformation.passportNumber"
                icon={<IdcardOutlined />}
                tooltip="Passport Number"
                placeholder="Passport#"
              />
            </div>
            <div className="flex-1">
              <CompactIconDatePicker
                name="candidateInformation.passportExpiry"
                icon={<CalendarOutlined />}
                tooltip="Passport Expiry"
                placeholder="Passport Expiry"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <CompactIconSelect
                name="candidateInformation.placeOfBirth"
                icon={<GlobalOutlined />}
                tooltip="Place of Birth"
                placeholder="Place of Birth"
                options={COUNTRY_OPTIONS}
              />
            </div>
            <div className="flex-1">
              <CompactIconSelect
                name="candidateInformation.nationality"
                icon={<GlobalOutlined />}
                tooltip="Nationality"
                placeholder="Nationality"
                options={COUNTRY_OPTIONS}
                allowCustom
                ref={(el) =>
                  (formRefs.current["candidateInformation.nationality"] = el)
                }
                error={
                  touched.candidateInformation?.nationality &&
                  errors.candidateInformation?.nationality
                }
              />
            </div>
            <div className="flex-1">
              <CompactIconSelect
                name="candidateInformation.religion"
                icon={<GlobalOutlined />}
                tooltip="Religion"
                placeholder="Religion"
                allowCustom
                options={RELIGION_OPTIONS}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1" style={{ flex: 2 }}>
              <PhoneInputField
                name="candidateInformation.contactNumber"
                tooltip="Candidate Phone Number"
                placeholder="Phone"
              />
            </div>
            <div className="flex-1" style={{ flex: 2 }}>
              <CompactIconInput
                name="candidateInformation.email"
                icon={<MailOutlined />}
                tooltip="Candidate Email"
                placeholder="Email"
                ref={(el) =>
                  (formRefs.current["candidateInformation.email"] = el)
                }
                error={
                  touched.candidateInformation?.email &&
                  errors.candidateInformation?.email
                }
              />
            </div>
            <div className="flex-1" style={{ flex: 1 }}>
              <CompactIconInput
                name="candidateInformation.age"
                icon={<CalendarOutlined />}
                tooltip="Candidate Age"
                placeholder="Age"
                disabled={true}
                readOnly
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <PhoneInputField
                name="candidateInformation.emergencyNumber"
                tooltip="Emergency Number"
                placeholder="Emergency #"
                ref={(el) =>
                  (formRefs.current["candidateInformation.emergencyNumber"] =
                    el)
                }
                error={
                  touched.candidateInformation?.emergencyNumber &&
                  errors.candidateInformation?.emergencyNumber
                }
              />
            </div>
            <div className="flex-1">
              <CompactIconSelect
                name="candidateInformation.nativeLanguage"
                icon={<GlobalOutlined />}
                tooltip="Native Language"
                placeholder="Native Language"
                options={NATIVE_LANGUAGE_OPTIONS}
                allowCustom
              />
            </div>
            <div className="flex-1">
              <CompactIconSelect
                name="candidateInformation.primaryContact"
                icon={<UserOutlined />}
                tooltip="Primary Contact"
                placeholder="Primary Contact"
                options={PRIMARY_CONTACT_OPTIONS}
              />
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mb-0">
        Academic Session
      </h2>
      <div className="p-3">
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <CompactIconSelect
              name="academicSession.class"
              icon={<IdcardOutlined />}
              tooltip="Class"
              placeholder="Select Class"
              options={classOptions}
              loading={classLoading}
              ref={(el) => (formRefs.current["academicSession.class"] = el)}
              error={
                touched.academicSession?.class && errors.academicSession?.class
              }
            />
          </Col>
          <Col xs={24} md={8}>
            <CompactIconSelect
              name="academicSession.academicYear"
              icon={<CalendarOutlined />}
              tooltip="Academic Year"
              placeholder="Select Academic Year"
              options={academicYearOptions}
              loading={ayLoading}
              ref={(el) =>
                (formRefs.current["academicSession.academicYear"] = el)
              }
              error={
                touched.academicSession?.academicYear &&
                errors.academicSession?.academicYear
              }
            />
          </Col>
          <Col xs={24} md={8}>
            <CompactIconSelect
              name="academicSession.enrollmentStats"
              icon={<UserOutlined />}
              tooltip="Enrollment Status"
              placeholder="Select Enrollment Status"
              options={ENROLLMENT_STATUS_OPTIONS}
              ref={(el) =>
                (formRefs.current["academicSession.enrollmentStats"] = el)
              }
              error={
                touched.academicSession?.enrollmentStats &&
                errors.academicSession?.enrollmentStats
              }
            />
          </Col>
        </Row>
      </div>

      <LanguagePreferences showThirdLang={showThirdLang} formRefs={formRefs} />
    </div>
  );
});

export default AcademicSessionCandidate;
