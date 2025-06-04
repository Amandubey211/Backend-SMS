/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Layout,
  Button,
  Modal,
  Alert,
  Select,
  Tooltip,
  Input,
  Spin,
} from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  FlagOutlined,
  CheckOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  startQuiz,
  submitQuiz,
} from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizes.action";
import {
  setAttemptHistory,
  setQuizResults,
  setTimeLeft,
  setTotalTime,
  setSelectedOption,
} from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizesSlice";

import QuestionPalette from "../Components/QuestionPalette";

const { Header, Content, Sider } = Layout;
const { Option } = Select;

/* brand gradient */
const GRAD_FROM = "#C83B62";
const GRAD_TO = "#7F35CD";

/* ---------------- reusable UI bits ---------------- */
const BadgePill = ({ text }) => (
  <span className="inline-block rounded-lg border border-gray-300 px-3 py-[6px] text-xs font-medium text-gray-700 whitespace-nowrap">
    {text}
  </span>
);

const OptionCard = ({ label, text, active, onClick }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
    className={`relative border rounded-lg p-3 pl-12 cursor-pointer select-none transition
      ${
        active
          ? "ring-2 ring-offset-1 ring-[#C83B62]/40 border-transparent bg-gradient-to-r from-[#C83B62]/10 to-[#7F35CD]/10"
          : "hover:border-[#C83B62]"
      }`}
  >
    <span
      className={`absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold
        ${
          active
            ? "text-white bg-gradient-to-r from-[#C83B62] to-[#7F35CD]"
            : "bg-gray-200 text-gray-700"
        }`}
    >
      {label}
    </span>
    <Tooltip title={text.length > 90 ? text : ""}>
      <span>{text}</span>
    </Tooltip>
  </div>
);

/* mm:ss */
const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
    2,
    "0"
  )}`;

/* rectangle-style timer */
const RectTimer = ({ left, total }) => {
  const pct = Math.max(0, Math.min(100, (left / total) * 100));

  return (
    <div className="relative w-40 h-8 rounded-md border border-gray-300 overflow-hidden select-none">
      <div
        className="absolute inset-0"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${GRAD_FROM}, ${GRAD_TO})`,
          transition: "width 1s linear",
        }}
      />
      <span className="relative z-10 flex items-center justify-center h-full font-semibold text-white text-sm">
        {fmt(left)}
      </span>
    </div>
  );
};
/* -------------------------------------------------- */

