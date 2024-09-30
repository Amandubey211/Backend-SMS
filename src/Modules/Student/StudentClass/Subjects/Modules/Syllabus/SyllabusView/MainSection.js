// MainSection.js
import React, { useEffect } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import SyllabusHeader from "./Components/SyllabusHeader";
import SyllabusSection from "./Components/SyllabusSection";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AiOutlineFileAdd } from "react-icons/ai";
import useFetchSyllabus from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Syllabus/useFetchSyllabus";
import Spinner from "../../../../../../../Components/Common/Spinner";
import { stdSyllabus } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Syllabus/syllabus.action";
import { GoAlertFill } from "react-icons/go";
import NoDataFound from "../../../../../../../Components/Common/NoDataFound";
import { useTranslation } from "react-i18next";

const MainSection = () => {
  const { loading, error, syllabusData } = useSelector((store) => store?.student?.studentSyllabus);
  const dispatch = useDispatch();
  const { cid, sid } = useParams();
 

  console.log("use param in syllabus:===>",cid,sid)
  useEffect(() => {
    dispatch(stdSyllabus({ classId: cid, subjectId: sid }));
  }, [dispatch,cid,sid]);

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-full border-l pt-2">
        <SyllabusHeader />
        <div className="w-full p-4">
          {loading ? (
            <div className="w-full flex flex-col items-center justify-center py-20">
              <Spinner />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <GoAlertFill className="inline-block w-12 h-12 mb-3" />
              <p className="text-lg font-semibold">{error}</p>
            </div>
          ) : syllabusData?.length > 0 ? (
            <div>
              {syllabusData?.map((syllabusItem) => (
                <SyllabusSection key={syllabusItem?._id} syllabus={syllabusItem} />
              ))}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-20">
              <NoDataFound title="Syllabus" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainSection;
