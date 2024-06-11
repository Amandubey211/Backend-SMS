import React from "react";
import { users } from "./Dummydata/avatarlistdata";

const AvatarsList = () => {
  return (
    <div className="flex items-center justify-center ">
      <div className="flex items-center bg-white  rounded-full px-4 py-1 border">
        {users.map((user, index) => (
          <div
            key={user.id}
            className={`w-7 h-7 rounded-full overflow-hidden border-2 border-white ${
              index !== 0 ? "-ml-2" : ""
            } z-${10 + index}`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className=" rounded-full flex items-center justify-center border border-red-400  p-1   -ml-2 z-0">
          <span className="text-xs text-gradient font-semibold">20+</span>
        </div>
      </div>
    </div>
  );
};

export default AvatarsList;
