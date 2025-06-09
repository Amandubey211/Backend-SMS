/* src/Modules/Student/StudentClass/Subjects/Quizzes/StudentTakeQuiz.jsx */
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
  Spin,
  Tooltip,
  Input,
  Switch,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  FlagOutlined,
  CheckOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { SlCalculator } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import CalculatorDrawer from "../Components/CalculatorDrawer";

const { Header, Content, Sider } = Layout;
const GRAD_FROM = "#C83B62";
const GRAD_TO = "#7F35CD";

/* ───────────────────── helpers ───────────────────── */
const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
    2,
    "0"
  )}`;

const BadgePill = ({ text }) => (
  <span className="inline-block rounded-lg border border-gray-300 px-3 py-[6px] text-xs font-medium whitespace-nowrap">
    {text}
  </span>
);

const RectTimer = ({ left, total }) => {
  const pct = Math.max(0, Math.min(100, (left / total) * 100));
  return (
    <div className="relative w-40 h-8 rounded-md border overflow-hidden select-none">
      <div
        className="absolute inset-0 transition-all"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg,${GRAD_FROM},${GRAD_TO})`,
        }}
      />
      <span className="relative z-10 flex items-center justify-center h-full font-semibold text-white text-sm">
        {fmt(left)}
      </span>
    </div>
  );
};

/* generic dark button style for HC mode */
const hcBtn = {
  background: "#404045",
  color: "#fff",
  border: "1px solid #555",
};

