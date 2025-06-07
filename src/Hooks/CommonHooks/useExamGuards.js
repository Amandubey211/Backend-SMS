// src/Modules/Student/StudentClass/Subjects/Modules/Quizzes/hooks/useExamGuards.js
import { useEffect, useRef, useState } from "react";
import { message } from "antd";

export default function useExamGuards({ active, onForceSubmit }) {
  const [violations, setViolations] = useState(0);
  const initialSize = useRef({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    if (!active) return;

    const bump = () => {
      setViolations((v) => {
        const next = v + 1;
        if (next >= 3) onForceSubmit();
        else message.warning(`Warning ${next}/3 – stay on the quiz tab.`);
        return next;
      });
    };

    const onBlur = () => bump();
    const onKey = (e) => {
      if (e.key === "Escape" || e.key === "F12") {
        e.preventDefault();
        bump();
      }
    };
    const onResize = () => {
      const { w, h } = initialSize.current;
      if (window.innerWidth < w || window.innerHeight < h) bump();
    };

    window.addEventListener("blur", onBlur);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [active, onForceSubmit]);
}
