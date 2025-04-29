import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Checkbox, Radio, Input } from "antd";
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
import AsyncSelect from "react-select/async";
import { components } from "react-select";
import { HeartOutlined } from "@ant-design/icons"; // Import an appropriate icon
import CompactIconDatePicker from "../Components/CompactIconDatePicker";
import CompactIconInput from "../Components/CompactIconInput";
import CompactIconSelect from "../Components/CompactIconSelect";
import ImageUploader from "../Components/ImageUploader";
import { fetchAcademicYear } from "../../../../../Store/Slices/Common/AcademicYear/academicYear.action";
import { fetchAllClasses } from "../../../../../Store/Slices/Admin/Class/actions/classThunk";
import { useField } from "formik";
import {
  GENDER_OPTIONS,
  PLACE_OF_BIRTH_OPTIONS,
  NATIONALITY_OPTIONS,
  RELIGION_OPTIONS,
  NATIVE_LANGUAGE_OPTIONS,
  PRIMARY_CONTACT_OPTIONS,
  ENROLLMENT_STATUS_OPTIONS,
  bloodGroupOptions,
  YES_NO_OPTIONS,
} from "../Configs/selectOptionsConfig";
import { fetchAdmissionOptions } from "../../../../../Store/Slices/Common/User/actions/userActions";

export const PhoneInputField = ({ name, icon, tooltip, placeholder }) => {
  // Use useField to bind the component to the form state
  const [field, meta, helpers] = useField(name);
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
      />
    </div>
  );
};

// Searchable select component
const SearchableSelect = ({
  name,
  icon,
  tooltip,
  placeholder,
  loadOptions,
  defaultOptions,
  value,
  onChange,
}) => {
  const CustomControl = ({ children, ...props }) => (
    <components.Control {...props}>
      {icon && (
        <span className="mr-2 text-gray-400" title={tooltip}>
          {icon}
        </span>
      )}
      {children}
    </components.Control>
  );

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions={defaultOptions}
      loadOptions={loadOptions}
      value={value}
      onChange={onChange}
      components={{ Control: CustomControl }}
      placeholder={placeholder}
      className="react-select-container"
      classNamePrefix="react-select"
      styles={{
        control: (base) => ({
          ...base,
          minHeight: "32px",
          height: "32px",
        }),
        dropdownIndicator: (base) => ({
          ...base,
          padding: "4px",
        }),
        clearIndicator: (base) => ({
          ...base,
          padding: "4px",
        }),
        valueContainer: (base) => ({
          ...base,
          padding: "0px 8px",
        }),
        input: (base) => ({
          ...base,
          margin: "0px",
          paddingBottom: "0px",
          paddingTop: "0px",
        }),
      }}
    />
  );
};

// Nationality options (can be moved to a separate file)
const nationalityOptions = [
  { label: "Qatari", value: "qatari" },
  { label: "Egyptian", value: "egyptian" },
  { label: "Indian", value: "indian" },
  { label: "Pakistani", value: "pakistani" },
  { label: "Bangladeshi", value: "bangladeshi" },
  // Add more nationalities as needed
];

const loadNationalities = (inputValue) => {
  return Promise.resolve(
    nationalityOptions.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    )
  );
};

// Religion options
const religionOptions = [
  { label: "Islam", value: "islam" },
  { label: "Christianity", value: "christianity" },
  { label: "Hinduism", value: "hinduism" },
  { label: "Buddhism", value: "buddhism" },
  { label: "Judaism", value: "judaism" },
  { label: "Sikhism", value: "sikhism" },
  { label: "Shinto", value: "shinto" },
  { label: "Other", value: "other" },
];

const loadReligions = (inputValue) => {
  return Promise.resolve(
    religionOptions.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    )
  );
};

