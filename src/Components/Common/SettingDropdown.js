import React, { useRef, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoLanguage, IoSettingsOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaGraduationCap } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { gt } from "../../Utils/translator/translation";
import { setSelectedLanguage } from "../../Store/Slices/Common/Auth/reducers/authSlice";

const SettingDropdown = ({
  showSetting,
  setShowSetting,
  navigateProfile,
  openModal,
}) => {
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
    console.log("lang is", lang);
    // Change the language using i18next
    i18next
      .changeLanguage(lang)
      .then(() => {
        // Update the selected language in Redux only after i18next changes the language
        dispatch(setSelectedLanguage(lang)); // Redux action to update the language
        setShowLanguageOptions(false); // Close the dropdown
      })
      .catch((err) => {
        console.error("Error changing language:", err);
      });
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
          to={
            role === "admin"
              ? `/users/admin`
              : role === "student"
              ? "/users/student/profile"
              : ""
          }
          className={({ isActive }) =>
            `${listItemClass} ${
              isActive ? "text-purple-600 bg-purple-100 " : ""
            }`
          }
        >
          <FaUser className="text-lg" />
          {t("Profile", gt.setting)}
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
            {t("Academic", gt.setting)}
          </NavLink>
        )}

        {/* Custom Language Switcher */}
        <div className="relative">
          <div
            className={`${listItemClass} cursor-pointer`}
            onClick={() => setShowLanguageOptions(!showLanguageOptions)}
          >
            <IoLanguage className="text-lg" />
            {t("Language", gt.language)} ({selectedLanguage})
          </div>

          {showLanguageOptions && (
            <div
              className="absolute top-10 left-0 bg-white border shadow-md rounded-md z-[10000] w-full"
              style={{ marginTop: "4px" }} // To avoid overlap
            >
              {[
                { lang: "en", label: "English", flag: "🇬🇧" },
                { lang: "ar", label: "Arabic", flag: "🇸🇦" },
                { lang: "hi", label: "Hindi", flag: "🇮🇳" },
              ].map(({ lang, label, flag }) => (
                <div
                  key={lang}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200 cursor-pointer"
                  // onClick={() => handleLanguageChange(lang)}
                  onClick={() => handleLanguageChange(lang)}
                >
                  <span role="img" aria-label={label}>
                    {flag}
                  </span>

                  {selectedLanguage === "en" ? (
                    label
                  ) : (
                    <span>
                      {t(label, gt.language)}
                      <sub>({label})</sub>
                    </span>
                  )}
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
          {t("Logout", gt.setting)}
        </button>
      </div>
    )
  );
};

export default SettingDropdown;
