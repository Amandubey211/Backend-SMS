import React from "react";
import {
  MdOutlineCall,
  MdEmail,
  MdOutlineLocationOn,
  MdOutlinePersonPin,
} from "react-icons/md";
import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";

const ViewDriver = ({ driver }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-center items-center py-3">
        <img
          className="object-cover rounded-full w-[100px] h-[100px]"
          src={driver?.profile || profileIcon}
          alt={driver?.fullName}
        />
        <h3 className="text-lg font-medium">{driver.fullName}</h3>
        {/* <p className="text-gray-500">{helper.email}</p> */}
      </div>
      <div className="flex flex-col gap-4 p-4">
        <InfoItem
          icon={<MdEmail className="text-pink-600 text-2xl" />}
          label="Email"
          value={driver?.email}
        />
        <InfoItem
          icon={<MdOutlineCall className="text-pink-600 text-2xl" />}
          label="Phone"
          value={driver?.contactNumber}
        />
        <InfoItem
          icon={<MdOutlinePersonPin className="text-pink-600 text-2xl" />}
          label="Gender"
          value={driver?.gender}
        />
        <InfoItem
          icon={<MdOutlineLocationOn className="text-pink-600 text-2xl" />}
          label="Address"
          value={driver?.address || "Not Provided"}
        />
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    {icon}
    <div className="flex flex-col">
      <span className="font-medium">{label}</span>
      <span className="text-gray-500 text-sm">{value}</span>
    </div>
  </div>
);

export default ViewDriver;

