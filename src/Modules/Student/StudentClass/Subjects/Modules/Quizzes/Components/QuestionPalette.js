import React, { useState } from "react";
import { Avatar, Tooltip, Button, Modal } from "antd";
import { InfoCircleOutlined, StarFilled } from "@ant-design/icons";
import { Scrollbars } from "react-custom-scrollbars-2";

/* Brand gradient colours */
const GRAD_FROM = "#C83B62";
const GRAD_TO = "#7F35CD";

/* Status-to-color map
   ▸ answered         → green (easy to recognise ✅)
   ▸ not-answered     → red (alert)
   ▸ review           → purple (brand)
   ▸ answered-review  → darker green
   ▸ current          → amber
   ▸ idle             → light-grey
*/
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
}) {
  const [instrVisible, setInstrVisible] = useState(false);

  /* Determine palette state for each question index */
  const status = (i) => {
    const s = selectedOptions[i];
    const marked = s?.flag === "review";
    const answered = !!s?.value || typeof s === "string";

    if (marked && answered) return "answered-review";
    if (marked) return "review";
    if (!answered && s) return "not-answered";
    if (answered) return "answered";
    if (i === current) return "current";
    return "idle";
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="font-semibold text-lg p-6 pb-3">All Questions</h3>

      {/* Scrollable palette grid */}
      <Scrollbars autoHide>
        <div className="px-6 pb-6">
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
          >
            {itemDetails.questions.map((_, i) => {
              const s = status(i);
              return (
                <Tooltip key={i} title={`Q${i + 1}`}>
                  <Avatar
                    size={36}
                    style={{
                      background: dot[s],
                      cursor: "pointer",
                      color: "#fff",
                      border:
                        s === "current" ? `2px solid ${GRAD_TO}` : undefined,
                    }}
                    className="transition hover:scale-105"
                    onClick={() => setCurrent(i)}
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

          {/* Legend */}
          <div className="mt-8 space-y-2 text-xs leading-4">
            <Legend c={dot.idle} t="Not visited" />
            <Legend c={dot["not-answered"]} t="Not answered" />
            <Legend c={dot.answered} t="Answered" />
            <Legend c={dot.review} t="Marked for review" />
            <Legend c={dot["answered-review"]} t="Answered + Marked" />
            <Legend c={dot.current} t="Current question" />
          </div>
        </div>
      </Scrollbars>

      {/* “Show Instructions” button at bottom */}
      <div className="mt-auto p-6">
        <Button
          type="link"
          icon={<InfoCircleOutlined />}
          onClick={() => setInstrVisible(true)}
        >
          Show Instructions
        </Button>
      </div>

      {/* Modal for instructions (renders provided HTML) */}
      <Modal
        title="Quiz Instructions"
        visible={instrVisible}
        onCancel={() => setInstrVisible(false)}
        footer={[
          <Button key="close" onClick={() => setInstrVisible(false)}>
            Close
          </Button>,
        ]}
        bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: instruction }}
        />
      </Modal>
    </div>
  );
}

const Legend = ({ c, t }) => (
  <p className="flex items-center gap-2">
    <span
      className="inline-block w-3 h-3 rounded-full"
      style={{ background: c }}
    />
    {t}
  </p>
);
