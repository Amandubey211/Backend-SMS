import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextInput from "./TextInput";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import { useTranslation } from 'react-i18next';

const AdmissionInfo = ({
  studentInfo,
  handleInputChange,
  errors,
  inputRefs,
}) => {
  const { t } = useTranslation('admAdmission');
  const classList = useSelector((store) => store.admin.class.classes);
  const dispatch = useDispatch();

  useEffect(() => {
    if (classList.length === 0) {
      dispatch(fetchAllClasses());
    }
  }, [dispatch, classList.length]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">{t("Admission to Class")}</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">{t("Applying For")}</label>
          <select
            name="applyingClass"
            className={`mt-1 p-2 block w-full rounded-md border ${
              errors.applyingClass ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
            value={studentInfo.applyingClass || ""}
            onChange={handleInputChange}
            aria-invalid={errors.applyingClass ? "true" : "false"}
            ref={inputRefs.applyingClass}
          >
            <option value="">{t("Choose Options")}</option>
            {classList?.map((classItem, index) => (
              <option key={index} value={classItem?._id}>
                {classItem.className}
              </option>
            ))}
          </select>
          {errors.applyingClass && (
            <span className="text-red-500 text-sm mt-1">
              {errors.applyingClass}
            </span>
          )}
        </div>

        <div>
          <label className="block text-gray-700">{t("Transport Requirement")}</label>
          <select
            name="transportRequirement"
            className={`mt-1 p-2 block w-full rounded-md border ${
              errors.transportRequirement ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
            value={studentInfo.transportRequirement || ""}
            onChange={handleInputChange}
            aria-invalid={errors.transportRequirement ? "true" : "false"}
            ref={inputRefs.transportRequirement}
          >
            <option value="">{t("Choose Options")}</option>
            <option value={true}>{t("YES")}</option>
            <option value={false}>{t("NO")}</option>
          </select>
          {errors.transportRequirement && (
            <span className="text-red-500 text-sm mt-1">
              {errors.transportRequirement}
            </span>
          )}
        </div>

        <div>
          <label className="block text-gray-700">{t("Enrollment Status")}</label>
          <select
            name="enrollmentStatus"
            value={studentInfo.enrollmentStatus || ""}
            onChange={handleInputChange}
            className={`mt-1 p-2 block w-full rounded-md border ${
              errors.enrollmentStatus ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
            aria-invalid={errors.enrollmentStatus ? "true" : "false"}
            ref={inputRefs.enrollmentStatus}
          >
            <option value="" disabled>
              {t("Select")}
            </option>
            <option value="Full Time">{t("Full Time")}</option>
            <option value="Part Time">{t("Part Time")}</option>
          </select>
          {errors.enrollmentStatus && (
            <span className="text-red-500 text-sm mt-1">
              {errors.enrollmentStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmissionInfo;
