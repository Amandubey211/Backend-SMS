// SortFilterModal.js
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Button,
  Radio,
  Checkbox,
  Tooltip,
  message,
  Row,
  Col,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";

/**
 * SortFilterModal component utilizing Ant Design for better UI,
 * framer-motion for micro animations, and improved error handling & UX.
 */
const SortFilterModal = ({
  isOpen,
  onClose,
  onApply,
  sortOptions,
  filterOptions,
  department,
  initialSort,
  initialFilters,
}) => {
  const [selectedSort, setSelectedSort] = useState(initialSort || null);
  const [selectedFilters, setSelectedFilters] = useState(initialFilters || []);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedSort(initialSort || null);
      setSelectedFilters(initialFilters || []);
    }
  }, [isOpen, initialSort, initialFilters]);

  const handleFilterChange = (value) => {
    setSelectedFilters((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleApply = () => {
    // Basic validation or error handling
    if (!selectedSort && !selectedFilters.length) {
      message.info("No sort or filter selected. Applying without changes.");
    }
    onApply({
      sortOption: selectedSort,
      filterOptions: selectedFilters,
    });
    onClose();
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setSelectedSort(null);
      setSelectedFilters([]);
      onApply({
        sortOption: null,
        filterOptions: [],
      });
      onClose();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Modal
              visible={isOpen}
              onCancel={onClose}
              footer={null}
              centered
              width={800} // Increased width for a larger modal
              destroyOnClose
              bodyStyle={{ padding: "24px 24px" }}
              title={
                department
                  ? `Sort & Filter ${
                      department.charAt(0).toUpperCase() + department.slice(1)
                    }`
                  : "Sort & Filter"
              }
            >
              {/* Refresh Button with Tooltip */}
              <div style={{ position: "absolute", top: 16, right: 48 }}>
                <Tooltip title="Reset filters and sorting">
                  <Button
                    type="text"
                    icon={
                      <FiRefreshCw
                        className={isRefreshing ? "animate-spin" : ""}
                      />
                    }
                    onClick={handleRefresh}
                  />
                </Tooltip>
              </div>

              {/* Sort & Filter Sections arranged side by side */}
              <Row gutter={[32, 16]}>
                {/* Sort Section */}
                {sortOptions && sortOptions.length > 0 && (
                  <Col xs={24} md={12}>
                    <h4 style={{ marginBottom: 8 }}>Sort By</h4>
                    <Radio.Group
                      onChange={(e) => setSelectedSort(e.target.value)}
                      value={selectedSort}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {sortOptions.map((option) => (
                        <Radio key={option.value} value={option.value}>
                          {option.label}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Col>
                )}

                {/* Filter Section */}
                {filterOptions && filterOptions.length > 0 && (
                  <Col xs={24} md={12}>
                    <h4 style={{ marginBottom: 8 }}>Filter By</h4>
                    <div
                      style={{
                        maxHeight: 200,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {filterOptions.map((filter) => (
                        <Checkbox
                          key={filter.value}
                          checked={selectedFilters.includes(filter.value)}
                          onChange={() => handleFilterChange(filter.value)}
                        >
                          {filter.label}
                        </Checkbox>
                      ))}
                    </div>
                  </Col>
                )}
              </Row>

              {/* Modal Actions */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 24,
                }}
              >
                <Button onClick={onClose}>Cancel</Button>
                <Button type="primary" onClick={handleApply}>
                  Apply
                </Button>
              </div>
            </Modal>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

SortFilterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  department: PropTypes.string,
  initialSort: PropTypes.string,
  initialFilters: PropTypes.arrayOf(PropTypes.string),
};

SortFilterModal.defaultProps = {
  sortOptions: [],
  filterOptions: [],
  department: "",
  initialSort: null,
  initialFilters: [],
};

export default SortFilterModal;
