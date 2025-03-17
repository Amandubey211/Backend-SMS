import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Input, Typography } from "antd";
import { ImSpinner3 } from "react-icons/im";

const { Text, Paragraph } = Typography;

/**
 * DeleteModal:
 * - isOpen (bool): whether the modal is visible
 * - onClose (func): closes the modal
 * - onConfirm (func): called when deletion is confirmed
 * - title (string): the name of the item to delete (user must type exactly this)
 */
const DeleteModal = ({ isOpen, onClose, onConfirm, title }) => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset state when the modal closes
  useEffect(() => {
    if (!isOpen) {
      setInputValue("");
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  // Trim and compare ignoring case
  const trimmedTitle = title ? title.trim() : "";
  const isMatching =
    inputValue.trim().toLowerCase() === trimmedTitle.toLowerCase();

  // Confirm handler with spinner and error handling
  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError("Error deleting item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={isOpen}
      onCancel={onClose}
      centered
      title={<span className="font-bold">{`Delete ${trimmedTitle}`}</span>}
      footer={null} // We'll provide a custom footer
      maskStyle={{ backdropFilter: "blur(5px)" }} // Blurred background
      destroyOnClose // Unmount modal content on close
    >
      <Paragraph>
        Type the name{" "}
        <Text strong className="text-red-500 select-none">
          {trimmedTitle}
        </Text>{" "}
        to confirm deletion:
      </Paragraph>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={`Type "${trimmedTitle}"`}
        className="mb-2"
        aria-label={`Type "${trimmedTitle}" to confirm deletion`}
      />
      {error && (
        <Paragraph type="danger" className="mb-2 text-red-500">
          {error}
        </Paragraph>
      )}

      {/* Custom Footer Buttons */}
      <div className="flex justify-end space-x-2 mt-4">
        <Button onClick={onClose} aria-label="Cancel">
          Cancel
        </Button>
        <Button
          type="primary"
          danger
          disabled={!isMatching || loading}
          onClick={isMatching ? handleConfirm : undefined}
          aria-label="Delete"
        >
          {loading ? (
            <span className="flex items-center">
              <ImSpinner3 className="animate-spin mr-2" />
              Deleting...
            </span>
          ) : (
            "Delete"
          )}
        </Button>
      </div>
    </Modal>
  );
};

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default DeleteModal;
