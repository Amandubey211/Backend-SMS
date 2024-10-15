import React, { useState } from "react";
import Layout from "../../../../../../Components/Common/Layout";
import MainSection from "./MainSection";
import SideMenubar from "../../../../../../Components/Admin/SideMenubar";
import { useSelector } from "react-redux";

const CreateQuizzes = () => {
  const [isEditing, setIsEditing] = useState(false);
  const isSidebarOpen = useSelector(
    (state) => state.common.user.sidebar.isOpen
  );
  const sidebarWidth = isSidebarOpen ? "15%" : "7%"; // Adjust the width based on sidebar state

  return (
    <Layout
      title={
        isEditing
          ? "Update Quiz | Student Diwan"
          : "Create Quiz | Student Diwan"
      }
    >
      <div className="flex w-full min-h-screen">
        <SideMenubar />
        <div
          className={`ml-${sidebarWidth} transition-all duration-500 flex-1 h-full`}
          style={{
            marginLeft: sidebarWidth,
          }}
        >
          <MainSection setIsEditing={setIsEditing} />
        </div>
      </div>
    </Layout>
  );
};

export default CreateQuizzes;
