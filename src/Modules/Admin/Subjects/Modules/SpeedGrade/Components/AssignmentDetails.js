/* src/Modules/Admin/Subjects/Modules/SpeedGrade/Components/AssignmentDetails.jsx */
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import SpeedGradeQuizAnswerCard from "./SpeedGradeQuizAnswerCard";
import { useTranslation } from "react-i18next";
import {
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdQuiz,
  MdOutlineRule,
  MdTextFields,
} from "react-icons/md";

const TYPES = {
  mcq: { labelKey: "MCQ", icon: MdQuiz },
  trueFalse: { labelKey: "True / False", icon: MdOutlineRule },
  text: { labelKey: "Text", icon: MdTextFields },
};

const AssignmentDetails = ({ student, details, type, onTotalGradeUpdate }) => {
  const { t } = useTranslation("admModule");

  const [currentIdx, setCurrentIdx] = useState(0);
  const [headerH, setHeaderH] = useState(0);
  const [navH, setNavH] = useState(0);
  const [totalGrade, setTotalGrade] = useState(0);

  const headerRef = useRef(null);
  const navRef = useRef(null);
  const questionRefs = useRef([]);

  useEffect(() => {
    const measure = () => {
      setHeaderH(headerRef.current?.offsetHeight ?? 0);
      setNavH(navRef.current?.offsetHeight ?? 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const container = details?.assignmentId ?? details?.quizId ?? {};
  const questions = container?.questions ?? [];

  const indicesByType = useMemo(() => {
    const idx = { mcq: [], trueFalse: [], text: [] };
    questions.forEach((q, i) => {
      const qt = (q.type ?? "").toLowerCase();
      if (qt.includes("text")) idx.text.push(i);
      else if (
        qt.includes("true/false") ||
        qt.includes("true false") ||
        qt.includes("truefalse") ||
        qt.includes("boolean")
      )
        idx.trueFalse.push(i);
      else idx.mcq.push(i);
    });
    return idx;
  }, [questions]);

  useEffect(() => {
    if (!student || !details) {
      setTotalGrade(0);
      return;
    }

    const initialGrade = questions.reduce((sum, q) => {
      const ans = details.answers?.find((a) => a.questionId === q._id);
      if (ans?.isCorrect) return sum + q.questionPoint;
      return sum;
    }, 0);

    setTotalGrade(initialGrade);
    onTotalGradeUpdate(initialGrade);
  }, [student, details, questions, onTotalGradeUpdate]);

  const scrollTo = useCallback(
    (idx) => {
      const el = questionRefs.current[idx];
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      const offset = headerH + navH + 8;
      window.scrollBy({ top: -offset, behavior: "smooth" });
      setCurrentIdx(idx);
    },
    [headerH, navH]
  );

  const handleTypeJump = (key) => {
    const list = indicesByType[key];
    if (!list.length) return;
    const next = list[(list.indexOf(currentIdx) + 1) % list.length];
    scrollTo(next);
  };

  const handleQuestionGradeUpdate = (questionIndex, grade) => {
    const newGrade = [...questions].reduce((sum, q, idx) => {
      if (idx === questionIndex) return sum + grade;
      const ans = details.answers?.find((a) => a.questionId === q._id);
      if (ans?.isCorrect) return sum + q.questionPoint;
      return sum;
    }, 0);

    setTotalGrade(newGrade);
    onTotalGradeUpdate(newGrade);
  };

  if (!student || !details) return null;

  const { content, grade, score } = details;
  const { name, points, dueDate, totalPoints } = container;

  return (
    <div className="bg-white border-x border-gray-200 p-0 h-full overflow-y-auto">
      <div
        ref={headerRef}
        className="sticky top-0 z-30 bg-white/80 backdrop-blur p-4 border-b shadow-sm
                   flex justify-between items-start"
      >
        <div>
          <h2 className="text-xl font-semibold capitalize">
            {name || t("Untitled")}
            {container.quizType && (
              <span
                className={`ml-2 px-2 py-1 rounded-lg text-xs font-semibold
                            ${
                              container.quizType === "Practice"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
              >
                {container.quizType === "Practice"
                  ? t("Practice Type")
                  : t("Graded Type")}
              </span>
            )}
          </h2>
          <p className="text-gray-500 mt-0.5">
            {t("Submission Date")}:{" "}
            {dueDate ? new Date(dueDate).toLocaleDateString() : t("N/A")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-sm">{t("Points")}</p>
          <p className="text-green-600 font-bold text-lg leading-none">
            {type === "Quiz" ? score ?? 0 : grade ?? 0}/
            {type === "Quiz" ? totalPoints : points}
          </p>
        </div>
      </div>

      {type === "Quiz" && (
        <div
          ref={navRef}
          style={{ top: `${headerH}px` }}
          className="sticky z-20 bg-white/70 backdrop-blur-md border-b
                     px-4 py-2 flex items-center gap-3 shadow-sm"
        >
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
            disabled={currentIdx === 0}
            onClick={() => scrollTo(Math.max(0, currentIdx - 1))}
            title={t("Previous Question")}
          >
            <MdKeyboardArrowUp size={20} />
          </button>
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
            disabled={currentIdx === questions.length - 1}
            onClick={() =>
              scrollTo(Math.min(questions.length - 1, currentIdx + 1))
            }
            title={t("Next Question")}
          >
            <MdKeyboardArrowDown size={20} />
          </button>

          <span className="h-6 w-px bg-gray-300" />

          {Object.entries(TYPES).map(([key, meta]) => {
            const Icon = meta.icon;
            const count = indicesByType[key].length;
            return (
              <button
                key={key}
                disabled={!count}
                onClick={() => handleTypeJump(key)}
                title={t(meta.labelKey)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium
                           bg-gradient-to-r from-indigo-50 to-violet-50
                           hover:from-indigo-100 hover:to-violet-100
                           disabled:opacity-40 border"
              >
                <Icon size={14} /> {t(meta.labelKey)}
                <span className="font-semibold">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="p-4 space-y-4">
        {type === "Assignment" ? (
          <div
            className="text-gray-700"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : questions.length ? (
          questions.map((q, idx) => {
            const ans = details.answers?.find((a) => a.questionId === q._id);
            return (
              <div
                key={q._id}
                ref={(el) => (questionRefs.current[idx] = el)}
                style={{ scrollMarginTop: headerH + navH + 16 }}
              >
                <SpeedGradeQuizAnswerCard
                  question={q}
                  questionIndex={idx}
                  selectedOption={ans ? ans.selectedOption : ""}
                  onUpdateTextQuestionGrade={(grade) =>
                    handleQuestionGradeUpdate(idx, grade)
                  }
                />
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">{t("No questions available")}</p>
        )}
      </div>
    </div>
  );
};

export default AssignmentDetails;
