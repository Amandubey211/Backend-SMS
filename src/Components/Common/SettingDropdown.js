import React, { useRef, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoLanguage, IoSettingsOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaGraduationCap } from "react-icons/fa";
import { setSelectedLanguage } from "../../Redux/Slices/Auth/AuthSlice";

const SettingDropdown = ({
  showSetting,
  setShowSetting,
  navigateProfile,
  openModal,
}) => {
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  // Accessing language and role from the Redux store
  const selectedLanguage = useSelector((store) => store.Auth.selectedLanguage);
  const role = useSelector((store) => store.Auth.role);

  const [showLanguageOptions, setShowLanguageOptions] = useState(false);

  // Handling clicks outside the dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowSetting(false);
      setShowLanguageOptions(false);
    }
  };

  // Language change handler
  const handleLanguageChange = (lang) => {
    dispatch(setSelectedLanguage(lang)); // Dispatch the action to update selected language in Redux
    setShowLanguageOptions(false); // Close language options dropdown
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Define a common style for all list items
  const listItemClass =
    "flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-purple-500 transition-transform duration-200 hover:bg-gray-100 px-3 py-2 rounded-md transform hover:translate-x-1";

  return (
    showSetting && (
      <div
        ref={dropdownRef}
        className="absolute top-10 right-0 bg-white rounded-lg shadow-lg border px-4 py-3 flex flex-col gap-2 z-[9999] w-56"
      >
        {/* Profile Button with active state */}
        <NavLink
          to="/users/admin"
          className={({ isActive }) =>
            `${listItemClass} ${
              isActive ? "text-purple-600 bg-purple-100 " : ""
            }`
          }
        >
          <FaUser className="text-lg" />
          Profile
        </NavLink>

        {/* Admin Section */}
        {role === "admin" && (
          <NavLink
            to="/dashboard/academic"
            className={({ isActive }) =>
              `${listItemClass} ${
                isActive ? "text-purple-600 bg-purple-100 " : ""
              }`
            }
          >
            <FaGraduationCap className="text-lg" />
            Academic
          </NavLink>
        )}

        {/* Custom Language Switcher */}
        <div className="relative">
          <div
            className={`${listItemClass} cursor-pointer`}
            onClick={() => setShowLanguageOptions(!showLanguageOptions)}
          >
            <IoLanguage className="text-lg" />
            Language ({selectedLanguage})
          </div>

          {showLanguageOptions && (
            <div
              className="absolute top-10 left-0 bg-white border shadow-md rounded-md z-[10000] w-full"
              style={{ marginTop: "4px" }} // To avoid overlap
            >
              {[
                { lang: "EN", label: "English", flag: "🇬🇧" },
                { lang: "AR", label: "Arabic", flag: "🇸🇦" },
                { lang: "HI", label: "Hindi", flag: "🇮🇳" },
                { lang: "ES", label: "Spanish", flag: "🇪🇸" },
                { lang: "DE", label: "German", flag: "🇩🇪" },
              ].map(({ lang, label, flag }) => (
                <div
                  key={lang}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200 cursor-pointer"
                  // onClick={() => handleLanguageChange(lang)}
                  onClick={() => handleLanguageChange(label)}
                >
                  <span role="img" aria-label={label}>
                    {flag}
                  </span>
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          className={`${listItemClass} text-red-600 hover:text-red-800`}
          onClick={openModal}
        >
          <IoIosLogOut className="text-lg" />
          Logout
        </button>
      </div>
    )
  );
};

export default SettingDropdown;
