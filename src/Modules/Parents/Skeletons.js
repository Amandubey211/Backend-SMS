import React from 'react';
import { Skeleton } from 'antd';

export const EventCardSkeleton = ({ count = 0 }) => {
    return (
        <div className="my-4 w-full h-40 flex gap-8 pl-8 relative">
            {Array(count).fill("").map((_, i) => (
                <Skeleton.Button
                    key={i}
                    active
                    shape="default" // 'default' = square corners
                    style={{ width: "200px", height: "170px", borderRadius: "20px" }}
                    className="rounded-xl p-4" // Adjust to match your card's size
                />
            ))}
        </div>
    );
};
export const FinanceTableSkeleton = () => (
    <div className="p-4 w-full">
      {/* Table Skeleton */}
      <div className="rounded-lg w-full border border-gray-200">
        <table className="w-full table-fixed leading-normal">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#e5e5e5] text-gray-700">
              {["Fee Type", "Paid By", "Due Date", "Amount", "Status", "Action"].map((col, index) => (
                <th key={index} className="px-5 py-3 border-b border-gray-200 font-normal w-1/6 text-center">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
  
          {/* Table Body Skeleton Rows */}
          <tbody>
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex} className="text-left text-gray-700 bg-white shadow-sm hover:bg-gray-100 transition-colors duration-200">
                {/* Fee Type */}
                <td className="px-5 py-4 border-b border-gray-200 text-center">
                  <Skeleton.Input active size="small" style={{ width: "70%", height: "16px" }} />
                </td>
  
                {/* Paid By */}
                <td className="px-5 py-4 border-b border-gray-200 text-center">
                  <Skeleton.Input active size="small" style={{ width: "60%", height: "16px" }} />
                </td>
  
                {/* Due Date */}
                <td className="px-5 py-4 border-b border-gray-200 text-center">
                  <Skeleton.Input active size="small" style={{ width: "50%", height: "16px" }} />
                </td>
  
                {/* Amount */}
                <td className="px-5 py-4 border-b border-gray-200 text-center">
                  <Skeleton.Input active size="small" style={{ width: "40%", height: "16px" }} />
                </td>
  
                {/* Status (Small Rounded Tag) */}
                <td className="px-5 py-4 border-b border-gray-200 text-center">
                  <Skeleton.Button active size="small" shape="round" style={{ width: 80, height: 24, borderRadius: 16 }} />
                </td>
  
                {/* Action (Rounded Button) */}
                <td className="px-5 py-4 border-b border-gray-200 text-center">
                  <Skeleton.Button active size="small" shape="round" style={{ width: 100, height: 32, borderRadius: 20 }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

export const ThreeRectCardSkeleton = () => {
    return (
        <div className="attendance-card-wrapper">
            <div className="flex gap-4">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-white rounded shadow p-4 flex-1">
                        <Skeleton active paragraph={{ rows: 1 }} />
                    </div>
                ))}
            </div>
        </div>
    );
};


export const ChildCardSkeleton = ({ count }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(count)].map((_, index) => (
                <div
                    key={index}
                    className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center"
                    style={{
                        minHeight: "270px", // Adjusted to match real card
                        maxWidth: "100%",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {/* Profile Image */}
                    <Skeleton.Avatar active size={90} shape="circle" />

                    {/* Name */}
                    <Skeleton.Input active size="small" style={{ width: "55%", marginTop: "12px" }} />

                    {/* Class, ID, Section, Group */}
                    <div className="flex justify-center mt-2 space-x-3">
                        <Skeleton.Input active size="small" style={{ width: "20%" }} />
                        <Skeleton.Input active size="small" style={{ width: "15%" }} />
                        <Skeleton.Input active size="small" style={{ width: "20%" }} />
                        <Skeleton.Input active size="small" style={{ width: "20%" }} />
                    </div>

                    {/* Buttons (INSTRUCTORS, GRADES, ATTENDANCE) */}
                    <div className="flex justify-center mt-4 space-x-4">
                        <Skeleton.Button active size="small" shape="round" style={{ width: 110, height: 40, borderRadius: "8px" }} />
                        <Skeleton.Button active size="small" shape="round" style={{ width: 110, height: 40, borderRadius: "8px" }} />
                        <Skeleton.Button active size="small" shape="round" style={{ width: 110, height: 40, borderRadius: "8px" }} />
                    </div>

                    {/* Big Button (CHECK SUBJECT PROGRESS) */}
                    <div className="flex justify-center mt-5">
                        <Skeleton.Button active size="large" shape="round" style={{ width: 190, height: 30, borderRadius: "12px" }} />
                    </div>
                </div>
            ))}
        </div>
    );
};



