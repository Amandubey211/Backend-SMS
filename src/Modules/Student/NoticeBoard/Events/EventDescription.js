import React, { useState } from "react";
import { FaRegStickyNote } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { gt } from "../../../../Utils/translator/translation";

const EventDescription = ({ description }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  if (!description) {
    description = t("No Details Available", gt.stdEvents);
  }

  return (
    <div className="flex flex-row items-start gap-2">
      {/* <FaRegStickyNote className="text-gray-400 text-lg mt-1" /> */}
      <div>
        <p
          className={`text-sm text-wrap break-words text-black ${
            expanded ? "" : "line-clamp-3"
          }`}
        >
          {description}
        </p>

        {/* Show "Read more" only if text is truncated */}
        {description.length > 150 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 text-xs font-medium mt-1 hover:underline"
          >
            {expanded ? t("Read Less") : t("Read More")}
          </button>
        )}
      </div>
    </div>
  );
};

export default EventDescription;
