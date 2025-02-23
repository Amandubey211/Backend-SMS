import React, { useState } from "react";
import StudentDiwanLogo from "../../Assets/HomeAssets/StudentDiwanLogo.png";
import StudentDiwanLogoVid from "../../Assets/LoadingScreen/StudentDiwanLoadingScreenVid.mp4";

const Fallback = () => {
  const [videoFinished, setVideoFinished] = useState(false);

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-black">
      {!videoFinished ? (
        <video
          src={StudentDiwanLogoVid}
          className="w-full h-full object-cover"
          autoPlay
          muted
          onEnded={() => setVideoFinished(true)}
        />
      ) : (
        <img src={StudentDiwanLogo} className="h-20" alt="Student Diwan" />
      )}
    </div>
  );
};

export default Fallback;
