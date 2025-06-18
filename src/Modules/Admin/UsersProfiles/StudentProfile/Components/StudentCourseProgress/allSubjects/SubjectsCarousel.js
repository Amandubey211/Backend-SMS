import React, { useRef } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import SubjectCard from "./SubjectCard";

export default function SubjectsCarousel({
  subjects,
  frameColor = "border-primary",
}) {
  const scrollRef = useRef(null);

  /** Scroll by exactly one card width */
  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = container.firstChild?.offsetWidth || 0;
    container.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  if (!subjects?.length) return null;

  return (
    <div className="relative w-full">
      {/* Scrollable list */}
      <ul
        ref={scrollRef}
        className="flex flex-nowrap gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
        aria-label="Subjects carousel"
      >
        {subjects.map((subj) => (
          <li
            key={subj.subjectId}
            className="flex-none w-full sm:w-1/2 lg:w-1/4"
          >
            <SubjectCard subject={subj} frameColor={frameColor} />
          </li>
        ))}
      </ul>

      {/* Left control */}
      <button
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 shadow hover:bg-white backdrop-blur disabled:opacity-40"
        disabled={subjects.length <= 1}
      >
        <MdChevronLeft size={24} />
      </button>

      {/* Right control */}
      <button
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 shadow hover:bg-white backdrop-blur disabled:opacity-40"
        disabled={subjects.length <= 1}
      >
        <MdChevronRight size={24} />
      </button>
    </div>
  );
}