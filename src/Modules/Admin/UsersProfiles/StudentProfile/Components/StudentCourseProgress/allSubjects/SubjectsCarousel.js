import React, { useRef, useState, useEffect } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import SubjectCard from "./SubjectCard";

export default function SubjectsCarousel({
  subjects,
  frameColor = "border-primary",
}) {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [hovered, setHovered] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.offsetWidth < el.scrollWidth);
  };

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstChild?.offsetWidth || 200;
    el.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons(); // initial check

    const handleScroll = () => updateScrollButtons();
    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  if (!subjects?.length) return null;

  return (
    <div
      className="relative w-full group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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
      {hovered && showLeft && (
        <button
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 shadow hover:bg-white backdrop-blur"
        >
          <MdChevronLeft size={24} />
        </button>
      )}

      {/* Right control */}
      {hovered && showRight && (
        <button
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 shadow hover:bg-white backdrop-blur"
        >
          <MdChevronRight size={24} />
        </button>
      )}
    </div>
  );
}
