import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Components/Header";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import useFetchPageById from "../../../../../../../Hooks/AuthHooks/Student/Page/useFetchPageById";
import Spinner from "../../../../../../../Components/Common/Spinner";

const MainSection = () => {
  const { pid: pageId } = useParams();
  const { loading, error, fetchPageById, page } = useFetchPageById(pageId);

  useEffect(() => {
    fetchPageById();
  }, [fetchPageById]);

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="border-l w-full">
        <Header title={page?.title} lastEdit={page?.updateDate} />
        <div className="p-6 bg-white">
          {loading && <Spinner />}
          {error && <p>{error.message}</p>}
          {page && (
            <>
              <h1 className="text-3xl font-semibold mb-4">{page.title}</h1>
              <div
                className="text-gray-700 mb-6"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainSection;
