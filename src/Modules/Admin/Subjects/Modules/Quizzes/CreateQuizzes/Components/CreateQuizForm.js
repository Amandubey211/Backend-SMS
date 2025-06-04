// Components/CreateQuizForm.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Modal, Button, Divider, Space } from "antd";
import { FiInfo, FiCheck } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import DateInput from "../../../../Component/DateInput";
import SectionSelect from "../../../../Component/SectionSelect";
import AssignToRadios from "../../../../Component/AssignToRadios";
import LabeledSelect from "./LabeledSelect";
import LabeledInput from "./LabeledInput";
import ResultsPublishInput from "../../../Assignments/CreateAssignment/Component/ResultsPublishInput";

import { fetchModules } from "../../../../../../../Store/Slices/Admin/Class/Module/moduleThunk";

/* ─────────────────────────────────────────────────────────── */
/* tiny wrapper – pulls boolean ↔ select value mapping */
const AllowedAttemptsSelect = ({ allowedAttempts, handleChange, error }) => {
  const { t } = useTranslation("quiz");

  const OPTIONS = [
    { value: "true", label: t("Limited") },
    { value: "false", label: t("Unlimited") },
  ];

  return (
    <LabeledSelect
      label={
        <>
          {t("Allowed Attempts")} <span className="text-red-500">*</span>
        </>
      }
      name="allowedAttempts"
      value={allowedAttempts ? "true" : "false"}
      onChange={(syntheticEvt) => {
        const val = syntheticEvt.target.value === "true";
        handleChange({ target: { name: "allowedAttempts", value: val } });
      }}
      options={OPTIONS}
      error={error}
      fieldId="allowedAttempts"
    />
  );
};

/* ─────────────────────────────────────────────────────────── */

