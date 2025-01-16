import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubjectSideBar from "../../Component/SubjectSideBar";
import PageHeader from "./Components/PageHeader";
import PageCard from "./Components/PageCard";
import { MdSearchOff } from "react-icons/md"; // Importing the icon for search-related actions
import { FaRegFileAlt } from "react-icons/fa"; // Better icon for pages placeholder
import Spinner from "../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../Components/Common/NoDataFound";
import { fetchAllPages } from "../../../../../Store/Slices/Admin/Class/Page/pageThunk";
import { useParams } from "react-router-dom";

const MainSection = () => {
  const dispatch = useDispatch();
  const { loading, error, pages } = useSelector((state) => state.admin.pages);
  const [searchQuery, setSearchQuery] = useState("");

  const { cid } = useParams();

  useEffect(() => {
    if (cid) {
      dispatch(fetchAllPages({ cid }));
    }
  }, [dispatch, cid]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPages = pages?.filter(
    (page) =>
      page?.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      page?.authorName?.toLowerCase()?.includes(searchQuery.toLowerCase())
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
          {loading && <Spinner />}

          {!loading && error && (
            <div className="flex flex-col h-96 w-full items-center justify-center text-gray-500">
              <NoDataFound
                title="Pages"
                desc="An error occurred while fetching pages. Please try again later."
                icon={MdSearchOff}
                iconColor="text-red-500"
                textColor="text-gray-500"
              />
            </div>
          )}

          {!loading && !error && pages?.length === 0 && (
            <div className="flex flex-col h-96 w-full items-center justify-center text-gray-500">
              <NoDataFound
                title="Pages"
                desc="No pages available. Please add your first page."
                icon={FaRegFileAlt}
                iconColor="text-blue-500"
                textColor="text-gray-500"
              />
            </div>
          )}

          {!loading &&
            !error &&
            pages?.length > 0 &&
            filteredPages?.length === 0 &&
            searchQuery !== "" && (
              <div className="flex flex-col h-96 w-full items-center justify-center text-gray-500">
                <MdSearchOff className="w-12 h-12 mb-3" />
                <p className="text-lg font-semibold">No pages found</p>
              </div>
            )}

          {!loading && !error && filteredPages?.length > 0 && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPages?.map((page) => (
                <PageCard
                  key={page._id}
                  id={page._id}
                  title={page.title}
                  authorName={page.authorName}
                  publishDate={page.createdAt}
                  updateDate={page.updatedAt}
                  publish={page.publish}
                  onDeleteSuccess={() => dispatch(fetchAllPages({ cid }))}
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
