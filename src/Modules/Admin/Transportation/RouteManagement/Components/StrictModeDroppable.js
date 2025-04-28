/* ---------- StrictModeDroppable.jsx ---------- */
import React from "react";
import { Droppable } from "@hello-pangea/dnd";

const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => cancelAnimationFrame(animation);
  }, []);

  if (!enabled) return null;
  return <Droppable {...props}>{children}</Droppable>;
};

export default StrictModeDroppable;
