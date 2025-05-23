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
    contactNumber = "",
    gender = "",
    nationality = "",
    email = "",
    middleName = "",
  } = studentInfo;

  const classList = useSelector((s) => s.admin.class.classes);
  const selectedClass = classList.find((c) => c._id === academicInfo?.class);
  const className = selectedClass?.className ?? "";

  const truncate = (txt, len) =>
    txt?.length > len ? txt.slice(0, len) + "…" : txt;

  return (
    <motion.div
      className="pb-4 mt-2 bg-white rounded-lg shadow-md w-60 border"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Banner */}
      <div className="relative w-full h-32 rounded-t-md overflow-hidden">
        <img
          src={CardBanner}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => (e.target.style.display = "none")}
        />
        {/* Logo */}
        <div className="absolute top-1 p-1 left-1 bg-purple-100 rounded-lg">
          <Logo height="h-5" variant="light" />
        </div>
        {/* Avatar + Ribbon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Ribbon behind avatar */}
          <img
            src="https://static.vecteezy.com/system/resources/previews/018/742/429/large_2x/colorful-ribbon-vibrant-colored-wavy-tape-abstract-design-element-png.png"
            alt=""
            className="absolute top-20 w-32 transform -translate-y-1 pointer-events-none z-10"
            onError={(e) => (e.target.style.display = "none")}
          />
          {/* Avatar on top */}
          <div className="relative z-20 bg-white rounded-full p-1 shadow-md">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={`${firstName} ${lastName}`}
                className="rounded-full w-20 h-20 object-cover"
              />
            ) : (
              <PiStudentDuotone className="w-12 h-12 text-gray-800" />
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 px-3 text-center capitalize">
        <h2 className="text-base font-semibold">
          {firstName || t("First Name")} {middleName || t("Middle")}{" "}
          {lastName || t("Last Name")}
        </h2>
        <div className="mt-2 text-xs text-gray-600 space-y-1 text-left">
          <p>
            <span className="font-semibold">{t("ID")}:</span>{" "}
            {studentId || "N/A"}
          </p>
          <p>
            <span className="font-semibold">{t("Class")}:</span>{" "}
            {className || "N/A"}
          </p>
          <p>
            <span className="font-semibold">{t("Gender")}:</span>{" "}
            {gender || "N/A"}
          </p>
          <p>
            <span className="font-semibold">{t("Nationality")}:</span>{" "}
            {nationality || "N/A"}
          </p>
          <p title={email}>
            <span className="font-semibold">{t("Email")}:</span>{" "}
            {truncate(email, 20) || "N/A"}
          </p>
          <p>
            <span className="font-semibold">{t("Phone")}:</span>{" "}
            {contactNumber || "N/A"}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

export default StudentCard;
