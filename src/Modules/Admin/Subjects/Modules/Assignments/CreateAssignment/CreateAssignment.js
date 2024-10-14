import React, { useState, useEffect } from "react";
import Layout from "../../../../../../Components/Common/Layout";
import MainSection from "./MainSection";
import SideMenubar from "../../../../../../Components/Admin/SideMenubar";
import { useSelector } from "react-redux";

const CreateAssignment = () => {
  const isSidebarOpen = useSelector(
    (state) => state.common.user.sidebar.isOpen
  );
  const sidebarWidth = isSidebarOpen ? "15%" : "7%";

  const [isEditing, setIsEditing] = useState(false);

  return (
    <Layout
      title={
        isEditing
          ? "Update Assignment | Student Diwan"
          : "Create Assignment | Student Diwan"
      }
    >
      <div className="flex w-full min-h-screen">
        {/* Sidebar is fixed on the left */}
        <SideMenubar />
        <div
          className={`ml-${sidebarWidth} transition-all duration-500 flex-1 h-full`}
          style={{
            marginLeft: sidebarWidth,
          }}
        >
          <div className="w-full min-h-screen h-screen overflow-y-scroll no-scrollbar ">
            <MainSection setIsEditing={setIsEditing} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateAssignment;
