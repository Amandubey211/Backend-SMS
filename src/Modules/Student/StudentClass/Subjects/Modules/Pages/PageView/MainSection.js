import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Components/Header";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import Spinner from "../../../../../../../Components/Common/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchPageView } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Pages/pages.action";

const MainSection = () => {
  const { pid} = useParams();
  const dispatch  = useDispatch()
  const { loading, pageView } = useSelector((store) => store?.student?.studentPages);
  useEffect(() => {
   dispatch(fetchPageView(pid))
  }, [dispatch]);

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="border-l w-full">
        <Header title={pageView?.title} lastEdit={pageView?.updateDate} />
        <div className="p-6 bg-white">
          {loading && <Spinner />}
             {pageView  && (
            <>
              <h1 className="text-3xl font-semibold mb-4">{pageView?.title}</h1>
              <div
                className="text-gray-700 mb-6"
                dangerouslySetInnerHTML={{ __html: pageView?.content }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainSection;
