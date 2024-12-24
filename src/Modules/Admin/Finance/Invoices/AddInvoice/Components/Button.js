import React from "react";

const Button = ({
  type = "button",
  onClick,
  disabled,
  children,
  variant = "primary",
}) => {
  const baseStyles =
    "px-6 py-2 rounded-sm text-md font-medium transition focus:outline-none";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md hover:from-pink-600 hover:to-purple-600",
    secondary:
      "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200",
    danger: "bg-red-500 text-white shadow-md hover:bg-red-600",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${
        disabled ? disabledStyles : ""
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
