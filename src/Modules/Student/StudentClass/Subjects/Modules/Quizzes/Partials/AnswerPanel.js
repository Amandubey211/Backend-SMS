// src/…/Partials/AnswerPanel.jsx
import React, { useState } from "react";
import { Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedOptions } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizesSlice";

const { TextArea } = Input;
const { Dragger } = Upload;

export default function AnswerPanel({ qIdx, onSubmit }) {
  const dispatch = useDispatch();
  const { itemDetails, selectedOptions } = useSelector(
    (s) => s.student.studentQuiz
  );
  const question = itemDetails.questions[qIdx];
  const [local, setLocal] = useState(selectedOptions[qIdx] || "");

  const save = () => {
    if (!local && question.type !== "text") {
      return message.warning("Select an option first.");
    }
    dispatch(setSelectedOptions({ index: qIdx, option: local }));
    onSubmit(qIdx);
    message.success("Answer saved.");
  };

  return (
    <div className="bg-white border border-purple-300 rounded-lg p-6 space-y-6">
      <label className="font-medium text-sm text-gray-600">Your Answer</label>

      {question.type === "text" ? (
        <TextArea
          rows={5}
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          placeholder="Write answer here"
          allowClear
        />
      ) : (
        <div className="space-y-3">
          {question.options.map((opt) => (
            <label
              key={opt._id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name={`q-${qIdx}`}
                value={opt.text}
                checked={local === opt.text}
                onChange={() => setLocal(opt.text)}
              />
              {opt.text}
            </label>
          ))}
        </div>
      )}

      {/* optional upload */}
      <div>
        <label className="font-medium text-sm text-gray-600 mb-2 block">
          Upload Solution (Optional)
        </label>
        <Dragger
          maxCount={1}
          beforeUpload={() => false}
          style={{ borderColor: "#bb86fc" }}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p>Max file size 10 MB</p>
        </Dragger>
      </div>

      <Button type="primary" block onClick={save}>
        Save Answer
      </Button>
    </div>
  );
}
