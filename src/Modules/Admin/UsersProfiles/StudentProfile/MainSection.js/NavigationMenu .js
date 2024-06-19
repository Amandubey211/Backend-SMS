// Components/NavigationMenu.js
import React from "react";

const NavigationMenu = ({ activeItem, setActiveItem, items }) => {
  return (
    <div className="flex flex-col min-h-screen h-full space-y-4 bg-gray-100 text-start items-center">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => setActiveItem(item)}
          className={`mt-2 px-4 ${
            activeItem === item
              ? "inline-flex items-center border border-transparent font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600 py-2 w-[60%] px-4"
              : "text-black px-4 py-1 font-medium"
          } transition duration-200 ease-in-out`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default NavigationMenu;
