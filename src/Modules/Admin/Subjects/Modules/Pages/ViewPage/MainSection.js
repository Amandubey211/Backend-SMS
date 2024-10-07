import React, { useEffect, useCallback } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import ViewPageHeader from "./ViewPageHeader";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import { useParams } from "react-router-dom";
import { fetchPageById } from "../../../../../../Store/Slices/Admin/Class/Page/pageThunk";

const MainSection = () => {
  const dispatch = useDispatch();
  const { error, loading, page } = useSelector((state) => state.admin.pages);
  const { pid } = useParams();
  // Callback function to refetch the page
  const handleRefetchPage = useCallback(() => {
    dispatch(fetchPageById({ pid }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPageById({ pid }));
  }, [dispatch]);

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
              // refetchPage={handleRefetchPage} // Pass the refetch function
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
