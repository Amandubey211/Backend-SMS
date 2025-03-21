import React, { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { CiSearch } from "react-icons/ci";
import { BsPatchCheckFill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { Skeleton, Tooltip as AntTooltip } from "antd";
import { NavLink, useParams } from "react-router-dom";
import NoDataFound from "../../../../../Components/Common/NoDataFound";

/**
 * Utility function to highlight matched text portions
 * indices is an array of [start, end] (inclusive) index pairs
 * from Fuse. We wrap those substrings in <mark>.
 */
function highlightText(text, indices) {
  if (!indices || indices.length === 0) return text; // No highlights
  let lastEnd = 0;
  const highlighted = [];

  // Ensure the matched indices are sorted by starting index
  const sortedIndices = indices.sort((a, b) => a[0] - b[0]);

  sortedIndices.forEach(([start, end], i) => {
    // Normal text before this match
    if (start > lastEnd) {
      highlighted.push(
        <span key={`text-${i}-before`}>{text.slice(lastEnd, start)}</span>
      );
    }
    // Highlighted text
    highlighted.push(
      <mark key={`text-${i}-highlight`}>{text.slice(start, end + 1)}</mark>
    );
    lastEnd = end + 1;
  });

  // Add remaining text after the last match
  if (lastEnd < text.length) {
    highlighted.push(<span key="text-last">{text.slice(lastEnd)}</span>);
  }

  return highlighted;
}

const List = ({
  data,
  icon,
  title,
  type, // "Quiz" or "Assignment"
  loading,
  error,
  getItemName,
  getItemDetails,
  navLinkPath,
}) => {
  const { cid, sid } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  /* ---------------- Fuzzy Search Configuration ---------------- */
  const fuseOptions = {
    threshold: 0.4, // ~ fairly fuzzy
    minMatchCharLength: 2,
    includeMatches: true, // We need match info for highlighting
    distance: 500, // Controls how far the search term can match in text
    keys: [
      {
        name: "name",
        getFn: (item) => getItemName(item),
      },
    ],
  };

  // Prepare Fuse instance
  const fuse = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;
    return new Fuse(data, fuseOptions);
  }, [data, fuseOptions]);

  // Get either the raw data (if no search) or the fuse results
  const results = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    if (!searchQuery.trim()) {
      // No search query -> Return data as-is
      return data.map((item) => ({ item, matches: [] }));
    }
    if (fuse) {
      return fuse.search(searchQuery);
    }
    return [];
  }, [data, searchQuery, fuse]);

  return (
    <div className="bg-white p-2 w-full">
      {/* Always show the header (title + search) */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gradient ps-4">
          {title}
          <span className="border rounded-full text-sm p-1 px-2 ml-1 text-gray-500">
            {results?.length || 0}
          </span>
        </h2>

        {/* Search Bar */}
        <div className="relative flex items-center max-w-xs w-full mr-4">
          <input
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
          />
          <button className="absolute right-3">
            <CiSearch className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* If loading, show skeleton placeholders in place of items */}
      {loading && (
        <ul className="border-t p-4">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="flex items-center mb-3 gap-3 p-1 rounded-lg">
              {/* Left icon skeleton */}
              <Skeleton.Avatar active size="large" shape="circle" />

              {/* Middle + right skeleton */}
              <div className="flex justify-between w-full px-2 items-start">
                <div className="flex flex-col gap-1 justify-center flex-grow">
                  {/* Title + subtitle skeleton */}
                  <Skeleton
                    active
                    title={{ width: "60%" }}
                    paragraph={{ rows: 1, width: ["80%"] }}
                  />
                </div>
                {/* Published check skeleton */}
                <Skeleton.Avatar active size="default" shape="circle" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* If not loading, check for error or no data found */}
      {!loading && (error || results?.length === 0) ? (
        <div className="h-full w-full flex justify-center items-center py-10">
          <NoDataFound title={type === "Assignment" ? "Assignment" : "Quiz"} />
        </div>
      ) : null}

      {/* Actual List Items (only if not loading and we have data) */}
      {!loading && !error && results?.length > 0 && (
        <ul className="border-t p-4">
          {results.map((res, index) => {
            // Each res is { item, matches, score, refIndex }
            const { item, matches } = res;
            const originalName = getItemName(item);

            // 1) Find the match object for "name" key
            const nameMatch = matches?.find((m) => m.key === "name");
            // 2) If found, highlight the matched text
            const highlightedName = nameMatch
              ? highlightText(originalName, nameMatch.indices)
              : originalName;

            return (
              <NavLink
                to={navLinkPath(cid, sid, item)}
                key={item._id || item.assignmentId || index}
                className="flex items-center mb-3 gap-3 p-1 rounded-lg"
              >
                {/* Left Icon */}
                <div className="text-green-600 p-2 border rounded-full">
                  {icon}
                </div>

                {/* Title + Subtitle + Published Check */}
                <div className="flex justify-between w-full px-2 items-start">
                  <div className="flex flex-col gap-1 justify-center flex-grow">
                    <h3 className="text-md font-semibold mb-1">
                      {/* Render the highlighted text or normal text */}
                      {highlightedName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getItemDetails(item)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* For a potential "completed" status, you could do: 
                      {item.completed ? (
                        <BsPatchCheckFill className="text-green-600 p-1 border rounded-full h-7 w-7" />
                      ) : (
                        <AiOutlineClose className="text-red-600 p-1 border rounded-full h-7 w-7" />
                      )}
                    */}
                    <AntTooltip title="Published">
                      <BsPatchCheckFill className="text-green-600 p-1 border rounded-full h-7 w-7" />
                    </AntTooltip>
                  </div>
                </div>
              </NavLink>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default List;
