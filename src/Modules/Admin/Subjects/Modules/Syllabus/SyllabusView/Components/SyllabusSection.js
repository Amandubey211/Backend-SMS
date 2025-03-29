import React from "react";
import { useTranslation } from "react-i18next";
import { Tag, Popover } from "antd";

const SyllabusSection = ({ title, content, syllabus }) => {
  const { t } = useTranslation("admModule");

  // Extract section and group names from syllabus prop
  const sectionNames = syllabus?.sectionIds?.map((s) => s.sectionName) || [];
  const groupNames = syllabus?.groupIds?.map((g) => g.groupName) || [];

  // Popover content for sections
  const sectionPopoverContent = (
    <div className="max-w-xs">
      {sectionNames.map((name, index) => (
        <Tag key={index} color="blue" className="m-1">
          {name}
        </Tag>
      ))}
    </div>
  );

  // Popover content for groups
  const groupPopoverContent = (
    <div className="max-w-xs">
      {groupNames.map((name, index) => (
        <Tag key={index} color="green" className="m-1">
          {name}
        </Tag>
      ))}
    </div>
  );

  return (
    <div className="p-5 mb-6 mt-5">
      {title && content ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 capitalize">
              {title}
            </h2>
            <div className="flex space-x-2">
              {sectionNames.length > 0 && (
                <Popover
                  content={sectionPopoverContent}
                  title="Sections"
                  trigger="hover"
                  placement="bottomRight"
                >
                  <div className="flex items-center space-x-1">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {sectionNames.slice(0, 3).map((name, index) => (
                        <Tag key={index} color="blue" className="m-0">
                          {name}
                        </Tag>
                      ))}
                      {sectionNames.length > 3 && (
                        <Tag color="blue" className="m-0 cursor-pointer">
                          +{sectionNames.length - 3}
                        </Tag>
                      )}
                    </div>
                  </div>
                </Popover>
              )}
              {groupNames.length > 0 && (
                <Popover
                  content={groupPopoverContent}
                  title="Groups"
                  trigger="hover"
                  placement="bottomRight"
                >
                  <div className="flex items-center space-x-1">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {groupNames.slice(0, 3).map((name, index) => (
                        <Tag key={index} color="green" className="m-0">
                          {name}
                        </Tag>
                      ))}
                      {groupNames.length > 3 && (
                        <Tag color="green" className="m-0 cursor-pointer">
                          +{groupNames.length - 3}
                        </Tag>
                      )}
                    </div>
                  </div>
                </Popover>
              )}
            </div>
          </div>
          <div
            className="text-gray-700 leading-8 text-justify"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </>
      ) : (
        <p className="text-gray-500 mt-4">{t("No syllabus data available.")}</p>
      )}
    </div>
  );
};

export default SyllabusSection;
