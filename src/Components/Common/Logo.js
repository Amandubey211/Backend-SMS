import React from "react";
import StudentDiwanLogoogo from "../../Assets/HomeAssets/StudentDiwanLogo.png";
const Logo = ({ height }) => {
  return (
    <div>
      <img
        alt="logo"
        src={StudentDiwanLogoogo}
        className={height ? height : "h-10"}
      />
    </div>
  );
};

export default Logo;
