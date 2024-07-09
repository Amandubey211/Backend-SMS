import React from 'react';

import {AiOutlineRight} from "react-icons/ai"
import {BsLightningFill} from "react-icons/bs"
const SpeedGradeButton = () => (
  <button
    className="flex items-center justify-center w-full mt-4 py-2 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
    aria-label="Speed Grade"
  >
    <BsLightningFill className="mr-2" aria-hidden="true" />
    <span>Speed Grade</span>
    <AiOutlineRight className="ml-2" aria-hidden="true" />
  </button>
);

export default SpeedGradeButton;
