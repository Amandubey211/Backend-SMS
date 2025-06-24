import { useSelector } from "react-redux";
import Navbar from "../Common/Navbar";
import SideMenubar from "./SideMenubar";

const StudentDashLayout = ({
  children,
  hideSearchbar,
  hideAvatarList,
  hideStudentView,
}) => {
  const isSidebarOpen = useSelector(
    (state) => state.common.user.sidebar.isOpen
  );
  const sidebarWidth = isSidebarOpen ? "15%" : "7%";

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <SideMenubar isOpen={isSidebarOpen} />

      {/* Main content area */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 500ms ease",
        }}
      >
        {/* Sticky navbar */}
        <div className="sticky top-0 z-10">
          <Navbar
            hideSearchbar={hideSearchbar}
            hideAvatarList={hideAvatarList}
            hideStudentView={hideStudentView}
          />
        </div>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto smooth-scroll p-2">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentDashLayout;
