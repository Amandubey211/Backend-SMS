import React, { useRef, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoLanguage, IoSettingsOutline } from "react-icons/io5";
import { RiTimeZoneLine } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import { translateText } from "../../Utils/translateService"; // Import the translation service

const NotificationDropdown = ({
  showSetting,
  setShowSetting,
  navigateProfile,
  openModal,
  timeZone,
}) => {
  const dropdownRef = useRef(null);
  const [translatedText, setTranslatedText] = useState({
    profile: "Profile",
    logout: "Logout",
    selectLanguage: "Select Language",
  });
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowSetting(false);
      setShowLanguageOptions(false);
    }
  };

  const changeLanguage = async (langCode) => {
    // Automatically translate text using MyMemory API
    const profileText = await translateText("Profile", langCode);
    const logoutText = await translateText("Logout", langCode);
    const selectLanguageText = await translateText("Select Language", langCode);

    // Set translated text for the component
    setTranslatedText({
      profile: profileText,
      logout: logoutText,
      selectLanguage: selectLanguageText,
    });

    setShowLanguageOptions(false); // Hide language options after selecting
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    showSetting && (
      <div
        ref={dropdownRef}
        className="absolute top-9 right-0 bg-white rounded-lg shadow-lg border px-4 py-3 flex flex-col gap-2 z-50 w-56"
      >
        {/* Profile Button with Translation */}
        <button
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-purple-500 transition-transform duration-200 hover:bg-gray-100 px-3 py-2 rounded-md transform hover:translate-x-2"
          onClick={navigateProfile}
        >
          <FaUser className="text-lg" />
          {translatedText.profile} {/* Translated text from API */}
        </button>

        {/* Custom Language Switcher */}
        <div className="relative flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-purple-500 transition-transform duration-200 hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer">
          <IoLanguage className="text-lg" />
          <span onClick={() => setShowLanguageOptions(!showLanguageOptions)}>
            {translatedText.selectLanguage} {/* Translated text from API */}
          </span>
          {showLanguageOptions && (
            <div className="absolute top-10 right-0 bg-white border shadow-md rounded-md z-10 w-full">
              <div
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => changeLanguage("en")}
              >
                <span role="img" aria-label="English">
                  🇬🇧
                </span>{" "}
                English
              </div>
              <div
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => changeLanguage("ar")}
              >
                <span role="img" aria-label="Arabic">
                  🇸🇦
                </span>{" "}
                Arabic
              </div>
              <div
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => changeLanguage("hi")}
              >
                <span role="img" aria-label="Hindi">
                  🇮🇳
                </span>{" "}
                Hindi
              </div>
              <div
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => changeLanguage("es")}
              >
                <span role="img" aria-label="Spanish">
                  🇪🇸
                </span>{" "}
                Spanish
              </div>
              <div
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => changeLanguage("de")}
              >
                <span role="img" aria-label="German">
                  🇩🇪
                </span>{" "}
                German
              </div>
            </div>
          )}
        </div>

        {/* Time Zone Display */}
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md">
          <RiTimeZoneLine className="text-lg" />
          <span>{timeZone}</span>
        </div>

        {/* Logout Button with Translation */}
        <button
          className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800 transition-transform duration-200 hover:bg-gray-100 px-3 py-2 rounded-md transform hover:translate-x-2"
          onClick={openModal}
        >
          <IoIosLogOut className="text-lg" />
          {translatedText.logout} {/* Translated text from API */}
        </button>
      </div>
    )
  );
};

export default NotificationDropdown;
