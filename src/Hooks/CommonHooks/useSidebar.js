import { useState, useCallback } from "react";

const useSidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarOpen = useCallback(() => setSidebarOpen(true), []);
  const handleSidebarClose = useCallback(() => setSidebarOpen(false), []);

  return { isSidebarOpen, handleSidebarOpen, handleSidebarClose };
};

export default useSidebar;
