import React from 'react';
import { useNavigate } from "react-router-dom";
import rightArrow from '../../../Assets/ParentAssets/svg/right-arrow.svg';
import { useTranslation } from 'react-i18next';
import profileIcon from '../../../Assets/DashboardAssets/profileIcon.png';

const ChildCard = ({ student }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('prtChildrens');

  // Inline styles to preserve your gradients and design
  const primaryButtonContainerStyle = {
    background: 'linear-gradient(to right, #FAECF0 0%, #F3EBFB 100%)',
    borderRadius: '5px',
    padding: '8px 24px',
    display: 'inline-block',
    cursor: 'pointer',
    transition: 'box-shadow 0.3s ease-in-out',
    textAlign: 'center',
    // Removed width: '100%' so they can shrink if needed
    minWidth: '120px', // optional: ensures a comfortable button size
  };

  const primaryButtonTextGradientStyle = {
    background: 'linear-gradient(to right, #C83B62, #7F35CD)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '600',
    fontSize: '14px',
    textTransform: 'uppercase',
  };

  const secondaryButtonStyle = {
    background: '#E9F8EB',
    color: '#0D9755',
    padding: '12px 24px',
    borderRadius: '8px',
    textTransform: 'uppercase',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'box-shadow 0.3s ease-in-out',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '16px',
    width: '100%',
  };

  const arrowIconStyle = {
    marginLeft: '8px',
    fill: '#0D9755',
  };

  // Card container styling
  const cardStyle = {
    backgroundColor: 'white',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    border: '1px solid #E5E7EB',
    padding: '24px',
    transition: 'box-shadow 0.3s ease-in-out',
  };

  return (
    <div
      className="w-full"
      style={cardStyle}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0px 8px 16px rgba(0, 0, 0, 0.2)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.1)')}
    >
      <div className="flex flex-col items-center">
        <img
          className="w-24 h-24 rounded-full mb-6 border"
          src={
            student?.profile?.length !== 0
              ? student?.profile
              : profileIcon
          }
          alt={student.name}
        />
        <p className="font-semibold text-center mb-6 text-lg">
          {student.name}
        </p>

        {/* Student info */}
        <div className="flex flex-wrap justify-center items-center mb-6 space-x-4 text-sm text-gray-600">
          <p>
            {t("Class")}:{" "}
            <span className="font-semibold">
              {student.class || 'N/A'}
            </span>
          </p>
          <p>
            {t("ID")}:{" "}
            <span className="font-semibold">
              {student.admissionNumber || 'N/A'}
            </span>
          </p>
          <p>
            {t("Section")}:{" "}
            <span className="font-semibold">
              {student.section || 'N/A'}
            </span>
          </p>
          <p>
            {t("Group")}:{" "}
            <span className="font-semibold">
              {student.group || 'N/A'}
            </span>
          </p>
        </div>

        {/* Primary buttons always centered, wrapping as needed */}
        <div className="flex flex-wrap gap-2 w-full mb-4 justify-center">
          <div
            style={primaryButtonContainerStyle}
            onClick={() => navigate(`/teacher/${student.id}`)}
          >
            <div style={primaryButtonTextGradientStyle}>
              {t("Instructors")}
            </div>
          </div>

          <div
            style={primaryButtonContainerStyle}
            onClick={() => navigate(`/childgrade/${student.id}`)}
          >
            <div style={primaryButtonTextGradientStyle}>
              {t("Grades")}
            </div>
          </div>

          <div
            style={primaryButtonContainerStyle}
            onClick={() => navigate("/attendance")}
          >
            <div style={primaryButtonTextGradientStyle}>
              {t("Attendance")}
            </div>
          </div>
        </div>

        {/* Secondary button */}
        <div
          style={secondaryButtonStyle}
          onClick={() => navigate(`/checkprogress/${student.id}`)}
        >
          {t("Check Subject Progress")}
          <img src={rightArrow} alt="Right Arrow" style={arrowIconStyle} />
        </div>
      </div>
    </div>
  );
};

export default ChildCard;
