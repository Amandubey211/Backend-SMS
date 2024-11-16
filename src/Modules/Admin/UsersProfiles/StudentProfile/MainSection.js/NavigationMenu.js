// Components/NavigationMenu.js
import React from "react";
import { useTranslation } from "react-i18next";

const NavigationMenu = ({ activeItem, setActiveItem, items }) => {
  const { t } = useTranslation('admAccounts');

  return (
    <div className="flex flex-col py-8 h-auto space-y-4 text-start items-center">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => setActiveItem(item)}
          className={`mt-2 px-4 ${
            activeItem === item
              ? "inline-flex border border-transparent font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600 py-2 w-[60%] px-4"
              : "inline-flex font-medium rounded-md hover:from-pink-600 hover:to-purple-600 py-2 w-[60%] px-4"
          } transition duration-200 ease-in-out`}
        >
          {t(item)}
        </button>
      ))}
    </div>
  );
};

export default NavigationMenu;
