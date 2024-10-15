import React, { useState, useEffect } from "react";
import PageCard from "./Components/PageCard";
import PageHeader from "./Components/PageHeader";
import { MdKeyboardArrowDown } from "react-icons/md";
import { GoDiscussionClosed } from "react-icons/go";
import SubjectSideBar from "../../Component/SubjectSideBar";
import useFetchAllPages from "../../../../../../Hooks/AuthHooks/Student/Page/useFetchAllPages";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import { useDispatch, useSelector } from "react-redux";
import { stdPages } from "../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Pages/pages.action";
import { useParams } from "react-router-dom";

const MainSection = () => {
  const { loading, error, pagesData } = useSelector((store) => store?.student?.studentPages);
  // const { fetchAllPages, pages } = useFetchAllPages();
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const { cid } = useParams();
  useEffect(() => {
    dispatch(stdPages({ classId:cid }))
    // fetchAllPages();
  }, [dispatch]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredPages = pagesData?.filter((page) =>
    page?.title?.toLowerCase()?.includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-full p-3 border-l flex flex-col">
        <PageHeader
          searchQuery={searchQuery}
          handleSearchChange={(e) => handleSearch(e.target.value)}
        />
        <div className="p-3 flex-grow flex flex-col">
          <div className="flex items-center gap-2 ml-3">
            <GoDiscussionClosed className="text-xl text-green-600" />
            <h2 className="text-xl">All Pages</h2>
            <MdKeyboardArrowDown className="text-gray-500 h-8 w-8" />
          </div>
          <div className="flex-grow flex justify-center items-start my-10">
            {loading && <Spinner />}
            {error && <p>{error}</p>}
            {!loading && !error && filteredPages.length === 0 && (
              <NoDataFound title="Pages" />
            )}
            {!loading && !error && filteredPages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full ">
                {filteredPages?.map((page) => (
                  <PageCard
                    key={page?._id}
                    id={page?._id}
                    title={page?.title}
                    authorName={page?.authorName}
                    publishDate={page?.createdAt}
                    updateDate={page?.updatedAt}
                    readOnly
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