const AcademicSessionCandidate = () => {
  const dispatch = useDispatch();
  const { values, setFieldValue } = useFormikContext();

  // Subscribe to the Redux store for academic years and classes
  const { academicYears, loading: ayLoading } = useSelector(
    (state) => state.common.academicYear
  );
  const { classes, loading: classLoading } = useSelector(
    (state) => state.admin.class
  );

  // On mount, fetch the data
  useEffect(() => {
    dispatch(fetchAcademicYear());
    dispatch(fetchAllClasses());
  }, [dispatch]);

  // Build the options for academic year and class
  const academicYearOptions = useMemo(
    () =>
      academicYears.map((ay) => ({
        label: ay.year,
        value: ay._id,
      })),
    [academicYears]
  );

  const classOptions = useMemo(
    () =>
      classes.map((cls) => ({
        label: cls.className,
        value: cls._id,
      })),
    [classes]
  );
  /* ---------------- Show third language? ---------------- */
  const showThirdLang = useMemo(() => {
    const clsLabel =
      classOptions.find((c) => c.value === values.academicSession.class)
        ?.label || "";
    const gradeNum = parseInt(clsLabel.replace(/\D/g, ""), 10);
    return gradeNum >= 3;
  }, [values.academicSession.class, classOptions]);

  // Auto-calculate age from DOB
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
  const [VALUE_ED_OPTIONS,setVALUE_ED_OPTIONS] = useState([]);
  const [LANGUAGE_OPTIONS,setLANGUAGE_OPTIONS] = useState([]);
    useEffect(() => {
      dispatch(fetchAdmissionOptions(userDetails?.schoolId)).then((res) => {
        const { languages = [], valueEducation = [] } = res.payload?.data || {};

       if(languages?.length > 0 ){
       let la= languages.map((i)=>({label:i,value:i}));
        setLANGUAGE_OPTIONS(la)
       }
       if(valueEducation?.length > 0 ){
        let va =valueEducation.map((i)=>({label:i,value:i}));
        setVALUE_ED_OPTIONS(va)
       }
      })
    }, []);
  return (
    <div>
      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mb-0">
        Candidate Information
      </h2>
      <div className="p-3 flex gap-2 flex-wrap">
        {/* Left Column: Photo Upload & DOB */}
        <div className="w-1/4 flex flex-col gap-6">
          <ImageUploader
            height="h-64"
            name="attachments.mandatory.studentPicture"
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

        {/* Right Column: Candidate Basic Info */}
        <div className="flex-1 min-w-[60%] flex flex-col">
          {/* Row 1: Names */}
          <div className="flex gap-3">
            <div className="flex-1">
              <CompactIconInput
                name="candidateInformation.firstName"
                icon={<UserOutlined />}
                tooltip="First Name"
                placeholder="First Name"
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
              />
            </div>
          </div>

          {/* Row 2: Student ID, ID Expiry */}
          <div className="flex gap-3">
            <div className="flex-1">
              <CompactIconInput
                name="candidateInformation.studentId"
                icon={<IdcardOutlined />}
                tooltip="Student ID"
                placeholder="Student ID"
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
              />
            </div>
          </div>

          {/* Row 3: Gender, Passport */}
          <div className="flex gap-3">
            <div className="flex-1">
              <CompactIconSelect
                name="candidateInformation.gender"
                icon={<UserOutlined />}
                tooltip="Gender"
                placeholder="Gender"
                options={GENDER_OPTIONS}
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

          {/* Row 4: Place of Birth, Nationality, Religion */}
          <div className="flex gap-3">
            <div className="flex-1">
              <CompactIconSelect
                name="candidateInformation.placeOfBirth"
                icon={<GlobalOutlined />}
                tooltip="Place of Birth"
                placeholder="Place of Birth"
                options={PLACE_OF_BIRTH_OPTIONS}
              />
            </div>
            <div className="flex-1">
              <CompactIconSelect
                name="candidateInformation.nationality"
                icon={<GlobalOutlined />}
                tooltip="Nationality"
                placeholder="Nationality"
                options={[
                  { label: "Qatari", value: "qatari" },
                  { label: "Egyptian", value: "egyptian" },
                  { label: "Indian", value: "indian" },
                  { label: "Pakistani", value: "pakistani" },
                  { label: "Bangladeshi", value: "bangladeshi" },
                ]}
              />
            </div>
            <div className="flex-1">
              <CompactIconSelect
                name="candidateInformation.religion"
                icon={<GlobalOutlined />}
                tooltip="Religion"
                placeholder="Religion"
                options={religionOptions}
              />
            </div>
          </div>

          {/* Row 5: Phone, Email, Age */}
          <div className="flex gap-3">
            <div className="flex-1" style={{ flex: 2 }}>
              <PhoneInputField
                name="candidateInformation.phoneNumber"
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

          {/* Row 6: Emergency Number, Native Language, Primary Contact */}
          <div className="flex gap-3">
            <div className="flex-1">
              <PhoneInputField
                name="candidateInformation.emergencyNumber"
                tooltip="Emergency Number"
                placeholder="Emergency #"
              />
            </div>
            <div className="flex-1">
              <CompactIconSelect
                name="candidateInformation.nativeLanguage"
                icon={<GlobalOutlined />}
                tooltip="Native Language"
                placeholder="Native Language"
                options={NATIVE_LANGUAGE_OPTIONS}
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
            />
          </Col>
          <Col xs={24} md={8}>
            <CompactIconSelect
              name="academicSession.enrollmentStats"
              icon={<UserOutlined />}
              tooltip="Enrollment Status"
              placeholder="Select Enrollment Status"
              options={ENROLLMENT_STATUS_OPTIONS}
            />
          </Col>
        </Row>
      </div>

      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mb-0">
        Languages & Preferences
      </h2>

      <div className="p-3 flex flex-col gap-4">
        {/* Second language */}
        <div>
          <label className="font-semibold block mb-1">
            Second language preference
          </label>
          <Checkbox.Group
            options={LANGUAGE_OPTIONS}
            value={values.languagePrefs.second}
            onChange={(v) => setFieldValue("languagePrefs.second", v)}
          />
        </div>

        {/* Third language */}
        {showThirdLang && (
          <div>
            <label className="font-semibold block mb-1 text-red-500">
              Third language preference (Grade&nbsp;3+)
            </label>
            <Checkbox.Group
              options={LANGUAGE_OPTIONS}
              value={values.languagePrefs.third}
              onChange={(v) => setFieldValue("languagePrefs.third", v)}
            />
          </div>
        )}

        {/* Value education */}
        <div>
          <label className="font-semibold block mb-1">
            Value education preference
          </label>
          <Checkbox.Group
            options={VALUE_ED_OPTIONS}
            value={values.languagePrefs.valueEd}
            onChange={(e) =>
              setFieldValue("languagePrefs.valueEd", e)
            }
          />
        </div>

        {/* Left-handed */}
        <div>
          <label className="font-semibold block mb-1">Left-handed</label>
          <Radio.Group
            options={YES_NO_OPTIONS}
            optionType="button"
            value={values.languagePrefs.leftHanded}
            onChange={(e) =>
              setFieldValue("languagePrefs.leftHanded", e.target.value)
            }
          />
        </div>

        {/* Medical information */}
        <div>
          <label className="font-semibold block mb-1">
            Medical information (Allergies/Ailments)
          </label>
          <Input.TextArea
            rows={4}
            value={values.medicalInfo}
            onChange={(e) => setFieldValue("medicalInfo", e.target.value)}
            placeholder="Describe any condition the school should know…"
          />
        </div>
      </div>
    </div>
  );
};

export default AcademicSessionCandidate;
