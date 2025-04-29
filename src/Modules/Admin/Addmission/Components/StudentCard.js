import React, { memo } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { PiStudentDuotone } from "react-icons/pi";
import CardBanner from "../../../../Assets/AdmissionCard/CardBanner.jpg";
import Logo from "../../../../Components/Common/Logo";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const StudentCard = memo(({ studentInfo, academicInfo, imagePreview }) => {
  const { t } = useTranslation("admAdmission");
  const {
    firstName = "",
    lastName = "",
    studentId = "",
    phoneNumber = "",
    gender = "",
    nationality = "",
    email = "",
  } = studentInfo;

  const classList = useSelector((store) => store.admin.class.classes);
  const selectedClass = classList.find(
    (classItem) => classItem._id === academicInfo?.class
  );
  const className = selectedClass ? selectedClass.className : "";

  const truncateText = (text, maxLength) => {
    return text?.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <motion.div
      className="pb-3 mt-2 bg-white rounded-lg shadow-md w-60 border"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col">
        <div
          className="w-full h-32 bg-cover bg-center rounded-t-md relative flex justify-center items-center"
          style={{ backgroundImage: `url(${CardBanner})` }}
        >
          <div className="absolute top-2 left-2 text-white text-sm font-semibold">
            <Logo height="h-6" />
          </div>
          <div className="mt-2 bg-white rounded-full flex justify-center items-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={firstName}
                className="rounded-full w-20 h-20 object-cover"
              />
            ) : (
              <PiStudentDuotone className="w-12 h-12 text-gray-800" />
            )}
          </div>
        </div>

        <div className="mt-2 px-3">
          <h2 className="text-base text-center font-semibold">
            {firstName || t("First Name")} {lastName || t("Last Name")}
          </h2>
          <div className="text-xs text-gray-600 mt-1 space-y-1">
            <p>
              <span className="font-semibold">{t("ID")}</span>:{" "}
              {studentId || "N/A"}
            </p>
            <p>
              <span className="font-semibold">{t("Class")}</span>:{" "}
              {className || "N/A"}
            </p>
            <p>
              <span className="font-semibold">{t("Gender")}</span>:{" "}
              {gender || "N/A"}
            </p>
            <p>
              <span className="font-semibold">{t("Nationality")}</span>:{" "}
              {nationality || "N/A"}
            </p>
            <p title={email}>
              <span className="font-semibold">{t("Email")}</span>:{" "}
              {truncateText(email, 20) || "N/A"}
            </p>
            <p>
              <span className="font-semibold">{t("Phone")}</span>:{" "}
              {phoneNumber || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default StudentCard;