export const ParentDashcard = () => {
  return (
    <div className="relative flex flex-col items-center justify-center w-[150px] p-2 rounded-lg shadow-sm bg-gray-100 animate-pulse">
      {/* Hex-shaped placeholder for icon */}
      <div
        className="w-10 h-10 mb-2 bg-gray-300"
        style={{
          clipPath:
            "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        }}
      />
      {/* Skeleton text lines */}
      <Skeleton
        active
        title={false}
        paragraph={{
          rows: 2,
          width: ["60%", "80%"],
        }}
        className="w-full"
      />
    </div>
  );
};


export const DashMyChildrenSkeleton = () => (
    <div className="relative p-4 pb-4 pt-6 text-center border border-gray-200 rounded-lg w-full max-w-md mx-auto bg-white">

        {/* Child Label Skeleton */}
        <div className="absolute top-2 left-2">
            <Skeleton.Input active size="small" style={{ width: 60, height: 20, borderRadius: 4 }} />
        </div>

        {/* Profile Picture Skeleton */}
        <div className="flex justify-center mt-4">
            <Skeleton.Avatar active size={80} shape="circle" />
        </div>

        {/* Name Skeleton */}
        <div className="mt-4">
            <Skeleton.Input active size="small" style={{ width: 120, height: 20, borderRadius: 4 }} />
        </div>

        {/* Class, ID, Section Skeleton */}
        <div className="mt-2">
            <Skeleton.Input active size="small" style={{ width: 220, height: 15, borderRadius: 4 }} />
        </div>

        {/* Group Skeleton */}
        <div className="mt-2">
            <Skeleton.Input active size="small" style={{ width: 100, height: 15, borderRadius: 4 }} />
        </div>
    </div>
);


export const DashNoticeSkeleton = () => (
    <div className="p-4 w-full">
        {/* Notice Item */}
        <div className="flex items-start gap-4 p-4 border-b w-full">
            {/* Notice Icon (Increased Size & Rounded Corners) */}
            <Skeleton.Avatar active size={60} shape="square" style={{ borderRadius: 12 }} />

            {/* Notice Content */}
            <div className="flex-1 space-y-3">
                {/* Title + Author (Aligned Horizontally) */}
                <div className="flex items-center justify-between">
                    <Skeleton.Input active size="small" style={{ width: "50%" }} />
                    <Skeleton.Input active size="small" style={{ width: "30%" }} />
                </div>

                {/* Date & Priority (Aligned Inline) */}
                <div className="flex items-center gap-3">
                    <Skeleton.Input active size="small" style={{ width: "40%" }} />
                    <Skeleton.Button active size="small" shape="round" style={{ width: 100 }} />
                </div>

                {/* Notice Description */}
                <Skeleton paragraph={{ rows: 1, width: ["70%"] }} active />
            </div>
        </div>
    </div>
);

export const SubjectCardSkeleton = ({ subjectCount = 5, chapterCount = 3, moduleCount = 2 }) => {
    return (
        <div className="flex py-2 w-full mt-[24rem]">
            {/* Left Sidebar - Subject List */}
            <div className="flex flex-col gap-3 p-4 pt-4 w-[25%] border-gray-300 border-r">
                {Array(subjectCount)
                    .fill("")
                    .map((_, index) => (
                        <div
                            key={index}
                            className="w-[260px] bg-white rounded-lg shadow-md p-3"
                        >
                            {/* Top row: icon + subject/date */}
                            <div className="flex items-center gap-2 mb-2">
                                <Skeleton.Avatar
                                    active
                                    size="large"
                                    shape="square"
                                    style={{ width: "3rem", height: "3rem" }}
                                />
                                <div className="flex flex-col">
                                    {/* Subject name placeholder */}
                                    <Skeleton.Input
                                        active
                                        size="small"
                                        style={{ width: "120px", marginBottom: "5px" }}
                                    />
                                    {/* Started date placeholder */}
                                    <Skeleton.Input
                                        active
                                        size="small"
                                        style={{ width: "150px" }}
                                    />
                                </div>
                            </div>

                            {/* Progress bar placeholder */}
                            <Skeleton.Input
                                active
                                size="small"
                                style={{
                                    width: "100%",
                                    height: "8px",
                                    borderRadius: "4px",
                                    marginBottom: "8px"
                                }}
                            />

                            {/* Bottom row: modules & percentage */}
                            <div className="flex justify-between">
                                <Skeleton.Input
                                    active
                                    size="small"
                                    style={{ width: "50px" }}
                                />
                            </div>
                        </div>
                    ))}
            </div>

            {/* Middle Section - Chapters */}
            <div className="w-[50%] p-2">
                <div className="bg-white p-2 rounded-lg">
                    {Array(chapterCount)
                        .fill("")
                        .map((_, index) => (
                            <div
                                key={index}
                                className="w-full h-[70px] bg-white rounded-lg shadow-md p-3 flex items-center gap-3 mb-4"
                            >
                                {/* Left: Square image placeholder */}
                                <Skeleton.Avatar active shape="square" size="large" />

                                {/* Middle: Two stacked lines */}
                                <div className="flex flex-col flex-1">
                                    <Skeleton.Input
                                        active
                                        size="small"
                                        style={{ width: "50%" }} // first line half width
                                    />
                                    <Skeleton.Input
                                        active
                                        size="small"
                                        style={{ width: "100%", marginTop: "5px" }} // second line full width
                                    />
                                </div>

                                {/* Right: Circle placeholder (dropdown icon) */}
                                <Skeleton.Avatar active shape="circle" size="small" />
                            </div>
                        ))}
                </div>
            </div>

            {/* Right Sidebar - Modules */}
            <div className="w-[25%] p-2 border-l-2">
                <div className="bg-white p-4 rounded-lg">
                    {/* Optional heading skeleton (e.g., "Modules") */}


                    {/* Render multiple module cards */}
                    <div className="grid grid-cols-1 gap-4">
                        {Array(moduleCount)
                            .fill("")
                            .map((_, index) => (
                                <div
                                    key={index}
                                    className="w-full bg-white rounded-lg shadow-md"
                                >
                                    {/* Top image placeholder with horizontal spacing */}
                                    <div className="px-3 pt-3">
                                        <Skeleton.Image
                                            active
                                            className="w-full h-[100px] rounded-lg"
                                        />
                                    </div>

                                    {/* Two thin lines below the image, half the container width */}
                                    <div className="flex flex-col gap-2 p-3">
                                        <Skeleton.Input
                                            active
                                            size="small"
                                            style={{
                                                width: "50%",
                                                height: "8px",
                                                borderRadius: "4px"
                                            }}
                                        />
                                        <Skeleton.Input
                                            active
                                            size="default"
                                            style={{
                                                width: "90%",
                                                height: "8px",
                                                borderRadius: "4px"
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


export const ChapterSkeleton = ({ count = 3 }) => {
    return (
        <div className="flex flex-col gap-4">
            {Array(count)
                .fill("")
                .map((_, i) => (
                    <div
                        key={i}
                        className="w-full h-[70px] bg-white rounded-lg shadow-md p-3 flex items-center gap-3"
                    >
                        {/* Left: Square image placeholder */}
                        <Skeleton.Avatar active size="large" shape="square" />

                        {/* Middle: Two stacked lines */}
                        <div className="flex flex-col flex-1">
                            <Skeleton.Input
                                active
                                size="small"
                                style={{ width: "50%" }}
                            />
                            <Skeleton.Input
                                active
                                size="small"
                                style={{ width: "100%", marginTop: "5px" }}
                            />
                        </div>

                        {/* Right: Circle placeholder */}
                        <Skeleton.Avatar active shape="circle" size="small" />
                    </div>
                ))}
        </div>

    );
};

export const ModuleSkeleton = ({ count = 3 }) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {Array(count)
                .fill("")
                .map((_, i) => (
                    <div
                        key={i}
                        className="cursor-pointer bg-white rounded-lg shadow-md transition-all duration-200"
                    >
                        {/* Top image placeholder */}
                        <div className="px-3 pt-3">
                            <Skeleton.Image
                                active
                                className="w-full h-[100px] rounded-lg"
                            />
                        </div>

                        {/* Text lines below image */}
                        <div className="flex flex-col gap-2 p-3">
                            <Skeleton.Input
                                active
                                size="small"
                                style={{
                                    width: "50%",
                                    height: "8px",
                                    borderRadius: "4px"
                                }}
                            />
                            <Skeleton.Input
                                active
                                size="default"
                                style={{
                                    width: "90%",
                                    height: "8px",
                                    borderRadius: "4px"
                                }}
                            />
                        </div>
                    </div>
                ))}
        </div>

    );
};

export const LibraryRowSkeleton = ({ rows = 3 }) => {
    return (
        <>
            {/* Single <tr> so antd Table can display it via `locale.emptyText` */}
            <tr>
                <td colSpan={7} style={{ width: '88rem' }}>
                    <div className="flex flex-col space-y-2">
                        {/* Render multiple skeleton rows */}
                        {Array(rows).fill("").map((_, rowIndex) => (
                            <div key={rowIndex} className="border-b p-3 flex space-x-3">
                                {/* 6 columns => 6 rectangle placeholders */}
                                {Array(6).fill("").map((__, colIndex) => (
                                    <div key={colIndex} className="flex-1">
                                        <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </td>
            </tr>
        </>
    );
};

export const NoticeSkeleton = ({ count = 3 }) => {
    return (
        <div className="mt-5 rounded-md overflow-auto">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="border mb-4 bg-white rounded-md shadow-sm">
                    <div className="flex gap-6 px-3 py-2">
                        {/* Left Icon Skeleton */}
                        <Skeleton.Avatar active size={60} shape="square" />

                        {/* Middle Content Skeleton */}
                        <div className="flex flex-col flex-1 gap-2">
                            {/* Title line */}
                            <Skeleton.Input active size="small" style={{ width: "60%" }} />
                            {/* Date & Priority row */}
                            <div className="flex items-center gap-3">
                                <Skeleton.Button active size="small" shape="round" style={{ width: 120 }} />
                                <Skeleton.Button active size="small" shape="round" style={{ width: 80 }} />
                            </div>
                        </div>

                        {/* Expand Icon Skeleton */}
                        <Skeleton.Button active size="small" shape="circle" style={{ width: 32, height: 32 }} />
                    </div>
                </div>
            ))}
        </div>
    );
};