import React from "react";
import PropTypes from "prop-types";
import { Card } from "antd";
import { motion } from "framer-motion";
import { FiPhone } from "react-icons/fi";
import profileImage from "../../../../../../Assets/DashboardAssets/profileIcon.png";

const MotionCard = motion(Card);

const ProfileCard = ({ profile, onClick }) => (
  <MotionCard
    hoverable
    onClick={onClick}
    layout
    whileHover={{ y: -4, scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className="w-full aspect-square flex flex-col justify-between overflow-hidden"
    bodyStyle={{ padding: "1rem", height: "100%" }}
  >
    {/* Avatar + name */}
    <div className="flex flex-col items-center text-center flex-1 justify-center">
      <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border">
        <img
          src={profile?.profile || profileImage}
          alt={profile?.name}
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </div>
      <h3 className="text-lg font-medium line-clamp-1">{profile?.name}</h3>
      <p className="text-gray-500 text-sm line-clamp-1">
        {profile?.subjects?.[0] ?? "N/A"}
      </p>
    </div>

    {/* Phone footer */}
    <footer className="border-t pt-2 text-center">
      {/* <p className="text-gray-500 text-xs">Phone</p> */}
      <div className="flex items-center justify-center gap-1 mt-1">
        <FiPhone className="text-purple-500 text-sm flex-shrink-0" />
        <span
          className="text-sm font-medium max-w-full truncate whitespace-nowrap"
          title={profile?.phone}
        >
          +{formatPhone(profile?.phone) ?? "N/A"}
        </span>
      </div>
    </footer>
  </MotionCard>
);

/* Simple formatter: inserts spaces every 3–4 digits so wrapping is possible */
const formatPhone = (num = "") => num.replace(/(\d{3})(?=\d)/g, "$1 ");

ProfileCard.propTypes = {
  profile: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

export default ProfileCard;
