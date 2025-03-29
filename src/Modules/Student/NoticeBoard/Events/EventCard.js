import React, { useMemo } from "react";
import { MdAccessTime } from "react-icons/md";
import { useTranslation } from "react-i18next";

const EventCard = ({ event, onClick }) => {
  const { t } = useTranslation("prtEvents");

  // Define a fixed set of 4 vibrant colors
  const bgColors = useMemo(
    () => [
      "linear-gradient(135deg,rgb(170, 33, 78),rgb(159, 43, 157))", // Pink
      "linear-gradient(135deg, #E24DFF, #9A5CFF)", // Purple
      "linear-gradient(135deg, #21AEE7, #79C7FF)", // Blue
      "linear-gradient(135deg, #FBB778, #FFD97D)", // Orange
      "linear-gradient(135deg, #6DD5FA, #2980B9)", // Light Blue
      "linear-gradient(135deg, #FF9A8B, #FF6A88, #FF99AC)", // Warm Red-Orange
      "linear-gradient(135deg, #A1C4FD, #C2E9FB)", // Soft Sky Blue
      "linear-gradient(135deg, #FAD961, #F76B1C)", // Sunset Orange
      "linear-gradient(135deg, #16A085, #F4D03F)", // Green-Yellow
      "linear-gradient(135deg, #8E2DE2, #4A00E0)", // Deep Purple
      "linear-gradient(135deg, #F12711, #F5AF19)", // Red-Orange Fire
      "linear-gradient(135deg, #FF512F, #DD2476)", // Red-Pink
      "linear-gradient(135deg, #009FFF, #ec2F4B)", // Blue-Red
      "linear-gradient(135deg, #00B4DB, #0083B0)", // Aqua Blue
      "linear-gradient(135deg, #11998E, #38EF7D)", // Green Gradient
    ],
    []
  );
  

  // Assign a color randomly but ensure a mix
  const eventId = event?.id ?? Math.floor(Math.random() * 1000); // If ID isn't available, use random
  const bgColor = bgColors[eventId % bgColors.length];

  const formatDate = (dateString) => {
    if (!dateString) return t("Invalid Date");
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return isNaN(date) ? t("Invalid Date") : date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
  };

  const handleClick = () => {
    if (onClick && typeof onClick === "function") {
      onClick(event);
    }
  };

  const truncateText = (text, maxLength) => {
    return text && text.length > maxLength ? `${text.substring(0, maxLength)}...` : text ?? t("No Description");
  };

  const formattedDate = useMemo(() => formatDate(event?.startDate), [event?.startDate]);

  return (
    <div
      className="flex flex-col justify-between rounded-xl p-4 text-white shadow-lg m-2 cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-xl"
      style={{
        width: "220px",
        height: "180px",
        background: bgColor,
      }}
      onClick={handleClick}
    >
      <div className="flex items-start">
        <div className="flex items-center justify-center bg-white text-[#FF6C9C] rounded-lg p-2 w-12 h-12 text-2xl font-bold shadow-md">
          {new Date(event?.startDate).getDate() ?? t("Invalid Date")}
        </div>
        <div className="flex flex-col ml-2">
          <span className="text-lg font-semibold">{truncateText(event?.title, 12)}</span>
          <div className="flex items-center">
            <MdAccessTime className="mr-2 text-white text-lg" />
            <span>{event?.time ?? t("No Time")}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-2 text-white font-inter text-sm font-semibold leading-[1.5]">
        <span>{truncateText(event?.description, 20)}</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default React.memo(EventCard);
