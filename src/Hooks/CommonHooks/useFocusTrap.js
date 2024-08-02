import { useEffect, useCallback } from "react";

/**
 * Custom hook to trap focus within a specified container element.
 * @param {React.RefObject} containerRef - A ref pointing to the container element where focus should be trapped.
 */
const useFocusTrap = (containerRef) => {
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Tab" && containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [containerRef]
  );

  useEffect(() => {
    const containerNode = containerRef.current;
    if (containerNode) {
      containerNode.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (containerNode) {
        containerNode.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [handleKeyDown, containerRef]);
};

export default useFocusTrap;
