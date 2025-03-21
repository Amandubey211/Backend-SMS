import React, { useState } from "react";
import { Drawer, Modal, Checkbox, Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { EyeOutlined, CloseOutlined } from "@ant-design/icons";
import { RiFileList3Line } from "react-icons/ri";

/**
 * The RubricModal displays a "drawer" from the bottom.
 * The layout is responsive: below 'lg', it stacks vertically;
 * above 'lg', it splits into 20% (criteria) / 70% (ratings) / 10% (points).
 */
const RubricModal = ({ rubric, isOpen, onClose }) => {
  const [descModalOpen, setDescModalOpen] = useState(false);
  const [descText, setDescText] = useState("");

  if (!rubric) return null;

  /* --------------------- Handlers --------------------- */
  const handleViewDescription = (desc) => {
    if (!desc) return;
    setDescText(desc);
    setDescModalOpen(true);
  };

  const handleCloseDescription = () => {
    setDescText("");
    setDescModalOpen(false);
  };

  /* Count how many criteria & ratings in total */
  const totalCriteria = rubric?.criteria?.length || 0;
  const totalRatings = rubric.criteria?.reduce(
    (sum, c) => sum + (c.ratings?.length || 0),
    0
  );

  return (
    <>
      {/* PRIMARY DRAWER (FROM BOTTOM) */}
      <Drawer
        open={isOpen}
        onClose={onClose}
        placement="bottom"
        height="95vh"
        title={
          <div className="flex items-center gap-2">
            <RiFileList3Line className="text-2xl text-gray-600" />
            <h2 className="text-xl font-semibold">View Rubric</h2>
          </div>
        }
        // closable={false} // custom close icon
        bodyStyle={{ padding: 0 }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="rubricDrawer"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              {/* CONTENT WRAPPER */}
              <div className="overflow-auto p-6 flex-grow capitalize">
                {/* RUBRIC INFO ROW */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">
                      Rubric Name
                    </label>
                    <input
                      type="text"
                      value={rubric?.name || "-"}
                      className="block w-full p-2 border rounded-md bg-gray-100 focus:outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">
                      {rubric.assignmentId ? "Assignment" : "Quiz"}
                    </label>
                    <input
                      type="text"
                      value={
                        rubric.assignmentId?.name || rubric.quizId?.name || "-"
                      }
                      className="block w-full p-2 border rounded-md bg-gray-100 focus:outline-none"
                      disabled
                    />
                  </div>
                </div>

                {/* HEADER ROW: CRITERIA / RATINGS / POINTS */}
                <div className="py-2 px-4 text-center rounded-t-md font-semibold bg-pink-100 text-pink-700 hidden lg:flex items-center">
                  <div className="w-[20%]">Criteria ({totalCriteria})</div>
                  <div className="w-[70%]">Ratings ({totalRatings})</div>
                  <div className="w-[10%]">Points</div>
                </div>

                {/* Smaller screens => stacked layout */}
                <div className="lg:hidden py-2 px-4 text-center rounded-t-md font-semibold bg-pink-100 text-pink-700 mb-2">
                  Criteria, Ratings, & Points
                </div>

                {/* CRITERIA LIST */}
                {rubric.criteria?.map((criterion) => {
                  const totalCriterionPoints = criterion.ratings.reduce(
                    (sum, r) => sum + r.ratingScore,
                    0
                  );

                  return (
                    <div
                      key={criterion._id}
                      className="border-b last:border-none py-2"
                    >
                      {/* 
                        On large screens => 3-column layout
                        On smaller => stacked 
                      */}
                      <div className="grid grid-cols-1 lg:grid-cols-[20%_70%_10%]">
                        {/* LEFT COLUMN: Criterion Info */}
                        <div className="p-4 border-r hidden lg:block">
                          <h3 className="font-medium text-gray-800 mb-1 line-clamp-1">
                            {criterion.title || "Untitled Criterion"}
                          </h3>
                          <p
                            className="text-sm text-gray-600 mb-2 cursor-pointer line-clamp-2"
                            onClick={() =>
                              handleViewDescription(criterion.description)
                            }
                            title="Click to view full description"
                          >
                            {criterion.description?.length > 60
                              ? criterion.description.slice(0, 60) + "..."
                              : criterion.description || ""}
                          </p>
                          {/* Range + Eye Button Row */}
                          <div className="flex items-center gap-3">
                            <Checkbox disabled>Range</Checkbox>
                            <EyeOutlined
                              className="cursor-pointer text-blue-500"
                              onClick={() =>
                                handleViewDescription(criterion.description)
                              }
                            />
                          </div>
                        </div>

                        {/* For smaller screens => show Criterion heading inline */}
                        <div className="p-4 lg:hidden">
                          <h3 className="font-medium text-gray-800 mb-1">
                            {criterion.title || "Untitled Criterion"}
                          </h3>
                          <p
                            className="text-sm text-gray-600 mb-2 cursor-pointer line-clamp-2"
                            onClick={() =>
                              handleViewDescription(criterion.description)
                            }
                            title="Click to view full description"
                          >
                            {criterion.description?.length > 60
                              ? criterion.description.slice(0, 60) + "..."
                              : criterion.description || ""}
                          </p>
                          {/* Range + Eye Button Row */}
                          <div className="flex items-center gap-3">
                            <Checkbox disabled>Range</Checkbox>
                            <EyeOutlined
                              className="cursor-pointer text-blue-500"
                              onClick={() =>
                                handleViewDescription(criterion.description)
                              }
                            />
                          </div>
                        </div>

                        {/* MIDDLE COLUMN: Ratings with horizontal scroll */}
                        <div className="p-4 overflow-x-auto border-r">
                          <div className="flex flex-row gap-3">
                            {criterion.ratings.map((rating) => (
                              <motion.div
                                key={rating._id}
                                className="flex-shrink-0 w-28 h-28 bg-white border p-2 rounded-md shadow-sm relative flex flex-col justify-between"
                                // Framer Motion micro-interactions
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <h4 className="font-semibold text-sm line-clamp-1">
                                  {rating.ratingTitle || "No Title"}
                                </h4>
                                <p
                                  className="text-xs text-gray-600 flex-grow cursor-pointer line-clamp-2 mb-1"
                                  title="Click to view full description"
                                  onClick={() =>
                                    handleViewDescription(
                                      rating.ratingDescription
                                    )
                                  }
                                >
                                  {rating.ratingDescription?.length > 40
                                    ? rating.ratingDescription.slice(0, 40) +
                                      "..."
                                    : rating.ratingDescription || ""}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-sm">
                                    {rating.ratingScore}
                                  </span>
                                  <EyeOutlined
                                    className="text-blue-500 cursor-pointer"
                                    onClick={() =>
                                      handleViewDescription(
                                        rating.ratingDescription
                                      )
                                    }
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Points */}
                        <div className="flex items-center justify-center p-4">
                          <div className="bg-gray-100 rounded-md p-2 w-14 text-center shadow-sm">
                            {totalCriterionPoints}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* TOTAL POINTS */}
                <div className="mt-4 text-right text-pink-600 font-bold text-lg">
                  Total Assignment Points: {rubric.totalScore || 0}
                </div>
              </div>

              {/* FOOTER */}
              <div className="border-t p-4 flex justify-end capitalize">
                <Button
                  onClick={onClose}
                  type="primary"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-6"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Drawer>

      {/* SECONDARY MODAL FOR LONG DESCRIPTIONS */}
      <Modal
        open={descModalOpen}
        onCancel={handleCloseDescription}
        footer={null}
        title="Description"
        destroyOnClose
      >
        <div className="p-2 ">
          <p className="text-gray-700 whitespace-pre-line">
            {descText || "No description"}
          </p>
        </div>
      </Modal>
    </>
  );
};

export default RubricModal;
