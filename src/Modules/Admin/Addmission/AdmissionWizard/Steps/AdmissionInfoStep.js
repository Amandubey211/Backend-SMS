import React, { useEffect } from "react";
import { Select } from "antd";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllClasses } from "../../../../../Store/Slices/Admin/Class/actions/classThunk";

const { Option } = Select;

const AdmissionInfoStep = ({ stepRef }) => {
  const dispatch = useDispatch();
  const { values, errors, touched, setFieldValue } = useFormikContext();
  const classList = useSelector((store) => store.admin.class.classes || []);

  useEffect(() => {
    if (classList.length === 0) {
      dispatch(fetchAllClasses());
    }
  }, [dispatch, classList.length]);

  return (
    <div ref={stepRef}>
      <h3 className="text-xl font-semibold mb-4">Admission Info</h3>

      {/* Class */}
      <div className="my-2">
        <label className="block mb-1">Applying For Class</label>
        <Select
          style={{ width: "100%" }}
          value={values.applyingClass}
          onChange={(val) => setFieldValue("applyingClass", val)}
          status={touched.applyingClass && errors.applyingClass ? "error" : ""}
          placeholder="Select Class"
        >
          {classList.map((cls) => (
            <Option key={cls._id} value={cls._id}>
              {cls.className}
            </Option>
          ))}
        </Select>
        {touched.applyingClass && errors.applyingClass && (
          <div className="text-red-500 text-sm">{errors.applyingClass}</div>
        )}
      </div>

      {/* Enrollment Status */}
      <div className="my-2">
        <label className="block mb-1">Enrollment Status</label>
        <Select
          style={{ width: "100%" }}
          value={values.enrollmentStatus}
          onChange={(val) => setFieldValue("enrollmentStatus", val)}
          status={
            touched.enrollmentStatus && errors.enrollmentStatus ? "error" : ""
          }
          placeholder="Full Time / Part Time"
        >
          <Option value="Full Time">Full Time</Option>
          <Option value="Part Time">Part Time</Option>
        </Select>
        {touched.enrollmentStatus && errors.enrollmentStatus && (
          <div className="text-red-500 text-sm">{errors.enrollmentStatus}</div>
        )}
      </div>

      {/* Transport Requirement */}
      <div className="my-2">
        <label className="block mb-1">Transport Requirement</label>
        <Select
          style={{ width: "100%" }}
          value={values.transportRequirement}
          onChange={(val) => setFieldValue("transportRequirement", val)}
          placeholder="Yes / No"
        >
          <Option value={true}>Yes</Option>
          <Option value={false}>No</Option>
        </Select>
      </div>
    </div>
  );
};

export default AdmissionInfoStep;