export default function StudentTakeQuiz() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cid, sid, qid: quizId } = useParams();

  const {
    itemDetails,
    selectedOptions,
    timeLeft,
    totalTime,
    attemptHistory,
    loading,
  } = useSelector((s) => s.student.studentQuiz);

  /* shorthand */
  const questions = itemDetails.questions || [];

  /* local state */
  const [current, setCurrent] = useState(0);
  const [isFull, setIsFull] = useState(false);
  const [confirmSubmit, setSubmit] = useState(false);
  const [confirmBack, setBack] = useState(false);

  /* per-question timer */
  const [qTimeLeft, setQTimeLeft] = useState(null);
  const qTimerRef = useRef(null);
  const mainTimerRef = useRef(null);

  /* option labels for current question */
  const letters = useMemo(() => {
    if (!questions[current]) return [];
    return questions[current].type?.toLowerCase() === "true/false"
      ? ["T", "F"]
      : ["A", "B", "C", "D", "E", "F"].slice(
          0,
          questions[current].options?.length || 0
        );
  }, [questions, current]);

  /* ---------- kick-off & main timer ---------- */
  useEffect(() => {
    if (!quizId) return;

    dispatch(startQuiz({ quizId }))
      .unwrap()
      .then((r) => {
        dispatch(setTimeLeft(r.remainingTime * 60));
        dispatch(setTotalTime(itemDetails.timeLimit * 60));
      });

    mainTimerRef.current = setInterval(() => {
      dispatch((d, g) => {
        const t = g().student.studentQuiz.timeLeft;
        if (t <= 1) {
          clearInterval(mainTimerRef.current);
          handleSubmit();
        } else d(setTimeLeft(t - 1));
      });
    }, 1000);

    return () => clearInterval(mainTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- per-question timer ---------- */
  useEffect(() => {
    clearInterval(qTimerRef.current);

    const seconds = questions[current]?.seconds || 0;
    if (seconds > 0) {
      setQTimeLeft(seconds);
      qTimerRef.current = setInterval(() => {
        setQTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(qTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setQTimeLeft(null);
    }
    return () => clearInterval(qTimerRef.current);
  }, [current, questions]);

  /* ---------- submit ---------- */
  const handleSubmit = useCallback(async () => {
    clearInterval(mainTimerRef.current);
    clearInterval(qTimerRef.current);

    const payload = questions.map((q, i) => ({
      questionId: q._id,
      selectedOption: selectedOptions[i]?.value || selectedOptions[i],
      isCorrect:
        (selectedOptions[i]?.value || selectedOptions[i]) === q.correctAnswer,
    }));

    const res = await dispatch(
      submitQuiz({
        quizId,
        answers: payload,
        timeTaken: totalTime - timeLeft,
        attemptHistory,
      })
    ).unwrap();

    dispatch(setAttemptHistory([...attemptHistory, res.newAttempt]));
    dispatch(setQuizResults(res));
    navigate(`/student_class/${cid}/${sid}/quizzes/${quizId}/view`);
  }, [questions, selectedOptions, totalTime, timeLeft, attemptHistory]);

  /* ---------- fullscreen ---------- */
  const toggleFull = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFull(true);
    } else {
      await document.exitFullscreen();
      setIsFull(false);
    }
  };

  /* ---------- loader ---------- */
  if (loading || questions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  /* shorthand vars for current q */
  const q = questions[current];
  const qType = q.type.toLowerCase();
  const selVal = selectedOptions[current]?.value ?? selectedOptions[current];
  const done = Object.values(selectedOptions).filter(Boolean).length;
  const isLast = current === questions.length - 1;

  /* ---------- render ---------- */
  return (
    <Layout style={{ height: "100vh" }}>
      {/* ===== NAVBAR ===== */}
      <Header
        style={{
          background: "#fff",
          borderBottom: "1px solid #eee",
          height: 56,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: quiz name and badges */}
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold text-gray-800">
            {itemDetails.name}
          </span>
          <div className="mt-1 flex items-center gap-2">
            <BadgePill text={itemDetails.quizType} />
            {/* <BadgePill text={`Assigned to ${itemDetails.assignTo}`} /> */}
          </div>
        </div>

        {/* Right-side block: timer + end button */}
        <div className="flex items-center gap-4">
          <RectTimer left={timeLeft} total={totalTime} />

          <Button
            style={{
              background: `linear-gradient(90deg, ${GRAD_FROM}, ${GRAD_TO})`,
              border: "none",
              color: "#fff",
            }}
            onClick={() => setSubmit(true)}
          >
            End Test
          </Button>
        </div>
      </Header>

      {/* ===== 2-COLUMN ===== */}
      <Layout>
        {/* palette  */}
        <Sider
          width={260}
          style={{ background: "#fff", borderRight: "1px solid #eee" }}
        >
          <QuestionPalette
            current={current}
            setCurrent={setCurrent}
            selectedOptions={selectedOptions}
            itemDetails={{ questions }}
            instruction={itemDetails.content} // Assuming instruction HTML lives in itemDetails.content
          />
        </Sider>

        {/* question + answer */}
        <Content
          style={{
            background: "#fcfcfd",
            padding: 32,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* heading row */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-xl">Q.{current + 1}</h2>

            <div className="flex items-center gap-3">
              {q.seconds > 0 && <BadgePill text={`${qTimeLeft}s`} />}
              {qType === "multiple choice" && (
                <BadgePill text="Multiple choice" />
              )}
              {qType === "true/false" && <BadgePill text="True / False" />}
              {qType === "text" && <BadgePill text="Subjective" />}
              <BadgePill
                text={`${q.questionPoint} Mark${
                  q.questionPoint > 1 ? "s" : ""
                }`}
              />
            </div>
          </div>

          <div
            className="prose sm:prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: q.questionText }}
          />

          {/* answer area */}
          {qType === "multiple choice" || qType === "true/false" ? (
            <div className="flex flex-col gap-3 mb-12">
              {q.options.map((opt, idx) => (
                <OptionCard
                  key={opt._id}
                  label={letters[idx]}
                  text={opt.text}
                  active={selVal === opt.text}
                  onClick={() =>
                    dispatch(
                      setSelectedOption({ index: current, value: opt.text })
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <Input.TextArea
              rows={8}
              allowClear
              placeholder="Type your answer here…"
              value={selVal || ""}
              onChange={(e) =>
                dispatch(
                  setSelectedOption({ index: current, value: e.target.value })
                )
              }
              maxLength={500}
              showCount
              className="resize-none mb-12"
            />
          )}

          {/* nav footer */}
          <div className="mt-auto flex justify-between items-center pt-6 border-t">
            <Button
              icon={<ArrowLeftOutlined />}
              disabled={current === 0}
              onClick={() => setCurrent((c) => c - 1)}
            >
              Previous
            </Button>

            <div className="flex gap-3">
              <Button
                icon={<FlagOutlined />}
                style={{
                  color:
                    selectedOptions[current]?.flag === "review"
                      ? GRAD_TO
                      : undefined,
                  borderColor:
                    selectedOptions[current]?.flag === "review"
                      ? GRAD_TO
                      : undefined,
                }}
                onClick={() =>
                  dispatch(
                    setSelectedOption({
                      index: current,
                      value: selectedOptions[current],
                      flag:
                        selectedOptions[current]?.flag === "review"
                          ? undefined
                          : "review",
                    })
                  )
                }
              >
                {selectedOptions[current]?.flag === "review"
                  ? "Unmark"
                  : "Mark"}
              </Button>

              <Button
                icon={
                  isFull ? <FullscreenExitOutlined /> : <FullscreenOutlined />
                }
                onClick={toggleFull}
              />

              <Button
                type="primary"
                style={{
                  background: `linear-gradient(90deg, ${GRAD_FROM}, ${GRAD_TO})`,
                  border: "none",
                }}
                icon={isLast ? <CheckOutlined /> : <ArrowRightOutlined />}
                onClick={() => {
                  if (
                    itemDetails.lockQuestionAfterAnswering &&
                    !selectedOptions[current]
                  )
                    return;
                  if (isLast) setSubmit(true);
                  else setCurrent((c) => c + 1);
                }}
              >
                {isLast ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        </Content>
      </Layout>

      {/* ===== MODALS ===== */}
      <Modal
        title="Submit Quiz?"
        open={confirmSubmit}
        onOk={handleSubmit}
        onCancel={() => setSubmit(false)}
        okButtonProps={{
          style: {
            background: `linear-gradient(90deg, ${GRAD_FROM}, ${GRAD_TO})`,
            border: "none",
          },
        }}
      >
        {done < questions.length && (
          <Alert
            type="warning"
            showIcon
            message="You still have unanswered questions."
          />
        )}
      </Modal>

      <Modal
        title="Go back and end quiz?"
        open={confirmBack}
        okText="Yes, submit & exit"
        cancelText="Stay"
        okButtonProps={{
          style: {
            background: `linear-gradient(90deg, ${GRAD_FROM}, ${GRAD_TO})`,
            border: "none",
          },
        }}
        onOk={handleSubmit}
        onCancel={() => setBack(false)}
      >
        This will submit your attempt and exit the quiz.
      </Modal>
    </Layout>
  );
}
