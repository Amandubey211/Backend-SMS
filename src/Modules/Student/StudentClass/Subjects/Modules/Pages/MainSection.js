import React, { useState, useEffect } from "react";
import PageCard from "./Components/PageCard";
import PageHeader from "./Components/PageHeader";
import { MdKeyboardArrowDown } from "react-icons/md";
import { GoDiscussionClosed } from "react-icons/go";
import SubjectSideBar from "../../Component/SubjectSideBar";
import useFetchAllPages from "../../../../../../Hooks/AuthHooks/Student/Page/useFetchAllPages";

const MainSection = () => {
  const { loading, error, fetchAllPages, pages } = useFetchAllPages();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAllPages();
  }, [fetchAllPages]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-full p-3 border-l">
        <PageHeader searchQuery={searchQuery} handleSearchChange={(e) => handleSearch(e.target.value)} />
        <div className="p-3">
          <div className="flex items-center gap-2 ml-3 mb-2">
            <GoDiscussionClosed className="text-xl text-green-600" />
            <h2 className="text-xl"> All Pages</h2>
            <MdKeyboardArrowDown className="text-gray-500 h-8 w-8" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && filteredPages.length === 0 && (
              <div className="flex flex-col h-96 w-full items-center justify-center text-gray-500">
                <GoDiscussionClosed className="w-12 h-12 mb-3" />
                <p className="text-lg font-semibold">No pages found</p>
              </div>
            )}
            {!loading && !error && filteredPages.length > 0 && (
              filteredPages.map((page) => (
                <PageCard
                  key={page._id}
                  id={page._id}
                  title={page.title}
                  authorName={page.authorName}
                  publishDate={page.createdAt}
                  updateDate={page.updatedAt}
                  readOnly
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
