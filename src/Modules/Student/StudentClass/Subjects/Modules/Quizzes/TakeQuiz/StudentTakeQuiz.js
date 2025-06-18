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
  notification,
  Skeleton,
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
  ExclamationCircleFilled,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { SlCalculator } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  startQuiz,
  submitQuiz,
  stdGetSingleQuiz,
} from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizes.action";
import {
  setAttemptHistory,
  setQuizResults,
  setTimeLeft,
  setTotalTime,
  setSelectedOption,
  resetQuizState,
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

const BadgePill = ({ text, warning = false }) => (
  <span
    className={`inline-block rounded-lg border px-3 py-[6px] text-xs font-medium whitespace-nowrap transition-all ${
      warning ? "border-red-500 text-red-500 animate-pulse" : "border-gray-300"
    }`}
  >
    {text}
  </span>
);

const RectTimer = ({ left, total }) => {
  const pct = Math.max(0, Math.min(100, (left / total) * 100));
  const isWarning = pct <= 20;

  return (
    <div className="relative w-40 h-8 rounded-md border overflow-hidden select-none transition-all">
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          width: `${pct}%`,
          background: isWarning
            ? `linear-gradient(90deg,#ff4d4f,#ff7875)`
            : `linear-gradient(90deg,${GRAD_FROM},${GRAD_TO})`,
        }}
      />
      <span
        className={`relative z-10 flex items-center justify-center h-full font-semibold text-sm transition-colors ${
          isWarning ? "text-red-100" : "text-white"
        }`}
      >
        {fmt(left)}
        {isWarning && (
          <ExclamationCircleFilled className="ml-2 animate-bounce" />
        )}
      </span>
    </div>
  );
};

const QuestionTimer = ({
  timeLeft = 0,
  totalTime = 1,
  highContrast = false,
}) => {
  const pct = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));
  const isWarning = pct <= 20;

  /* colour palette */
  const bgTrack = highContrast ? "#555" : "#e5e7eb"; // gray-300
  const bgFill = highContrast ? "#FFD700" : "#22c55e"; // green-500
  const bgWarning = highContrast ? "#ff4545" : "#ef4444"; // red-500
  const txtNormal = highContrast ? "#ffffff" : "#1f2937"; // gray-800
  const txtWarn = highContrast ? "#ff8080" : "#b91c1c"; // red-700

  return (
    <div className="flex items-center gap-3 w-44 select-none">
      {/* label */}
      <span
        className="text-sm font-medium"
        style={{ color: isWarning ? txtWarn : txtNormal }}
      >
        {timeLeft}s left
      </span>

      {/* track */}
      <div
        className="flex-1 h-4 rounded-md overflow-hidden border"
        style={{ background: bgTrack, borderColor: bgTrack }}
      >
        <motion.div
          key={pct} // re-animate on width change
          initial={{ width: `${pct}%` }}
          animate={{ width: `${pct}%` }}
          transition={{ ease: "linear", duration: 0.3 }}
          className={isWarning ? "animate-pulse" : ""}
          style={{
            height: "100%",
            background: isWarning ? bgWarning : bgFill,
          }}
        />
      </div>
    </div>
  );
};

