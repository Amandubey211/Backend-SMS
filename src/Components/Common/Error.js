import React from "react";
import CommingSoon from "../../Assets/ErrorPageAsset/CommingSoon.webp"
import { useNavigate } from "react-router-dom";
const Error = () => {
  const navigate = useNavigate()
  return (
    <div className="h-screen w-screen flex flex-col gap-2  bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500  justify-center items-center">
      {/* <h1>404 page not found</h1> */}
      <h1 className="text-3xl font-semibold text-white"> Page is Under Development</h1>
      <img alt="under Development" className=" object-cover h-96 rounded-lg" src={CommingSoon}/>
      <button className="p-2 px-6 rounded-md shadow-xl border" onClick={()=>navigate(-1)}>
go Back
      </button>

    </div>
  );
};

export default Error;

