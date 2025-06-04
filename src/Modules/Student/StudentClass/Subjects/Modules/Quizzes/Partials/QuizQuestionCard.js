// src/…/Partials/QuizQuestionCard.jsx
import React from "react";

export default function QuizQuestionCard({ question }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: question.questionText }}
      />

      {question.type === "illustration" && question.image && (
        <img
          src={question.image}
          alt="illustration"
          className="mx-auto max-h-80 object-contain"
        />
      )}
    </div>
  );
}
