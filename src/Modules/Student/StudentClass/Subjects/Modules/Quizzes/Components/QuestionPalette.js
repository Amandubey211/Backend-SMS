import React, { useState } from "react";
import { Avatar, Tooltip, Button, Modal } from "antd";
import { InfoCircleOutlined, StarFilled } from "@ant-design/icons";

const GRAD_FROM = "#C83B62";
const GRAD_TO = "#7F35CD";

/* dot colours ------------------------------------ */
const dot = {
  idle: "#d1d5db",
  current: "#f59e0b",
  answered: "#16a34a",
  review: GRAD_TO,
  "answered-review": "#15803d",
  "not-answered": "#ef4444",
};

export default function QuestionPalette({
  current,
  setCurrent,
  selectedOptions,
  itemDetails,
  instruction,
  lockNav,
  highContrast,
}) {
  const [instrVisible, setInstrVisible] = useState(false);

  /* status helper - fixed to handle both string and object formats */
  const status = (i) => {
    const s = selectedOptions[i];

    // Handle string format (legacy)
    if (typeof s === "string") {
      if (i === current) return "current";
      return s ? "answered" : "idle";
    }

    // Handle object format
    const marked = s?.flag === "review";
    const answered = !!s?.value;

    if (marked && answered) return "answered-review";
    if (marked) return "review";
    if (!answered && s) return "not-answered";
    if (answered) return "answered";
    if (i === current) return "current";
    return "idle";
  };

  /* text colour based on bg */
  const txt = (bg) => (bg === "#d1d5db" || bg === "#ffffff" ? "#000" : "#fff");

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 pb-3 flex justify-between items-center">
        <h3
          className={`font-semibold text-md ${
            highContrast ? "text-white" : ""
          }`}
        >
          All Questions
        </h3>
      </div>

      <div className="px-6 pb-6">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: "repeat(5,1fr)" }}
        >
          {itemDetails.questions.map((_, i) => {
            const s = status(i);
            const bg = dot[s];
            return (
              <Tooltip key={i} title={`Q${i + 1}`}>
                <Avatar
                  size={36}
                  style={{
                    background: bg,
                    color: txt(bg),
                    cursor: lockNav ? "not-allowed" : "pointer",
                    border:
                      s === "current"
                        ? `2px solid ${GRAD_TO}`
                        : s === "review"
                        ? `2px solid transparent`
                        : undefined,
                    boxShadow:
                      s === "review" ? `0 0 0 2px ${GRAD_TO}` : undefined,
                    opacity: lockNav ? 0.5 : 1,
                  }}
                  className="transition hover:scale-105"
                  onClick={() => !lockNav && setCurrent(i)}
                >
                  {i + 1}
                  {(s === "review" || s === "answered-review") && (
                    <StarFilled
                      style={{
                        fontSize: 7,
                        color: "#fff",
                        position: "absolute",
                        right: -4,
                        bottom: -4,
                      }}
                    />
                  )}
                </Avatar>
              </Tooltip>
            );
          })}
        </div>

        {/* legend */}
        <div
          className={`mt-8 space-y-2 text-xs leading-4 ${
            highContrast ? "text-white" : ""
          }`}
        >
          {Object.entries({
            idle: "Not visited",
            "not-answered": "Not answered",
            answered: "Answered",
            review: "Marked for review",
            "answered-review": "Answered + Marked",
            current: "Current question",
          }).map(([k, v]) => (
            <p key={k} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: dot[k] }}
              />
              {v}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-auto p-6">
        <Button
          type="link"
          icon={<InfoCircleOutlined />}
          onClick={() => setInstrVisible(true)}
          style={{ color: GRAD_FROM }}
        >
          Show Instructions
        </Button>
      </div>

      <Modal
        title="Quiz Instructions"
        open={instrVisible}
        footer={null}
        onCancel={() => setInstrVisible(false)}
        bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        <div
          className={`prose max-w-none ${highContrast ? "prose-invert" : ""}`}
          dangerouslySetInnerHTML={{ __html: instruction }}
        />
      </Modal>
    </div>
  );
}
