import { Skeleton } from "antd";

const SkeletonLoader = ({ rows = 5, columns = 3, columnWidths = [] }) => {
  return (
    <div style={{ padding: 10, background: "#fff", width: "100%" }}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:"center",
            padding: "12px 0",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              style={{
                flex: columnWidths[colIndex] || 1,
                padding: "0 8px",
              }}
            >
              <Skeleton.Input active size="small" style={{ width: "100%" }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;