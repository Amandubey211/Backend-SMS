import React, { useEffect } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import ViewPageHeader from "./ViewPageHeader";
import useFetchPageById from "../../../../../../Hooks/AuthHooks/Staff/Admin/Page/useFetchPageById";

const MainSection = () => {
  const { error, fetchPageById, loading, page } = useFetchPageById();

  useEffect(() => {
    fetchPageById();
  }, [fetchPageById]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="w-full flex">
      <SubjectSideBar />
      <div className="w-full border-l">
        {page && (
          <>
            <ViewPageHeader title={page.title} LastEdit={page.updatedAt} page={page} />
            <div
              className="p-4"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MainSection;
