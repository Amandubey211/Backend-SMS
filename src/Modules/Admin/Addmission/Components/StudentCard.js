import React from "react";
import { GiArmorUpgrade } from "react-icons/gi";
import CardBanner from "../../../../Assets/AdmissionCard/CardBanner.jpg";
import Logo from "../../../../Components/Common/Logo";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

const StudentCard = ({ studentInfo, imagePreview }) => {
  const { t } = useTranslation('admAdmission');
  const {
    firstName,
    lastName,
    Q_Id,
    contactNumber,
    applyingClass,
    section,
    bloodGroup,
    religion,
    email,
  } = studentInfo;
  const classList = useSelector((store) => store.admin.class.classes);
  const selectedClass = classList.find(
    (classItem) => classItem._id === applyingClass
  );

  const className = selectedClass ? selectedClass.className : "";
  // Truncate email if it is longer than 20 characters
  const truncateEmail = (email) => {
    return email.length > 20 ? email.substring(0, 20) + "..." : email;
  };

  return (
    <div className="pb-4 mt-2 bg-white rounded-lg shadow-md w-64 border">
      <div className="flex flex-col ">
        <div
          className="w-full h-40 bg-cover bg-center rounded-t-md relative flex justify-center items-center"
          style={{ backgroundImage: `url(${CardBanner})` }}
        >
          <div className="absolute top-2 left-2 text-white text-sm font-semibold">
            <div className="flex items-center space-x-1">
              <Logo height="h-6" />
            </div>
          </div>
          <div className="mt-4 bg-white rounded-full flex justify-center items-center">
            <img
              src={imagePreview || "https://via.placeholder.com/150"}
              alt={firstName}
              className="rounded-full w-24 h-24 object-cover"
            />
          </div>
        </div>
        <div className="mt-4  px-4">
          <h2 className="text-lg text-center font-semibold">
            {firstName + " " + lastName || t("Student Name")}
          </h2>
          <div className="text-sm text-gray-600 mt-2 space-y-1 ">
            <p>
              <span className="font-semibold">{t("QID")}</span>: {Q_Id}
            </p>
            <p>
              <span className="font-semibold">{t("Class")}</span>: {className}
            </p>

            <p>
              <span className="font-semibold">{t("Blood")}</span>: {bloodGroup}
            </p>
            <p>
              <span className="font-semibold">{t("Religion")}</span>: {religion}
            </p>
            <p title={email}>
              <span className="font-semibold">{t("Email")}</span>: {truncateEmail(email)}
            </p>
            <p>
              <span className="font-semibold">{t("Number")}</span>: {contactNumber}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
