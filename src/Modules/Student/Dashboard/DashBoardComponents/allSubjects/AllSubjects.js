// AllSubjects.jsx
import React from "react";
import { GoAlertFill } from "react-icons/go";
import fallbackSubjectIcon from "../../../../../Assets/DashboardAssets/subject.webp";

const AllSubjects = ({ subjects = [] }) => {
  /* ---------- helpers ---------- */
  const formatPercentage = (val) => Number.parseFloat(val ?? 0).toFixed(1);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  /* ---------- ui ---------- */
  return (
    <div className="mt-1 h-full">
      {subjects.length ? (
        <div className="mt-4 h-full overflow-y-hidden group rounded hover:overflow-y-auto no-scrollbar p-1  hover:scrollbar-auto">
          {subjects.map((subject) => {
            const pct       = formatPercentage(subject.percentageValue);
            const barColor  = subject.subjectColor || "#7C3AED";
            const iconSrc   = subject.subjectIcon  || fallbackSubjectIcon;

            return (
              <article
                key={subject.subjectId || subject._id}
                tabIndex={0}
                aria-labelledby={`subject-${subject.subjectId}-title`}
                /* Tailwind ring utilities will pick up --tw-ring-color */
                style={{
                  borderLeftColor: barColor,
                  "--tw-ring-color": barColor,
                }}
                className="
                  mb-2 py-4 pl-4 pr-2
                  rounded-md border-t border-l-4 bg-white
                  hover:shadow transition-shadow
                  focus:outline-none focus:ring-2
                "
              >
                {/* header */}
                <div className="flex items-center mb-2">
                  <img
                    src={iconSrc}
                    alt={`${subject.subjectName} icon`}
                    className="w-12 h-12 rounded mr-4 object-cover flex-shrink-0"
                  />
                  <div>
                    <h3
                      id={`subject-${subject.subjectId}-title`}
                      className="text-md font-semibold text-gray-800"
                    >
                      {subject.subjectName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Started:&nbsp;{formatDate(subject.started)}
                    </p>
                  </div>
                </div>

                {/* progress bar */}
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Number(pct)}
                  aria-label={`${pct}% completed`}
                  className="relative w-full bg-gray-200 rounded-full h-2"
                >
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: barColor }}
                  />
                </div>

                {/* footer */}
                <div className="mt-2 flex justify-between text-sm text-gray-600">
                  <span>
                    {subject.completedModule}/{subject.totalModule} Modules
                  </span>
                  <span>{pct}%</span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="flex w-full h-full items-center justify-center flex-col mt-4 mb-8 text-gray-500">
          <GoAlertFill className="text-[4rem]" aria-hidden="true" />
          <span className="mt-2 text-xl font-semibold text-center">
            No Data Found
          </span>
        </div>
      )}
    </div>
  );
};

export default AllSubjects;
