import React, { useState, useEffect } from "react";
import Layout from "../../../../../../Components/Common/Layout";
import MainSection from "./MainSection";
import SideMenubar from "../../../../../../Components/Admin/SideMenubar";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const CreateQuizzes = () => {
  const location = useLocation();
  const quizIdFromState = location.state?.quizId;

  // Initialize isEditing state based on quizId in the location state
  const [isEditing, setIsEditing] = useState(!!quizIdFromState);

  const isSidebarOpen = useSelector(
    (state) => state.common.user.sidebar.isOpen
  );
  const sidebarWidth = isSidebarOpen ? "15%" : "7%"; // Adjust the width based on sidebar state

  useEffect(() => {
    // Update isEditing if location changes
    setIsEditing(!!quizIdFromState);
  }, [quizIdFromState]);

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
          <MainSection setIsEditing={setIsEditing} isEditing={isEditing} />
        </div>
      </div>
    </Layout>
  );
};

export default CreateQuizzes;
