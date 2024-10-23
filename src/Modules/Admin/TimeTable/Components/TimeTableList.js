import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactDataGrid from "react-data-grid";
import { deleteTimetable } from "../../../../Store/Slices/Admin/TimeTable/timetable.action";
import Spinner from "../../../../Components/Common/Spinner"; // Assuming you have a Spinner component

const PAGE_SIZE = 10; // Number of rows per page

const TimeTableList = () => {
  const dispatch = useDispatch();

  const { timetables, loading, error } = useSelector((state) => state.admin.timetable);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [sortColumn, setSortColumn] = useState(null); // For sorting
  const [sortDirection, setSortDirection] = useState(null);

  // Ensure that rows are always an array, fallback to empty array if timetables is undefined
  const rows = Array.isArray(timetables) ? timetables : [];

  // Sorting logic
  const handleSort = (columnKey, direction) => {
    setSortColumn(columnKey);
    setSortDirection(direction);
    const sortedRows = [...rows].sort((a, b) => {
      if (direction === "ASC") {
        return a[columnKey] > b[columnKey] ? 1 : -1;
      } else if (direction === "DESC") {
        return a[columnKey] < b[columnKey] ? 1 : -1;
      }
      return 0;
    });
    return sortedRows; // Returning the sorted rows
  };

  // Filtering logic
  const handleFilterChange = (columnKey, value) => {
    const newFilters = { ...filters, [columnKey]: value };
    setFilters(newFilters);
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      return Object.keys(filters).every((key) => {
        return String(row[key]).toLowerCase().includes(String(filters[key]).toLowerCase());
      });
    });
  }, [rows, filters]);

  // Pagination logic
  const paginatedRows = useMemo(() => {
    const startRow = (currentPage - 1) * PAGE_SIZE;
    const endRow = startRow + PAGE_SIZE;
    return filteredRows.slice(startRow, endRow);
  }, [currentPage, filteredRows]);

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);

  // Define columns for ReactDataGrid with filters and sorting
  const columns = [
    {
      key: "name",
      name: "Name",
      editable: true,
      filterRenderer: (props) => (
        <input
          type="text"
          placeholder="Filter by Name"
          onChange={(e) => handleFilterChange("name", e.target.value)}
          value={filters.name || ""}
          style={{ padding: "5px 10px", border: "1px solid #ccc", borderRadius: "4px", width: "150px" }}
        />
      ),
      sortable: true,
    },
    {
      key: "type",
      name: "Type",
      editable: true,
      filterRenderer: (props) => (
        <select
          onChange={(e) => handleFilterChange("type", e.target.value)}
          value={filters.type || ""}
          style={{ padding: "5px 10px", border: "1px solid #ccc", borderRadius: "4px", width: "150px" }}
        >
          <option value="">All Types</option>
          <option value="exam">Exam</option>
          <option value="event">Event</option>
          <option value="weekly">Weekly</option>
        </select>
      ),
      sortable: true,
    },
    {
      key: "status",
      name: "Status",
      editable: true,
      filterRenderer: (props) => (
        <select
          onChange={(e) => handleFilterChange("status", e.target.value)}
          value={filters.status || ""}
          style={{ padding: "5px 10px", border: "1px solid #ccc", borderRadius: "4px", width: "150px" }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      ),
      sortable: true,
    },
    {
      key: "actions",
      name: "Actions",
      formatter: ({ row }) => (
        <button
          className="bg-red-500 text-white px-2 py-1 rounded-md"
          onClick={() => handleDelete(row._id)}
        >
          Delete
        </button>
      ),
    },
  ];

  // Handle delete
  const handleDelete = (id) => {
    dispatch(deleteTimetable(id));
  };

  // Return loading, error, or table after hooks are defined
  return (
    <>
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="text-red-500">Failed to load timetables: {error}</p>
      ) : rows.length === 0 ? (
        <p>No timetables available.</p>
      ) : (
        <>
          {/* Filter Section */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input
              type="text"
              style={{ padding: "5px 10px", border: "1px solid #ccc", borderRadius: "4px", width: "150px" }}
              placeholder="Filter by Name"
              onChange={(e) => handleFilterChange("name", e.target.value)}
            />
            <select
              style={{ padding: "5px 10px", border: "1px solid #ccc", borderRadius: "4px", width: "150px" }}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="">All Types</option>
              <option value="exam">Exam</option>
              <option value="event">Event</option>
              <option value="weekly">Weekly</option>
            </select>
            <select
              style={{ padding: "5px 10px", border: "1px solid #ccc", borderRadius: "4px", width: "150px" }}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              style={{
                backgroundColor: "#1d72b8",
                color: "white",
                padding: "6px 12px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Apply Filters
            </button>
          </div>

          {/* Data Grid Section */}
          <div style={{ height: 400 }}>
            <ReactDataGrid
              columns={columns}
              rows={paginatedRows} // Display the paginated rows
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={(columnKey, direction) => handleSort(columnKey, direction)} // Sorting logic
            />
            <div className="pagination-controls mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 bg-gray-300 rounded-md"
              >
                Previous
              </button>
              <span className="mx-2">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 bg-gray-300 rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TimeTableList;
