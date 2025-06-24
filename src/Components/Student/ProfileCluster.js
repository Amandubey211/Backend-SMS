// ProfileCluster.jsx
import React, { memo } from "react";
import PropTypes from "prop-types";
import { Avatar, Tag, Tooltip, Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import ProfileIcon from "../../Assets/DashboardAssets/profileIcon.png";
import { getRoleColor, getTruncatedName } from "../../Utils/helperFunctions";

const slideVariants = {
  collapsed: { opacity: 0, x: -15 },
  open: { opacity: 1, x: 0 },
};

const ProfileCluster = memo(
  ({ isOpen, userDetails, role, onAvatarClick, onLogoutClick }) => (
    <div
      className={`flex items-center w-full px-2  ${!isOpen && "border-t pt-2"}`}
      aria-label="User profile section"
    >
      {isOpen && (
        <Tooltip title="Profile">
          <Avatar
            size={40}
            src={userDetails?.profile || ProfileIcon}
            className="cursor-pointer"
            onClick={onAvatarClick}
            alt="User avatar"
          />
        </Tooltip>
      )}

      {/* Name & role only when sidebar is expanded */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="flex flex-col ml-3 overflow-hidden"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={slideVariants}
            transition={{ duration: 0.2 }}
          >
            <Tooltip title={userDetails?.fullName || "User"}>
              <span className="font-medium leading-tight truncate max-w-[8.5rem]">
                {getTruncatedName(userDetails?.fullName)}
              </span>
            </Tooltip>
            <Tag
              color={getRoleColor(role)}
              className="mt-0.5 text-xs w-min"
              role="status"
            >
              {role?.toUpperCase() || "USER"}
            </Tag>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout button (always visible) */}
      <Tooltip title="Logout">
        <Button
          type="text"
          shape="circle"
          aria-label="Logout"
          icon={<FiLogOut className="text-lg" />}
          className={isOpen ? "ml-auto" : "ml-2"}
          onClick={onLogoutClick}
        />
      </Tooltip>
    </div>
  )
);

ProfileCluster.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  userDetails: PropTypes.object,
  role: PropTypes.string,
  onAvatarClick: PropTypes.func.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
};

ProfileCluster.defaultProps = {
  userDetails: {},
  role: "USER",
};

export default ProfileCluster;
