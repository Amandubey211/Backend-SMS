import React, { useState } from "react";
import StudentDiwanLogo from "../../Assets/HomeAssets/StudentDiwanLogo.png";
import FallbackLogo from "../../Assets/HomeAssets/StudentDiwanLogo.png";

const Logo = ({ height }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div>
      <img
        alt="logo"
        src={hasError ? FallbackLogo : StudentDiwanLogo}
        className={height ? height : "h-10"}
        loading="lazy" // Browser-level lazy loading
        onError={() => setHasError(true)} // Handle broken image links
      />
    </div>
  );
};

export default Logo;
