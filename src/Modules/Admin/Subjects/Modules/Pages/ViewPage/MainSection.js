import React, { useEffect, useCallback } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import ViewPageHeader from "./ViewPageHeader";
import useFetchPageById from "../../../../../../Hooks/AuthHooks/Staff/Admin/Page/useFetchPageById";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";

const MainSection = () => {
  const { error, fetchPageById, loading, page } = useFetchPageById();

  // Callback function to refetch the page
  const handleRefetchPage = useCallback(() => {
    fetchPageById();
  }, [fetchPageById]);

  useEffect(() => {
    fetchPageById();
  }, [fetchPageById]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <NoDataFound />;
  }

  return (
    <div className="w-full flex">
      <SubjectSideBar />
      <div className="w-full border-l">
        {page && (
          <>
            <ViewPageHeader
              title={page.title}
              LastEdit={page.updatedAt}
              page={page}
              refetchPage={handleRefetchPage} // Pass the refetch function
            />
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
