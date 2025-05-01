import React, { useEffect, useRef } from "react";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursor) {
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const animateFollower = () => {
      posX += (mouseX - posX) / 8;
      posY += (mouseY - posY) / 8;
      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
      }
      requestAnimationFrame(animateFollower);
    };

    document.addEventListener("mousemove", handleMouseMove);
    animateFollower();

    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-gradient-to-r from-[#C83B62] to-[#7F35CD] rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-100 ease-out"
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998] mix-blend-difference transition-transform duration-200 ease-out border-2 border-transparent bg-gradient-to-r from-[#C83B62] to-[#7F35CD] opacity-80"
      />
    </>
  );
};

export default CustomCursor;
