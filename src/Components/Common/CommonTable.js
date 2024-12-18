import React from "react";
import { Table } from "antd";

/**
 * CommonTable Component
 * 
 * A reusable and fully configurable table component based on Ant Design's Table.
 * 
 * Props:
 *  - data: Array of objects representing table data.
 *  - columns: Array of column definitions for the table.
 *  - pagination: Object for pagination configuration (optional).
 *  - rowSelection: Object for row selection configuration (optional).
 *  - rowKey: String representing the unique row key (default: "key").
 *  - onRowClick: Function called on row click (optional).
 *  - scroll: Object for scroll configuration (optional).
 *  - loading: Boolean for table loading state (optional).
 *  - bordered: Boolean to show/hide table borders (default: false).
 *  - size: Table size ("default", "middle", "small") (optional).
 *  - showHeader: Boolean to show/hide table headers (default: true).
 *  - expandable: Object for row expand/collapse functionality (optional).
 *  - customHeader: Function for rendering custom headers (optional).
 * 
 */

const CommonTable = ({
  data = [],
  columns = [],
  pagination = { pageSize: 10 },
  rowSelection = null,
  rowKey = "key",
  onRowClick = null,
  scroll = null,
  loading = false,
  bordered = false,
  size = "default",
  showHeader = true,
  expandable = null,
  customHeader = null,
  onChange = null, // For handling table changes (sort, filter, pagination)
}) => {
  // Apply row click handler if provided
  const rowProps = onRowClick
    ? (record) => ({
        onClick: () => onRowClick(record),
      })
    : undefined;

  return (
    <Table
      dataSource={data}
      columns={columns.map((col) => ({
        ...col,
        sorter: col.sorter || false, // Allow optional sorting
        filters: col.filters || null, // Allow optional filtering
        onHeaderCell: customHeader
          ? () => ({ className: "custom-header" }) // Custom header class if defined
          : undefined,
      }))}
      pagination={pagination}
      rowSelection={rowSelection}
      rowKey={rowKey}
      onRow={rowProps}
      scroll={scroll}
      loading={loading}
      bordered={bordered}
      size={size}
      showHeader={showHeader}
      expandable={expandable}
      onChange={onChange}
    />
  );
};

export default CommonTable;



// Props Recap
// Prop	Type	Description
// data	Array	Table data source.
// columns	Array	Column configurations (sort, filter, etc).
// pagination	Object / Boolean	Pagination settings (default: 10 rows).
// rowSelection	Object / null	Enables row selection (optional).
// rowKey	String	Key for table rows (default: "key").
// onRowClick	Function	Callback for row clicks.
// scroll	Object	Scroll configuration (e.g., x or y).
// loading	Boolean	Loading indicator.
// bordered	Boolean	Adds table borders.
// size	String	Table size (default, middle, small).
// showHeader	Boolean	Show/hide table headers.
// expandable	Object	Expandable row configurations.
// customHeader	Function	Custom header styling or rendering.
// onChange	Function	Handles table changes like sort, filter.