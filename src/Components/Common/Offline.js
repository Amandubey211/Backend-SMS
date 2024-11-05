// import React from "react";
// import { MdError } from "react-icons/md"; // Import the error icon from react-icons

// const OfflineModal = ({ error, onDismiss }) => {
//   return (
//     <div className="fixed top-0 left-0 right-0 z-[100000] bg-red-100 border border-red-400 text-red-700 px-4 py-3 flex items-center justify-between">
//       <div className="flex items-center">
//         <MdError className="text-red-600 mr-2" size={24} /> {/* Error icon */}
//         <span className="block">{error}</span>
//       </div>
//       <button
//         className="px-2 text-red-700 hover:text-red-900 text-2xl"
//         onClick={onDismiss}
//       >
//         &times; {/* Close icon */}
//       </button>
//     </div>
//   );
// };

// export default OfflineModal;

import React from "react";
import { MdError } from "react-icons/md"; // Import the error icon from react-icons

const OfflineModal = ({ error, onDismiss }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100000] bg-red-100 border border-red-400 text-red-700 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <MdError className="text-red-600 mr-2" size={24} /> {/* Error icon */}
        <span className="block">{error ||'Something is wrong'}</span>
      </div>
      <button
        className="px-2 text-red-700 hover:text-red-900 text-2xl"
        onClick={onDismiss}
      >
        &times; {/* Close icon */}
      </button>
    </div>
  );
};

export default OfflineModal;