const CreateQuizForm = ({
  /* controlled props */
  quizType,
  allowNumberOfAttempts,
  allowedAttempts,
  assignTo,
  timeLimit,
  sectionId = [],
  dueDate,
  availableFrom,
  startTime,
  endTime,
  handleChange,
  moduleId,
  groupId = [],
  formErrors = {},
  resultsPublished,
  resultsPublishDate,
}) => {
  const dispatch = useDispatch();
  const { modules } = useSelector((s) => s.admin.module);
  const [chapters, setChapters] = useState([]);
  const { cid, sid } = useParams();
  const { t } = useTranslation("admModule");

  /* guidelines modal */
  const [showGuide, setShowGuide] = useState(false);

  /* derived – is time-windowed? */
  const isTimed = useMemo(
    () => Boolean(startTime || endTime),
    [startTime, endTime]
  );

  /* fetch modules on mount */
  useEffect(() => {
    dispatch(fetchModules({ cid, sid }));
  }, [dispatch, cid, sid]);

  /* sync chapters */
  useEffect(() => {
    if (moduleId) {
      const m = modules.find((m) => m._id === moduleId);
      setChapters(m ? m.chapters : []);
    } else {
      setChapters([]);
    }
  }, [moduleId, modules]);

  /* enforce single attempt when timed */
  useEffect(() => {
    if (isTimed) {
      if (!allowedAttempts || allowNumberOfAttempts !== 1) {
        handleChange({ target: { name: "allowedAttempts", value: true } });
        handleChange({ target: { name: "allowNumberOfAttempts", value: 1 } });
      }
    }
  }, [isTimed, allowedAttempts, allowNumberOfAttempts, handleChange]);

  /* helpers */
  const formatDate = (d) => (d ? format(new Date(d), "yyyy-MM-dd") : "");
  const formatTime = (t) => t ?? "";

  /* ──────────────────────────────────────────────── */
  return (
    <div className="max-w-md mx-auto p-4 bg-white space-y-4 relative">
      {/* ── HEADER ─────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("Options")}</h2>
        <Button type="link" onClick={() => setShowGuide(true)}>
          <FiInfo className="inline mr-1" /> {t("Guidelines")}
        </Button>
      </div>

      {/* ── GROUP 1 • Basics ───────────────── */}
      <LabeledSelect
        label={
          <>
            {t("Quiz Type")} <span className="text-red-500">*</span>
          </>
        }
        name="quizType"
        value={quizType}
        onChange={handleChange}
        options={[
          { value: "Practice", label: t("Practice Quiz") },
          { value: "Graded", label: t("Graded Quiz") },
        ]}
        error={formErrors.quizType}
        fieldId="quizType"
      />

      <LabeledInput
        label={t("Time Limit in Minutes")}
        name="timeLimit"
        type="number"
        value={timeLimit}
        onChange={handleChange}
        error={formErrors.timeLimit}
        fieldId="timeLimit"
      />

      {/* ── GROUP 3 • Audience ──────────────── */}
      <AssignToRadios
        assignTo={assignTo}
        handleChange={handleChange}
        isAssignToLabel
      />
      {formErrors.assignTo && (
        <p id="assignTo" className="text-red-500 text-sm">
          {formErrors.assignTo}
        </p>
      )}

      <SectionSelect
        sectionValue={sectionId}
        groupValue={groupId}
        assignTo={assignTo}
        handleChange={handleChange}
        formErrors={formErrors}
        multiSelect
        fieldSection="sectionId"
        fieldGroup="groupId"
      />

      {/* ── GROUP 4 • Module ────────────────── */}
      <LabeledSelect
        label={t("Module")}
        name="moduleId"
        value={moduleId || ""}
        onChange={handleChange}
        options={[
          { value: "", label: t("Select") },
          ...modules.map((m) => ({ value: m._id, label: m.moduleName })),
        ]}
        error={formErrors.moduleId}
        fieldId="moduleId"
      />

      {/* ── GROUP 5 • Scheduling ────────────── */}
      <Space direction="vertical" size="middle" className="w-full">
        <DateInput
          label={
            <>
              {t("Available From")} <span className="text-red-500">*</span>
            </>
          }
          name="availableFrom"
          value={availableFrom}
          handleChange={handleChange}
          error={formErrors.availableFrom}
          fieldId="availableFrom"
        />
        <LabeledInput
          label={
            <>
              {t("Start Time")} <span className="text-red-500">*</span>
            </>
          }
          name="startTime"
          type="time"
          value={formatTime(startTime)}
          onChange={handleChange}
          error={formErrors.startTime}
          fieldId="startTime"
        />
        <DateInput
          label={
            <>
              {t("Due")} <span className="text-red-500">*</span>
            </>
          }
          name="dueDate"
          value={dueDate}
          handleChange={handleChange}
          error={formErrors.dueDate}
          fieldId="dueDate"
        />
        <LabeledInput
          label={
            <>
              {t("End Time")} <span className="text-red-500">*</span>
            </>
          }
          name="endTime"
          type="time"
          value={formatTime(endTime)}
          onChange={handleChange}
          error={formErrors.endTime}
          fieldId="endTime"
        />
      </Space>

      {/* ── GROUP 2 • Attempts ───────────────── */}
      {!isTimed && (
        <>
          <AllowedAttemptsSelect
            allowedAttempts={allowedAttempts}
            handleChange={handleChange}
            error={formErrors.allowedAttempts}
          />
          {allowedAttempts && (
            <LabeledInput
              label={t("Number of Attempts")}
              name="allowNumberOfAttempts"
              type="number"
              value={allowNumberOfAttempts || ""}
              onChange={handleChange}
              error={formErrors.allowNumberOfAttempts}
              fieldId="allowNumberOfAttempts"
            />
          )}
        </>
      )}

      {/* ── GROUP 6 • Results ───────────────── */}
      <ResultsPublishInput
        resultsPublished={resultsPublished}
        resultsPublishDate={resultsPublishDate}
        handleChange={handleChange}
        errorResultsPublishDate={formErrors.resultsPublishDate}
      />

      {/* ── Guidelines Modal ────────────────── */}
      <Modal
        open={showGuide}
        onCancel={() => setShowGuide(false)}
        footer={null}
        width={550}
        className="rounded-xl shadow-lg"
        maskStyle={{ backdropFilter: "blur(5px)" }}
      >
        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col p-6"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <FiInfo className="text-purple-600 text-4xl" />
                </div>
                <h2 className="text-purple-800 text-xl font-semibold">
                  {t("Quiz Creation Guidelines")}
                </h2>
              </div>
              <ul className="text-gray-700 pl-6 space-y-2 list-none">
                {[
                  "Use a descriptive title for the quiz.",
                  "Provide clear and concise instructions tailored for the quiz.",
                  "Ensure the Available From and Due Date settings are properly configured.",
                  "Set an appropriate time limit and review policy to maintain test integrity.",
                  "Fill all required fields before submission.",
                ].map((msg) => (
                  <li key={msg} className="flex items-center space-x-2">
                    <FiCheck className="text-green-500" />
                    <span>{t(msg)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-end mt-6">
                <Button onClick={() => setShowGuide(false)}>
                  {t("Close")}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </div>
  );
};

export default CreateQuizForm;
