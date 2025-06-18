// src/Modules/Student/StudentClass/Subjects/Quizzes/Components/QuestionForm.jsx
import React, { useState } from "react";
import { InputNumber, Select } from "antd";
import EditorComponent from "../../../../Component/AdminEditor";
import AnswerSection from "./AnswerSection";
import AddQuestionButton from "./AddQuestionButton";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const QuestionForm = ({
  /* ──────────────────── props from MainSection ──────────────────── */
  question,
  answers,
  questionPoint,
  questionType,
  rightAnswerComment,
  wrongAnswerComment,
  questionSeconds, //  NEW → controlled seconds value
  setQuestionSeconds, //  NEW → setter from parent
  handleQuestionChange,
  handleAnswerChange,
  setAnswers,
  setRightAnswerComment,
  setWrongAnswerComment,
  setQuestionPoint,
  setQuestionType,
  addNewQuestion,
}) => {
  const { t } = useTranslation("admModule");
  const [answerError, setAnswerError] = useState("");
  /* ─────────────────── validation & submit ─────────────────── */
  const handleAddQuestion = () => {
    if (
      ["multiple choice", "true/false"].includes(questionType) &&
      !answers.some((a) => a.isCorrect)
    ) {
      setAnswerError(t("Please select the correct answer."));
      return;
    }
    setAnswerError("");
    addNewQuestion();
  };

  /* ────────────────────────── UI ────────────────────────── */
  return (
    <div className="h-full pb-16 overflow-y-scroll">
      {/* Points • Seconds • Type */}
      <div className="flex flex-wrap gap-4 px-5 pt-3">
        {/* Points */}
        <div className="flex-1 min-w-[120px]">
          <label className="block text-sm font-medium text-gray-700">
            {t("This Question Point")}
          </label>
          <InputNumber
            size="large"
            id="questionPoint"
            className="mt-1 w-full"
            min={0}
            value={Number(questionPoint)}
            onChange={(val) => setQuestionPoint(val)}
          />
        </div>

        {/* Seconds (optional) */}
        <div className="flex-1 min-w-[120px]">
          <label className="block text-sm font-medium text-gray-700">
            {t("Seconds (optional)")}
          </label>
          <InputNumber
            id="questionSeconds"
            className="mt-1 w-full"
            size="large"
            min={0}
            value={questionSeconds}
            onChange={(val) => setQuestionSeconds(val)}
            placeholder="30"
          />
        </div>

        {/* Question Type */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-sm font-medium text-gray-700">
            {t("Question Type")}
          </label>
          <Select
            id="questionType"
            className="mt-1 w-full"
            size="large"
            value={questionType}
            onChange={setQuestionType}
          >
            <Option value="multiple choice">{t("Multiple Choice")}</Option>
            <Option value="true/false">{t("True/False")}</Option>
            <Option value="text">{t("Text")}</Option>
          </Select>
        </div>
      </div>

      {/* Editor */}
      <h2 className="text-gradient text-xl font-semibold px-5 pt-3">
        {t("Write Question")}
      </h2>
      <EditorComponent
        isCreateQuestion
        hideInput
        editorContent={question}
        onEditorChange={handleQuestionChange}
      />

      {/* Answer sections */}
      {questionType === "multiple choice" && (
        <AnswerSection
          answers={answers}
          setAnswers={setAnswers}
          handleAnswerChange={handleAnswerChange}
          rightAnswerComment={rightAnswerComment}
          setRightAnswerComment={setRightAnswerComment}
          wrongAnswerComment={wrongAnswerComment}
          setWrongAnswerComment={setWrongAnswerComment}
          error={answerError}
        />
      )}

      {questionType === "true/false" && (
        <div className="p-6 bg-white space-y-6">
          <h2 className="text-xl font-semibold">{t("Answer Section")}</h2>
          <div className="grid grid-cols-2 gap-4">
            {["True", "False"].map((val, idx) => (
              <div
                key={val}
                className="flex items-center space-x-2 border p-1 ps-3 rounded-md"
              >
                <div
                  className={`flex items-center justify-center h-6 w-6 rounded ${
                    answers[idx]?.isCorrect ? "bg-green-500" : "bg-gray-200"
                  } text-white cursor-pointer`}
                  onClick={() =>
                    setAnswers([
                      { text: t("True"), isCorrect: idx === 0 },
                      { text: t("False"), isCorrect: idx === 1 },
                    ])
                  }
                />
                <input
                  type="text"
                  value={t(val)}
                  readOnly
                  className="w-full p-2 border-none focus:ring-0"
                />
              </div>
            ))}
          </div>
          {answerError && (
            <p className="text-red-500 text-sm mt-2">{answerError}</p>
          )}
        </div>
      )}

      {questionType === "text" && (
        <div className="p-6 bg-white space-y-6">
          <h2 className="text-xl font-semibold">{t("Answer Section")}</h2>
          <p className="text-gray-500">
            {t("The student has to answer in the blank input")}
          </p>
        </div>
      )}

      <AddQuestionButton addNewQuestion={handleAddQuestion} />
    </div>
  );
};

export default QuestionForm;
