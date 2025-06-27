import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import ClassTimeTable from "../../../Admin/TimeTables/AutomaticTimeTable/components/ClassTimeTable";


const MainSection = () => {
    const { userDetails } = useSelector((state) => state?.common?.user);
    const { sectionsList } = useSelector((state) => state?.admin?.group_section);
    // console.log("User Details:", userDetails);
    // Extract classId and sectionId from userDetails
    const classId = userDetails?.classId;
    const sectionId = userDetails?.sectionId;

    return (
        <div className="p-4 space-y-4">
            {/* Render ClassTimeTable with classId and sectionId from userDetails */}
            {sectionsList?.length >= 1 ? classId && sectionId && (
                <ClassTimeTable
                    selectedClass={classId}
                    selectedSection={sectionId}
                />
            ) : classId && (
                <ClassTimeTable
                    selectedClass={classId}
                    selectedSection={sectionId}
                />
            )}
        </div>
    );
};

export default MainSection;