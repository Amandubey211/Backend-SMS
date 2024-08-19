import React from "react";
import LibraryTable from "../../../Components/Parents/Libary/LibraryList";

const ParentSection = () => {
  return (
    <div className="h-full  w-full">
      <div className=" w-full">
        
        
        <div className="flex flex-wrap justify-between items-start  border-y">
          <div className="w-full  border-r" >
            <LibraryTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentSection;