/* glamified modal styles */
const modalStyles = {
  header: {
    background: `linear-gradient(135deg, ${GRAD_FROM}, ${GRAD_TO})`,
    color: "white",
    borderRadius: "8px 8px 0 0",
    padding: "16px 24px",
    borderBottom: "none",
  },
  body: {
    padding: "24px",
    fontSize: "16px",
    lineHeight: "1.6",
  },
  footer: {
    borderTop: "1px solid #f0f0f0",
    padding: "16px 24px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  },
  okButton: {
    background: `linear-gradient(135deg, ${GRAD_FROM}, ${GRAD_TO})`,
    border: "none",
    color: "white",
    fontWeight: "500",
    boxShadow: "0 2px 8px rgba(200, 59, 98, 0.2)",
  },
  cancelButton: {
    borderColor: "#d9d9d9",
    color: "#666",
    fontWeight: "500",
  },
};

/* generic dark button style for HC mode */
const hcBtn = {
  background: "#404045",
  color: "#fff",
  border: "1px solid #555",
};

/* Shimmer UI component */
const ShimmerUI = () => (
  <Layout className="h-screen">
    <Header
      style={{
        background: "#fff",
        borderBottom: "1px solid #eee",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Skeleton.Button active size="large" style={{ width: 200 }} />
      <div className="flex items-center gap-3">
        <Skeleton.Button active size="small" style={{ width: 100 }} />
        <Skeleton.Button active size="small" style={{ width: 150 }} />
        <Skeleton.Button active size="small" style={{ width: 100 }} />
      </div>
    </Header>
    <Layout>
      <Sider width={260} style={{ background: "#fff", padding: "16px" }}>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Sider>
      <Content style={{ padding: 32 }}>
        <div className="flex flex-col gap-6">
          <Skeleton active paragraph={{ rows: 2 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton.Input key={i} active block size="large" />
            ))}
          </div>
          <Skeleton active paragraph={{ rows: 1 }} />
        </div>
      </Content>
    </Layout>
  </Layout>
);

/* ───────────────────── component ───────────────────── */
export default function StudentTakeQuiz() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cid, sid, qid: quizId } = useParams();
  const [api, contextHolder] = notification.useNotification();

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
  const [warningShown, setWarningShown] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [isQuizEnded, setIsQuizEnded] = useState(false);
  const [isReloading, setIsReloading] = useState(true);

  const mainTimerRef = useRef(null);
  const qTimerRef = useRef(null);
  const fullscreenAttemptRef = useRef(0);
  const total = questions.length;
  const isLast = current === total - 1;
  /* Security: Prevent copy/paste and context menu */
  useEffect(() => {
    const handleCopy = (e) => {
      e.preventDefault();
      message.warning("Copying is disabled during the quiz");
      return false;
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCopy);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCopy);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  /* Security: Detect tab/window changes */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = violationCount + 1;
        setViolationCount(newCount);

        if (newCount >= 4) {
          // count for tab violation
          handleSubmit();
          message.error("Quiz submitted due to multiple tab changes");
        } else {
          message.warning(
            `Warning ${newCount}/4: Don't switch tabs during the quiz`
          );
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [violationCount]);

  /* Fullscreen enforcement */
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement && fullscreenAttemptRef.current < 3) {
          await document.documentElement.requestFullscreen();
          setIsFull(true);
          fullscreenAttemptRef.current = 0;
        }
      } catch (err) {
        fullscreenAttemptRef.current += 1;
        if (fullscreenAttemptRef.current < 3) {
          setTimeout(enterFullscreen, 1000);
        } else {
          message.error("Please enable fullscreen to continue with the quiz");
        }
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !isQuizEnded) {
        message.warning("Please return to fullscreen mode");
        enterFullscreen();
      }
    };

    // Initial fullscreen entry
    enterFullscreen();

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isQuizEnded]);

  /* Show warning notification when time is low */
  useEffect(() => {
    if (timeLeft / totalTime <= 0.2 && !warningShown) {
      api.warning({
        message: "Time Warning",
        description: "You have less than 20% of your total time remaining!",
        placement: "topRight",
        duration: 5,
      });
      setWarningShown(true);
    }
  }, [timeLeft, totalTime, warningShown, api]);

  /* Fetch quiz data on mount or reload */
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsReloading(true);
        await dispatch(stdGetSingleQuiz({ quizId })).unwrap();
        setIsReloading(false);
      } catch (error) {
        message.error("Failed to load quiz data");
        navigate(`/student_class/${cid}/${sid}/quizzes`);
      }
    };

    fetchQuiz();

    return () => {
      // Clean up timers when component unmounts
      clearInterval(mainTimerRef.current);
      clearInterval(qTimerRef.current);
    };
  }, [dispatch, quizId, navigate, cid, sid]);

  /* Start quiz timer when data is loaded */
  useEffect(() => {
    if (isReloading || !quizId || questions.length === 0) return;

    // Clear any existing timers
    clearInterval(mainTimerRef.current);

    // Start main timer
    dispatch(startQuiz({ quizId }))
      .unwrap()
      .then((r) => {
        dispatch(setTimeLeft(r.remainingTime * 60));
        dispatch(setTotalTime(itemDetails.timeLimit * 60));

        mainTimerRef.current = setInterval(() => {
          dispatch((d, g) => {
            const t = g().student.studentQuiz.timeLeft;
            if (t <= 1) {
              clearInterval(mainTimerRef.current);
              handleSubmit();
            } else d(setTimeLeft(t - 1));
          });
        }, 1000);
      });

    return () => clearInterval(mainTimerRef.current);
  }, [isReloading, quizId, questions, dispatch, itemDetails.timeLimit]);

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

  /* whether current question is timed */
  const isCurrentTimed = useMemo(
    () => questions[current]?.seconds > 0,
    [questions, current]
  );

  /* ───────── per-question timer ───────── */
  useEffect(() => {
    if (isReloading) return;

    clearInterval(qTimerRef.current);
    setWarningShown(false);

    const seconds = questions[current]?.seconds || 0;

    if (seconds > 0 && !locked[current]) {
      setQTimeLeft(seconds);
      qTimerRef.current = setInterval(() => {
        setQTimeLeft((prev) => {
          if (prev === Math.ceil(seconds * 0.2) && !warningShown) {
            api.warning({
              message: "Question Time Warning",
              description: `You have ${Math.ceil(
                seconds * 0.2
              )} seconds left for this question!`,
              placement: "topRight",
              duration: 3,
            });
            setWarningShown(true);
          }

          if (prev === 1) {
            clearInterval(qTimerRef.current);
            setTimesUp(true);
            setLocked((l) => ({ ...l, [current]: true }));
            api.warning({
              message: "Time Expired",
              description: "Time for this question has expired!",
              placement: "topRight",
              duration: 3,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else setQTimeLeft(null);

    return () => clearInterval(qTimerRef.current);
  }, [current, questions, locked, api, isReloading]);

  /* navigation lock rules */
  const selVal = selectedOptions[current]?.value ?? selectedOptions[current];
  const canNavigatePerTimer =
    (questions[current]?.seconds || 0) === 0 || qTimeLeft === 0 || !!selVal;
  const paletteNavLocked = hasTimedQuestions; // block palette if any timed question exists

  /* ───────── submit ───────── */
  const handleSubmit = useCallback(async () => {
    clearInterval(mainTimerRef.current);
    clearInterval(qTimerRef.current);
    setIsQuizEnded(true);

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
    dispatch(resetQuizState()); // Clear selected options after submission

    // Exit fullscreen after submission
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }

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
    if (!document.fullscreenElement && !isQuizEnded) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFull(true);
      } catch (err) {
        message.error("Fullscreen is required to continue the quiz");
      }
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

  /* mark/unmark question - fixed logic */
  const toggleMark = () => {
    const currentOption = selectedOptions[current];

    // If the option is a string (legacy format), convert it to object format
    if (typeof currentOption === "string") {
      dispatch(
        setSelectedOption({
          index: current,
          value: currentOption,
          flag: "review",
        })
      );
    }
    // If the option is an object but has no flag
    else if (currentOption && !currentOption.flag) {
      dispatch(
        setSelectedOption({
          ...currentOption,
          flag: "review",
        })
      );
    }
    // If the option is an object with flag, toggle it
    else if (currentOption && currentOption.flag) {
      const { flag, ...rest } = currentOption;
      dispatch(setSelectedOption(rest));
    }
    // If no option selected yet, create new with flag
    else {
      dispatch(
        setSelectedOption({
          index: current,
          flag: "review",
        })
      );
    }
  };

  /* check if current question is marked */
  const isMarked = useMemo(() => {
    const currentOption = selectedOptions[current];
    if (!currentOption) return false;
    if (typeof currentOption === "string") return false;
    return currentOption.flag === "review";
  }, [selectedOptions, current]);

  /* Force navigation when time is up */
  const handleTimeUpNavigation = useCallback(() => {
    if (isLast) {
      setSubmit(true);
    } else {
      setCurrent((c) => c + 1);
    }
    setTimesUp(false);
  }, [isLast]);

  /* loader */
  if (loading || isReloading || questions.length === 0) {
    return <ShimmerUI />;
  }

  /* derived stats & flags */
  const q = questions[current];
  const qType = q.type.toLowerCase();

  const attempted = Object.values(selectedOptions).filter((s) =>
    typeof s === "string" ? true : !!s?.value
  ).length;
  const markedCnt = Object.values(selectedOptions).filter(
    (s) => typeof s === "object" && s.flag === "review"
  ).length;
  const unanswered = total - attempted;

  /* glamified confirmation modal content */
  const submitModalContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <ClockCircleOutlined className="text-2xl text-[#7F35CD]" />
        <div>
          <h4 className="text-lg font-medium mb-1">Quiz Summary</h4>
          <p className="text-gray-600">Review your attempt before submitting</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Questions</p>
          <p className="text-xl font-semibold">{total}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Attempted</p>
          <p className="text-xl font-semibold text-green-600">{attempted}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Marked for Review</p>
          <p className="text-xl font-semibold text-purple-600">{markedCnt}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Unanswered</p>
          <p className="text-xl font-semibold text-red-600">{unanswered}</p>
        </div>
      </div>

      {unanswered > 0 && (
        <Alert
          type="warning"
          showIcon
          message="You still have unanswered questions."
          className="mt-4"
        />
      )}
    </div>
  );

  /* ───────── render ───────── */
  return (
    <Layout
      className={highContrast ? "bg-[#404045] text-white" : ""}
      style={{ height: "100vh" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {contextHolder}
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

          {/* Always show main timer */}
          <RectTimer left={timeLeft} total={totalTime} />

          <Button
            style={{
              background: `linear-gradient(135deg, ${GRAD_FROM}, ${GRAD_TO})`,
              border: "none",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(127, 53, 205, 0.2)",
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
            setCurrent={(i) => {
              // Allow navigation if:
              // 1. No time limit for current question OR
              // 2. Time is up for current question OR
              // 3. User has selected an answer
              const canNavigate =
                (questions[current]?.seconds || 0) === 0 ||
                qTimeLeft === 0 ||
                !!selectedOptions[current];

              if (canNavigate) {
                setCurrent(i);
              } else {
                message.warning(
                  "Please select an answer or wait for time to expire"
                );
              }
            }}
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
                  {/* Show question timer if applicable */}
                  {qTimeLeft !== null && (
                    <QuestionTimer
                      timeLeft={qTimeLeft}
                      totalTime={questions[current]?.seconds}
                      highContrast={highContrast}
                    />
                  )}

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
                className={`prose max-w-none mb-8 select-none ${
                  highContrast ? "text-white" : "text-black"
                }`}
                dangerouslySetInnerHTML={{ __html: q.questionText }}
                onCopy={(e) => {
                  e.preventDefault();
                  message.warning("Copying is disabled during the quiz");
                }}
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
                        onCopy={(e) => {
                          e.preventDefault();
                          message.warning(
                            "Copying is disabled during the quiz"
                          );
                        }}
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
                        {isLocked && (
                          <div className="absolute inset-0 bg-white bg-opacity-50"></div>
                        )}
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
                  onCopy={(e) => {
                    e.preventDefault();
                    message.warning("Copying is disabled during the quiz");
                  }}
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
                      color: isMarked
                        ? GRAD_TO
                        : highContrast
                        ? "#fff"
                        : undefined,
                      borderColor: isMarked
                        ? GRAD_TO
                        : highContrast
                        ? "#555"
                        : undefined,
                    }}
                    disabled={locked[current]} // no marking after lock
                    onClick={toggleMark}
                  >
                    {isMarked ? "Unmark" : "Mark"}
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
                      background: `linear-gradient(135deg, ${GRAD_FROM}, ${GRAD_TO})`,
                      border: "none",
                      boxShadow: "0 2px 8px rgba(127, 53, 205, 0.2)",
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
        centered
        onCancel={() => setSubmit(false)}
        styles={modalStyles}
        okButtonProps={{
          style: modalStyles.okButton,
        }}
        cancelButtonProps={{
          style: modalStyles.cancelButton,
        }}
      >
        {submitModalContent}
      </Modal>

      <Modal
        title="Time's up!"
        open={timesUp}
        footer={[
          <Button
            key="continue"
            type="primary"
            onClick={handleTimeUpNavigation}
            style={modalStyles.okButton}
          >
            Continue
          </Button>,
        ]}
        centered
        onCancel={() => setTimesUp(false)}
        styles={modalStyles}
      >
        <div className="flex items-start gap-4">
          <ExclamationCircleFilled className="text-2xl text-red-500 mt-1" />
          <div>
            <p className="font-medium mb-2">
              Time for this question has expired!
            </p>
            <p className="text-gray-600">
              You can proceed to the next question but cannot modify this
              answer.
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        title="Go back and end quiz?"
        open={confirmBack}
        centered
        okText="Yes, submit & exit"
        cancelText="Stay"
        styles={modalStyles}
        okButtonProps={{
          style: modalStyles.okButton,
        }}
        cancelButtonProps={{
          style: modalStyles.cancelButton,
        }}
        onOk={handleSubmit}
        onCancel={() => setBack(false)}
      >
        <div className="flex items-start gap-4">
          <ExclamationCircleFilled className="text-2xl text-yellow-500 mt-1" />
          <div>
            <p className="font-medium mb-2">
              This will submit your current attempt
            </p>
            <p className="text-gray-600">
              All your answers will be saved and you'll be redirected to the
              quiz results page.
            </p>
          </div>
        </div>
      </Modal>

      <CalculatorDrawer
        open={showCalc}
        onClose={() => setShowCalc(false)}
        highContrast={highContrast}
      />
    </Layout>
  );
}
