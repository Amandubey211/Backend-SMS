import React, { useCallback, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSectionsByClass } from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { useTranslation } from "react-i18next";
import { Tooltip } from "antd";
import { FiRefreshCw } from "react-icons/fi";

const NavigationBar = ({ setActiveSection, activeSection, totalStudents }) => {
  const { t } = useTranslation("admClass");
  const Sections = useSelector(
    (store) => store.admin.group_section.sectionsList
  );
  const role = useSelector((store) => store.common.auth.role);
  const dispatch = useDispatch();
  const { cid } = useParams();

  const [hoveredSection, setHoveredSection] = useState(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    dispatch(fetchSectionsByClass(cid));
  }, [dispatch, cid]);

  const getButtonClass = useCallback(
    (section) => {
      return activeSection === section
        ? "relative px-4 py-2 rounded-full bg-gradient-to-r from-red-400 to-purple-500 text-white"
        : "relative px-4 py-2 rounded-full border border-gray-300";
    },
    [activeSection]
  );

  const handleSectionChange = useCallback(
    (section) => {
      setActiveSection(section);
    },
    [setActiveSection]
  );

  // Conditionally show the blur if more than 3 sections exist
  const showBlur = (Sections?.length || 0) > 3;

  // Reset the active section to "Everyone"
  const handleReset = () => {
    setResetting(true);
    setActiveSection("Everyone");

    // Reset the spinning animation after 1 second
    setTimeout(() => setResetting(false), 1000);
  };

  return (
    <>
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">
            {t(`All Students (${totalStudents})`)}
          </h1>
        </div>
        {role === "admin" && (
          <NavLink
            to="/admissions"
            className="flex items-center border border-gray-300 ps-5 py-0 rounded-full"
          >
            <span className="mr-2">{t("Add New Students")}</span>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
              <span className="text-3xl -mt-2">+</span>
            </div>
          </NavLink>
        )}
      </div>

      {/* Scrollable Section Navigation */}
      <div className="relative w-auto ps-3">
        <div className="inline-flex items-center max-w-full overflow-x-auto whitespace-nowrap no-scrollbar pr-12">
          {/* "Everyone" section should always be visible */}
          <button
            className={getButtonClass("Everyone")}
            onClick={() => handleSectionChange("Everyone")}
            aria-pressed={activeSection === "Everyone"}
          >
            {t("Everyone")}
          </button>

          {/* Scrollable sections */}
          <div className="inline-flex space-x-2 ml-2">
            {Sections?.map((item) => (
              <button
                key={item.sectionName}
                className={getButtonClass(item.sectionName)}
                onClick={() => handleSectionChange(item.sectionName)}
                aria-pressed={activeSection === item.sectionName}
                onMouseEnter={() => setHoveredSection(item.sectionName)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                {item.sectionName}
                {hoveredSection === item.sectionName && role !== "teacher" && (
                  <span className="absolute top-0 right-0 p-1 flex space-x-2 rounded-full bg-white hover:bg-gray-200 text-lg border -m-1 text-red-600 cursor-pointer">
                    {/* Edit and Delete Buttons (Visible only for Admin) */}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Reset Button with Animated Spin (Only visible if not in "Everyone") */}
          {activeSection !== "Everyone" && (
            <div className="inline-flex ml-2">
              <Tooltip title="Reset to 'Everyone'">
                <button
                  onClick={handleReset}
                  className={`p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 hover:animate-spin flex items-center justify-center transition-all duration-300 ${
                    resetting ? "animate-[spin_0.8s_linear_infinite]" : ""
                  }`}
                >
                  <FiRefreshCw className="h-5 w-5 text-gray-600" />
                </button>
              </Tooltip>
            </div>
          )}
        </div>

        {showBlur && (
          <div className="pointer-events-none absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-white to-transparent backdrop-blur-sm" />
        )}
      </div>
    </>
  );
};

export default NavigationBar;
