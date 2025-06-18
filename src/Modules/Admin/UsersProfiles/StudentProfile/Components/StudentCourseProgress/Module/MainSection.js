import React, { useEffect, useState } from "react";
import Chapter from "./Components/Chapter";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { AiOutlineFileSearch } from "react-icons/ai";
import { ChapterSkeleton, ModuleSkeleton } from "../../../../../../Parents/Skeletons";

const MainSection = ({ loading, selectedSemester }) => {
  const { t } = useTranslation("admAccounts");
  const [expandedChapters, setExpandedChapters] = useState(null);
  const [modules, setModules] = useState([]);
  const [seletedModuleId, setSeletedModuleId] = useState();
  const [chapters, setChapters] = useState([]);
  const { cid } = useParams();
  const { courseProgress } = useSelector((store) => store.admin.all_students);
  const dispatch = useDispatch();
  // console.log(courseProgress)
  useEffect(() => {
    if (courseProgress && courseProgress.module && selectedSemester?.id) {
      setModules(courseProgress.module);
      // Optionally set the first module as selected if none is selected yet
      if (
        !seletedModuleId ||
        seletedModuleId !== courseProgress.module[0]?.moduleId
      ) {
        setSeletedModuleId(courseProgress.module[0]?.moduleId || null);
        setChapters(courseProgress?.module[0]?.chapters || []);

      }
    } else {
      setModules([]);
      setSeletedModuleId(null);
    }

  }, [courseProgress]);
  const selectModule = (module) => {
    setSeletedModuleId(module?.moduleId);
    setChapters(module?.chapters || []);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };
  const handleToggle = (id) => {
    if (expandedChapters === id) {
      setExpandedChapters(null);
    } else {
      setExpandedChapters(id);
    }
  };
  return (
    <div className="flex min-h-screen">
      <div className="w-[65%] bg-white p-2 border-l">
        <div className="bg-white p-2 rounded-lg">
          {loading ? (
            <ChapterSkeleton count={3} /> // Use ChapterSkeleton for chapter loading
          ) : chapters?.length > 0 ? (
            <Chapter
              key={0}
              id={chapters[0].chapterId}
              assignments={chapters[0].assignments}
              attachments={chapters[0].attachments}
              quizzes={chapters[0].quizzes}
            />
          ) : (
            <div className="flex justify-center items-center font-bold text-gray-500 my-20 h-full w-full">
              <div className="flex items-center justify-center flex-col text-2xl">
                <AiOutlineFileSearch className="text-[5rem] text-gray-500" />
                {t("No Chapter Found")}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-[35%] p-2 border-l-2">
        <div className="bg-white p-4 rounded-lg">
          <div className="flex items-center gap-1 mb-2">
            <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full p-1 px-2">
              <span className="text-gradient">
                {t("Modules")}: {modules?.length}
              </span>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {loading ? (
              <ModuleSkeleton count={3} /> // Use ModuleSkeleton for module loading
            ) : modules?.map((module, index) => (
              <div
                key={index}
                onClick={() => selectModule(module)}
                className="cursor-pointer"
              >
                <div
                  className={`relative mb-4 border-gradient bg-white rounded-lg shadow-md ${seletedModuleId === module.moduleId
                    ? "border border-pink-500 rounded-lg"
                    : null
                    }`}
                >
                  <img
                    src={module?.thumbnail}
                    alt={module?.name}
                    className="w-full h-36 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h2 className="font-semibold text-lg">{module?.name}</h2>
                    <div className="flex justify-between items-center mt-2">
                      <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full py-1 px-4">
                        <span className="text-gradient">
                          {t("Module")} {index + 1}
                        </span>
                      </p>
                      <div className="flex items-center space-x-2">
                        <FaCheckCircle className="text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;