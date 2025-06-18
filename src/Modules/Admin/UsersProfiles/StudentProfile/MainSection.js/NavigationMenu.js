import React from "react";
import { useTranslation } from "react-i18next";

export default function NavigationMenu({ activeItem, setActiveItem, items }) {
  const { t } = useTranslation("admAccounts");

  return (
    <nav className="flex flex-col p-4 space-y-2 items-start w-full ">
      {items?.map((item) => {
        const isActive = activeItem === item;
        return (
          <button
            key={item}
            onClick={() => setActiveItem(item)}
            className={`w-full text-left rounded-md px-3 py-2 text-sm font-medium
              transition duration-150 ease-in-out
              ${
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
          >
            {t(item)}
          </button>
        );
      })}
    </nav>
  );
}