/* ───────────────────── component ───────────────────── */
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
  const questions = itemDetails.questions || [];

  /* UI state */
  const [current, setCurrent] = useState(0);
  const [confirmSubmit, setSubmit] = useState(false);
  const [confirmBack, setBack] = useState(false);
  const [timesUp, setTimesUp] = useState(false);
  const [qTimeLeft, setQTimeLeft] = useState(null);
  const [locked, setLocked] = useState({}); // {index: true}
  const [isFull, setIsFull] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const mainTimerRef = useRef(null);
  const qTimerRef = useRef(null);

  /* letters for MCQ */
  const letters = useMemo(() => {
    if (!questions[current]) return [];
    return questions[current].type?.toLowerCase() === "true/false"
      ? ["T", "F"]
      : ["A", "B", "C", "D", "E", "F"].slice(
          0,
          questions[current].options?.length || 0
        );
  }, [questions, current]);

  /* whether this quiz contains ANY timed question */
  const hasTimedQuestions = useMemo(
    () => questions.some((q) => q.seconds > 0),
    [questions]
  );

  /* ───────── start + main timer ───────── */
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
    // eslint-disable-next-line
  }, []);

  /* ───────── per-question timer ───────── */
  useEffect(() => {
    clearInterval(qTimerRef.current);

    const seconds = questions[current]?.seconds || 0;

    if (seconds > 0 && !locked[current]) {
      setQTimeLeft(seconds);
      qTimerRef.current = setInterval(() => {
        setQTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(qTimerRef.current);
            setTimesUp(true);
            setLocked((l) => ({ ...l, [current]: true }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else setQTimeLeft(null);

    return () => clearInterval(qTimerRef.current);
  }, [current, questions, locked]);

  /* navigation lock rules */
  const selVal = selectedOptions[current]?.value ?? selectedOptions[current];
  const canNavigatePerTimer =
    (questions[current]?.seconds || 0) === 0 || qTimeLeft === 0 || !!selVal;
  const paletteNavLocked = hasTimedQuestions; // block palette if any timed question exists

  /* ───────── submit ───────── */
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
  }, [
    questions,
    selectedOptions,
    totalTime,
    timeLeft,
    attemptHistory,
    navigate,
    cid,
    sid,
    quizId,
    dispatch,
  ]);

  /* fullscreen toggle */
  const toggleFull = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFull(true);
    } else {
      await document.exitFullscreen();
      setIsFull(false);
    }
  };

  /* pick option (blocked if locked) */
  const pickOption = (value) => {
    if (locked[current]) {
      message.warning("Time is over for this question.");
      return;
    }
    dispatch(setSelectedOption({ index: current, value }));
  };

  /* loader */
  if (loading || questions.length === 0)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );

  /* derived stats & flags */
  const q = questions[current];
  const qType = q.type.toLowerCase();
  const total = questions.length;
  const attempted = Object.values(selectedOptions).filter((s) =>
    typeof s === "string" ? true : !!s?.value
  ).length;
  const markedCnt = Object.values(selectedOptions).filter(
    (s) => s?.flag === "review"
  ).length;
  const unanswered = total - attempted;
  const isLast = current === total - 1;

  /* ───────── render ───────── */
  return (
    <Layout
      className={highContrast ? "bg-[#404045] text-white" : ""}
      style={{ height: "100vh" }}
    >
      {/* NAVBAR */}
      <Header
        style={{
          background: highContrast ? "#404045" : "#fff",
          borderBottom: highContrast ? "1px solid #555" : "1px solid #eee",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: highContrast ? "#fff" : undefined,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gradient">
            {itemDetails.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Tooltip title="Toggle high-contrast">
            <Switch
              checked={highContrast}
              onChange={setHighContrast}
              checkedChildren={<EyeInvisibleOutlined />}
              unCheckedChildren={<EyeOutlined />}
              style={{ background: highContrast ? GRAD_TO : undefined }}
            />
          </Tooltip>

          <BadgePill text={itemDetails.quizType} />
          {qTimeLeft === null && (
            <RectTimer left={timeLeft} total={totalTime} />
          )}

          <Button
            style={{
              background: `linear-gradient(90deg,${GRAD_FROM},${GRAD_TO})`,
              border: "none",
              color: "#fff",
            }}
            onClick={() => setSubmit(true)}
          >
            End Test
          </Button>
        </div>
      </Header>

      {/* TWO-COLUMN LAYOUT */}
      <Layout>
        <Sider
          width={260}
          style={{
            background: highContrast ? "#404045" : "#fff",
            borderRight: highContrast ? "1px solid #555" : "1px solid #eee",
          }}
        >
          <QuestionPalette
            current={current}
            setCurrent={(i) => canNavigatePerTimer && setCurrent(i)}
            selectedOptions={selectedOptions}
            itemDetails={{ questions }}
            instruction={itemDetails.content}
            type={itemDetails.quizType}
            lockNav={paletteNavLocked}
            highContrast={highContrast}
          />
        </Sider>

        {/* MAIN CONTENT */}
        <Content
          style={{
            background: highContrast ? "#383840" : "#fcfcfd",
            padding: 32,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col flex-1"
            >
              {/* question header */}
              <div className="flex items-center justify-between mb-4">
                <h2
                  className={`font-semibold text-xl ${
                    highContrast ? "text-white" : "text-black"
                  }`}
                >
                  Q.{current + 1}
                </h2>
                <div
                  className={`flex items-center gap-3 ${
                    highContrast ? "text-white" : "text-black"
                  }`}
                >
                  {qTimeLeft !== null && <BadgePill text={`⏱ ${qTimeLeft}s`} />}
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

              {/* question text */}
              <div
                className={`prose max-w-none mb-8 ${
                  highContrast ? "text-white" : "text-black"
                }`}
                dangerouslySetInnerHTML={{ __html: q.questionText }}
              />

              {/* answer area */}
              {qType === "multiple choice" || qType === "true/false" ? (
                <div className="flex flex-col gap-3 mb-12">
                  {q.options.map((o, i) => {
                    const isSelected = selVal === o.text;
                    const isLocked = locked[current];

                    const bubble = isSelected
                      ? "text-white bg-gradient-to-r from-[#C83B62] to-[#7F35CD]"
                      : highContrast
                      ? "bg-[#505055] text-white"
                      : "bg-gray-200 text-gray-700";

                    const wrapper = isSelected
                      ? "ring-2 ring-offset-1 ring-[#C83B62]/40 border-transparent bg-gradient-to-r from-[#C83B62]/10 to-[#7F35CD]/10"
                      : highContrast
                      ? "border-gray-500 hover:border-gray-300 text-white"
                      : "hover:border-[#C83B62]";

                    const lockStyle = isLocked
                      ? "opacity-50 cursor-not-allowed"
                      : "";

                    return (
                      <div
                        key={o._id}
                        role="button"
                        tabIndex={0}
                        onClick={() => !isLocked && pickOption(o.text)}
                        onKeyDown={(e) =>
                          !isLocked && e.key === "Enter" && pickOption(o.text)
                        }
                        className={`relative border rounded-lg p-3 pl-12 select-none transition ${wrapper} ${lockStyle}`}
                      >
                        <span
                          className={`absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold ${bubble}`}
                        >
                          {letters[i]}
                        </span>
                        <Tooltip title={o.text.length > 90 ? o.text : ""}>
                          <span className={highContrast ? "text-white" : ""}>
                            {o.text}
                          </span>
                        </Tooltip>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Input.TextArea
                  rows={8}
                  allowClear={!locked[current]}
                  readOnly={locked[current]}
                  placeholder={
                    locked[current]
                      ? "Time over – answer locked"
                      : "Type your answer here…"
                  }
                  value={selVal || ""}
                  onChange={(e) =>
                    !locked[current] && pickOption(e.target.value)
                  }
                  maxLength={500}
                  showCount
                  className="resize-none mb-12"
                />
              )}

              {/* FOOTER NAV */}
              <div className="mt-auto flex justify-between items-center pt-6 border-t">
                <Button
                  icon={<ArrowLeftOutlined />}
                  disabled={!canNavigatePerTimer || current === 0}
                  onClick={() => setCurrent((c) => c - 1)}
                  style={highContrast ? hcBtn : undefined}
                >
                  Previous
                </Button>

                <div className="flex gap-3 items-center">
                  {/* flag */}
                  <Button
                    icon={<FlagOutlined />}
                    style={{
                      ...(highContrast ? hcBtn : {}),
                      color:
                        selectedOptions[current]?.flag === "review"
                          ? GRAD_TO
                          : highContrast
                          ? "#fff"
                          : undefined,
                      borderColor:
                        selectedOptions[current]?.flag === "review"
                          ? GRAD_TO
                          : highContrast
                          ? "#555"
                          : undefined,
                    }}
                    disabled={locked[current]} // no marking after lock
                    onClick={() => {
                      const cur = selectedOptions[current] || {};
                      const value = typeof cur === "string" ? cur : cur.value;

                      dispatch(
                        setSelectedOption({
                          index: current,
                          value,
                          flag: cur.flag === "review" ? undefined : "review",
                        })
                      );
                    }}
                  >
                    {selectedOptions[current]?.flag === "review"
                      ? "Unmark"
                      : "Mark"}
                  </Button>

                  <Tooltip title="Calculator">
                    <Button
                      icon={<SlCalculator />}
                      onClick={() => setShowCalc(true)}
                      style={highContrast ? hcBtn : undefined}
                    />
                  </Tooltip>

                  <Button
                    icon={
                      isFull ? (
                        <FullscreenExitOutlined />
                      ) : (
                        <FullscreenOutlined />
                      )
                    }
                    onClick={toggleFull}
                    style={highContrast ? hcBtn : undefined}
                  />

                  <Button
                    type="primary"
                    style={{
                      background: `linear-gradient(90deg,${GRAD_FROM},${GRAD_TO})`,
                      border: "none",
                    }}
                    icon={isLast ? <CheckOutlined /> : <ArrowRightOutlined />}
                    disabled={!canNavigatePerTimer}
                    onClick={() => {
                      if (isLast) setSubmit(true);
                      else setCurrent((c) => c + 1);
                    }}
                  >
                    {isLast ? "Finish" : "Next"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </Content>
      </Layout>

      {/*  MODALS  */}
      <Modal
        title="Submit Quiz?"
        open={confirmSubmit}
        onOk={handleSubmit}
        onCancel={() => setSubmit(false)}
        okButtonProps={{
          style: {
            background: `linear-gradient(90deg,${GRAD_FROM},${GRAD_TO})`,
            border: "none",
          },
        }}
      >
        <p>
          Total questions: <strong>{total}</strong>
        </p>
        <p>
          Attempted: <strong>{attempted}</strong>
        </p>
        <p>
          Marked for review: <strong>{markedCnt}</strong>
        </p>
        <p>
          Unanswered: <strong>{unanswered}</strong>
        </p>

        {unanswered > 0 && (
          <Alert
            type="warning"
            showIcon
            message="You still have unanswered questions."
            className="mt-4"
          />
        )}
      </Modal>

      <Modal
        title="Time's up!"
        open={timesUp}
        footer={null}
        onCancel={() => setTimesUp(false)}
      >
        Time for this question has expired. You can proceed but cannot modify
        this answer.
      </Modal>

      <Modal
        title="Go back and end quiz?"
        open={confirmBack}
        okText="Yes, submit & exit"
        cancelText="Stay"
        okButtonProps={{
          style: {
            background: `linear-gradient(90deg,${GRAD_FROM},${GRAD_TO})`,
            border: "none",
          },
        }}
        onOk={handleSubmit}
        onCancel={() => setBack(false)}
      >
        This will submit your attempt and exit the quiz.
      </Modal>

      <CalculatorDrawer open={showCalc} onClose={() => setShowCalc(false)} />
    </Layout>
  );
}
