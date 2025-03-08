// CreateQuizForm.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DateInput from "../../../../Component/DateInput";
import SectionSelect from "../../../../Component/SectionSelect";
import AssignToRadios from "../../../../Component/AssignToRadios";
import LabeledSelect from "./LabeledSelect";
import LabeledInput from "./LabeledInput";
import { useParams } from "react-router-dom";
import { fetchModules } from "../../../../../../../Store/Slices/Admin/Class/Module/moduleThunk";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Modal, Button } from "antd";
import { FiInfo, FiCheck } from "react-icons/fi";
import ResultsPublishInput from "../../../Assignments/CreateAssignment/Component/ResultsPublishInput";

const AllowedAttemptsSelect = ({ allowedAttempts, handleChange, error }) => {
  const { t } = useTranslation("quiz");
  return (
    <div className="mb-4">
      <label htmlFor="allowedAttempts" className="block text-gray-700">
        {t("Allowed Attempts")} <span className="text-red-500">*</span>
      </label>
      <select
        id="allowedAttempts"
        name="allowedAttempts"
        value={allowedAttempts ? "true" : "false"}
        onChange={(e) =>
          handleChange({
            target: {
              name: "allowedAttempts",
              value: e.target.value === "true",
            },
          })
        }
        className={`w-full p-3 border rounded-md shadow-sm focus:outline-none ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      >
        <option value="">{t("Select")}</option>
        <option value="true">{t("Limited")}</option>
        <option value="false">{t("Unlimited")}</option>
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

const CreateQuizForm = ({
  quizType,
  allowShuffleAnswers,
  lockQuestionAfterAnswering,
  allowNumberOfAttempts,
  showOneQuestionOnly,
  allowedAttempts,
  assignTo,
  timeLimit,
  sectionId = [],
  dueDate,
  availableFrom,
  handleChange,
  studentSeeAnswer,
  showAnswerDate,
  moduleId,
  chapterId,
  groupId = [],
  formErrors = {},
  // New fields from formState
  resultsPublished,
  resultsPublishDate,
}) => {
  const dispatch = useDispatch();
  const [chapters, setChapters] = useState([]);
  const { modules } = useSelector((state) => state.admin.module);
  const { cid, sid } = useParams();
  const { t } = useTranslation("admModule");

  // State for guidelines modal
  const [showGuidelines, setShowGuidelines] = useState(false);

  useEffect(() => {
    dispatch(fetchModules({ cid, sid }));
  }, [dispatch, cid, sid]);

  useEffect(() => {
    if (moduleId) {
      const selectedModule = modules.find((mod) => mod._id === moduleId);
      setChapters(selectedModule ? selectedModule.chapters : []);
    } else {
      setChapters([]);
    }
  }, [moduleId, modules]);

  const formatDate = (date) =>
    date ? format(new Date(date), "yyyy-MM-dd") : "";

  return (
    <div className="max-w-md mx-auto p-4 bg-white space-y-2 relative">
      {/* Heading + Guidelines Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t("Options")}</h2>
        <button
          onClick={() => setShowGuidelines(true)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
        >
          <FiInfo className="w-5 h-5" />
          <span>{t("Guidelines")}</span>
        </button>
      </div>

      {/* Quiz Type */}
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
          { value: "", label: t("Select") },
          { value: "Practice", label: t("Practice Quiz") },
          { value: "Graded", label: t("Graded Quiz") },
        ]}
        error={formErrors.quizType}
        fieldId="quizType"
      />

      <div className="p-2">
        <h3 className="text-gray-700">{t("Shuffle Answers")}</h3>
        <div className="flex items-center mt-1">
          <input
            type="radio"
            id="allowShuffleAnswersYes"
            name="allowShuffleAnswers"
            value="true"
            checked={allowShuffleAnswers === true}
            onChange={() =>
              handleChange({
                target: { name: "allowShuffleAnswers", value: true },
              })
            }
            className="mr-2"
          />
          <label htmlFor="allowShuffleAnswersYes" className="mr-4">
            {t("Yes")}
          </label>
          <input
            type="radio"
            id="allowShuffleAnswersNo"
            name="allowShuffleAnswers"
            value="false"
            checked={allowShuffleAnswers === false}
            onChange={() =>
              handleChange({
                target: { name: "allowShuffleAnswers", value: false },
              })
            }
            className="mr-2"
          />
          <label htmlFor="allowShuffleAnswersNo">{t("No")}</label>
        </div>
      </div>

      <LabeledInput
        label={t("Time Limit in Minutes")}
        name="timeLimit"
        value={timeLimit}
        onChange={handleChange}
        error={formErrors.timeLimit}
        fieldId="timeLimit"
      />

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

      <h2 className="text-xl font-semibold mt-6 pt-4 border-t">
        {t("Quiz Restrictions")}
      </h2>

      <div className="p-2">
        <h3 className="text-gray-700 mb-1">
          {t("Students See the Correct Answer")}
        </h3>
        <div className="flex items-center mb-2">
          <input
            type="radio"
            id="studentSeeAnswerYes"
            name="studentSeeAnswer"
            value="true"
            checked={studentSeeAnswer === true || studentSeeAnswer === "true"}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="studentSeeAnswerYes" className="mr-4">
            {t("Yes")}
          </label>
          <input
            type="radio"
            id="studentSeeAnswerNo"
            name="studentSeeAnswer"
            value="false"
            checked={studentSeeAnswer === false || studentSeeAnswer === "false"}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="studentSeeAnswerNo">{t("No")}</label>
        </div>
        {(studentSeeAnswer === true || studentSeeAnswer === "true") && (
          <DateInput
            label={t("Select Date")}
            name="showAnswerDate"
            value={formatDate(showAnswerDate)}
            handleChange={handleChange}
            error={formErrors.showAnswerDate}
            fieldId="showAnswerDate"
          />
        )}
      </div>

      <LabeledSelect
        label={t("Show One Question at a Time")}
        name="showOneQuestionOnly"
        value={showOneQuestionOnly}
        onChange={handleChange}
        options={[
          { value: "true", label: t("Yes") },
          { value: "false", label: t("No") },
        ]}
        error={formErrors.showOneQuestionOnly}
        fieldId="showOneQuestionOnly"
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="lockQuestionAfterAnswering"
          name="lockQuestionAfterAnswering"
          checked={lockQuestionAfterAnswering}
          onChange={handleChange}
          className="mr-2 p-3"
        />
        <label htmlFor="lockQuestionAfterAnswering" className="text-gray-700">
          {t("Lock Questions After Answering")}
        </label>
      </div>

      <AssignToRadios
        assignTo={assignTo}
        handleChange={handleChange}
        isAssignToLabel
      />
      {formErrors.assignTo && (
        <p id="assignTo" className="text-red-500 text-sm mt-1">
          {formErrors.assignTo}
        </p>
      )}

      <SectionSelect
        sectionValue={sectionId}
        groupValue={groupId}
        assignTo={assignTo}
        handleChange={handleChange}
        formErrors={formErrors}
        multiSelect={true}
        fieldSection="sectionId"
        fieldGroup="groupId"
      />

      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="moduleId">
          {t("Module")}
        </label>
        <select
          id="moduleId"
          className={`mt-1 block w-full pl-3 pr-10 border py-2 text-base focus:outline-none sm:text-sm rounded-md ${
            formErrors.moduleId
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          value={moduleId || ""}
          name="moduleId"
          onChange={handleChange}
        >
          <option value="">{t("Select")}</option>
          {modules?.map((mod) => (
            <option key={mod._id} value={mod._id}>
              {mod.moduleName}
            </option>
          ))}
        </select>
        {formErrors.moduleId && (
          <p className="text-red-500 text-sm mt-1">{formErrors.moduleId}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="chapterId">
          {t("Chapter")}
        </label>
        <select
          id="chapterId"
          className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border focus:outline-none sm:text-sm rounded-md ${
            formErrors.chapterId
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          value={chapterId || ""}
          name="chapterId"
          onChange={handleChange}
          disabled={!moduleId}
        >
          {moduleId ? (
            <>
              <option value="">{t("Select")}</option>
              {chapters?.map((ch) => (
                <option key={ch._id} value={ch._id}>
                  {ch.name}
                </option>
              ))}
            </>
          ) : (
            <option value="">{t("Select Module First")}</option>
          )}
        </select>
        {formErrors.chapterId && (
          <p className="text-red-500 text-sm mt-1">{formErrors.chapterId}</p>
        )}
      </div>

      <DateInput
        label={
          <>
            {t("Available From")} <span className="text-red-500">*</span>
          </>
        }
        name="availableFrom"
        value={formatDate(availableFrom)}
        handleChange={handleChange}
        error={formErrors.availableFrom}
        fieldId="availableFrom"
      />

      <DateInput
        label={
          <>
            {t("Due")} <span className="text-red-500">*</span>
          </>
        }
        name="dueDate"
        value={formatDate(dueDate)}
        handleChange={handleChange}
        error={formErrors.dueDate}
        fieldId="dueDate"
      />

      {/* New Results Publish Fields */}
      <ResultsPublishInput
        resultsPublished={resultsPublished}
        resultsPublishDate={resultsPublishDate}
        handleChange={handleChange}
        errorResultsPublishDate={formErrors.resultsPublishDate}
      />

      {/* Guidelines Modal */}
      <Modal
        visible={showGuidelines}
        onCancel={() => setShowGuidelines(false)}
        footer={null}
        width={550}
        className="rounded-xl shadow-lg"
        maskStyle={{ backdropFilter: "blur(5px)" }}
      >
        <AnimatePresence>
          {showGuidelines && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col p-6"
            >
              {/* Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <FiInfo className="text-purple-600 text-4xl" />
                </div>
                <h2 className="text-purple-800 text-xl font-semibold">
                  {t("Quiz Creation Guidelines")}
                </h2>
              </div>
              {/* Guidelines List */}
              <ul className="list-none text-gray-700 pl-6 space-y-2">
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>{t("Use a descriptive title for the quiz.")}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>
                    {t(
                      "Provide clear and concise instructions tailored for the quiz."
                    )}
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>
                    {t(
                      "Ensure the Available From and Due Date settings are properly configured."
                    )}
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>
                    {t(
                      "Set an appropriate time limit and review policy to maintain test integrity."
                    )}
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>
                    {t("Fill all required fields before submission.")}
                  </span>
                </li>
              </ul>
              {/* Footer */}
              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setShowGuidelines(false)}
                  className="border border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-all"
                >
                  {t("Close")}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
      {/* End Guidelines Modal */}
    </div>
  );
};

export default CreateQuizForm;
