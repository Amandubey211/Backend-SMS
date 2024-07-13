import React, { useEffect, useState } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import PageHeader from "./Components/PageHeader";
import useFetchAllPages from "../../../../../Hooks/AuthHooks/Staff/Admin/Page/useFetchAllPages";
import PageCard from "./Components/PageCard";
import { MdSearchOff } from "react-icons/md"; // Importing the icon

const MainSection = () => {
  const { loading, error, fetchAllPages, pages } = useFetchAllPages();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAllPages();
  }, [fetchAllPages]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="p-5 w-full border-l">
        <PageHeader
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
        />
        <div className="mt-5">
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && filteredPages.length === 0 && (
            <div className="flex flex-col h-96 w-full items-center justify-center text-gray-500">
              <MdSearchOff className="w-12 h-12 mb-3" />
              <p className="text-lg font-semibold">No pages found</p>
            </div>
          )}
          {!loading && !error && filteredPages.length > 0 && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPages.map((page) => (
                <PageCard
                  key={page._id}
                  id={page._id}
                  title={page.title}
                  authorName={page.authorName}
                  publishDate={page.createdAt}
                  updateDate={page.updatedAt}
                  onDeleteSuccess={fetchAllPages} // Pass the refetch function
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainSection;
