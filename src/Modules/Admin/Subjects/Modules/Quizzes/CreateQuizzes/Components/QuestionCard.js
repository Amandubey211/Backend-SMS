// QuestionCard.jsx
import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaRegCircle } from "react-icons/fa";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { EyeOutlined } from "@ant-design/icons";
import { Tooltip, Modal, Button } from "antd";
import ProtectedAction from "../../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../../config/permission";

function shuffleArray(array) {
  let currentIndex = array?.length;
  let randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

const QuestionCard = ({
  question,
  deleteQuestion,
  editQuestion,
  allowShuffleAnswers,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const TRUNCATE_LENGTH = 80;
  const questionTextRaw = question.questionText || "";
  const isLongQuestion = questionTextRaw.length > TRUNCATE_LENGTH;
  const truncatedText = isLongQuestion
    ? questionTextRaw.substring(0, TRUNCATE_LENGTH) + "..."
    : questionTextRaw;

  useEffect(() => {
    if (allowShuffleAnswers) {
      // Shuffle a copy of the options so the original isn’t mutated
      setShuffledOptions(shuffleArray([...question.options]));
    } else {
      setShuffledOptions(question.options);
    }
  }, [question.options, allowShuffleAnswers]);

  const correctAnswer = question.correctAnswer;

  const handleOptionClick = (option) => {
    setSelectedOption(option.text);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Show confirmation modal before deletion
  const confirmDelete = () => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this question?",
      okText: "Yes",
      cancelText: "No",
      onOk() {
        deleteQuestion();
      },
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg flex flex-col h-full border">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 bg-pink-100 p-3 rounded">
        <div className="text-sm font-semibold">
          Question Point:{" "}
          <span className="text-black">{question.questionPoint}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Tooltip title="View Full Question">
            <Button
              type="text"
              icon={<EyeOutlined style={{ fontSize: 18 }} />}
              onClick={handleOpenModal}
            />
          </Tooltip>
          <ProtectedAction
            requiredPermission={PERMISSIONS.DELETE_QUESTION_FROM_QUIZ}
          >
            <FiEdit2
              className="text-green-600 cursor-pointer text-xl"
              onClick={editQuestion}
              title="Edit Question"
            />
          </ProtectedAction>
          <ProtectedAction
            requiredPermission={PERMISSIONS.DELETE_QUESTION_FROM_QUIZ}
          >
            <FiTrash2
              className="text-red-600 cursor-pointer text-xl"
              onClick={confirmDelete}
              title="Delete Question"
            />
          </ProtectedAction>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-2 flex-grow">
        {isLongQuestion ? (
          <Tooltip
            title={
              <div
                dangerouslySetInnerHTML={{ __html: questionTextRaw }}
                style={{ maxWidth: 300 }}
              />
            }
            placement="top"
          >
            <h2 className="text-lg font-semibold mb-3 line-clamp-2 cursor-pointer">
              <span dangerouslySetInnerHTML={{ __html: truncatedText }}></span>
            </h2>
          </Tooltip>
        ) : (
          <h2 className="text-lg font-semibold mb-3">
            <span dangerouslySetInnerHTML={{ __html: questionTextRaw }}></span>
          </h2>
        )}

        {question.type === "text" ? (
          <textarea
            rows="4"
            className="w-full p-2 border rounded bg-gray-50 resize-y"
            placeholder="Type your answer here..."
          />
        ) : (
          <div className="space-y-2 ms-4">
            {shuffledOptions?.map((option, index) => (
              <label
                key={index}
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => handleOptionClick(option)}
              >
                <div className="relative">
                  {selectedOption === option.text ? (
                    option.text === correctAnswer ? (
                      <FaCheckCircle className="text-green-600 h-4 w-4" />
                    ) : (
                      <FaTimesCircle className="text-red-600 h-4 w-4" />
                    )
                  ) : (
                    <FaRegCircle className="text-gray-600 h-4 w-4" />
                  )}
                </div>
                <span
                  className={
                    selectedOption === option.text
                      ? option.text === correctAnswer
                        ? "text-green-600"
                        : "text-red-600"
                      : ""
                  }
                >
                  {option.text}
                </span>
              </label>
            ))}
          </div>
        )}

        {selectedOption && (
          <div
            className={`mt-3 p-2 rounded-md ${
              selectedOption === correctAnswer
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {selectedOption === correctAnswer ? (
              <div className="flex items-center text-sm">
                <FaCheckCircle className="mr-2" />
                {question.correctAnswerComment || "Right Answer"}
              </div>
            ) : (
              <div className="flex items-center text-sm">
                <FaTimesCircle className="mr-2" />
                {question.inCorrectAnswerComment || "Wrong Answer"}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for full question preview */}
      <Modal
        title="Question Preview"
        visible={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
      >
        <div className="p-2">
          <h2 className="text-xl font-semibold mb-3">
            <span dangerouslySetInnerHTML={{ __html: questionTextRaw }} />
          </h2>
          <p className="text-gray-600 text-sm">
            Question Point: {question.questionPoint}
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default QuestionCard;
