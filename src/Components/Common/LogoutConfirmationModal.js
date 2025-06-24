// LogoutConfirmationModal.jsx
import React, { memo } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { RiCloseLine } from "react-icons/ri";

/**
 * Logout confirmation displayed in a modal dialog.
 * Ant Design handles accessibility, while Framer Motion
 * animates mount/unmount transitions.
 */
const LogoutConfirmationModal = memo(
  ({ isOpen, onClose, onConfirm, loading }) => (
    <AnimatePresence>
      {isOpen && (
        <Modal
          open /* AntD 5+ prop replaces visible */
          centered
          footer={null} /* custom footer */
          closable={false} /* we render our own close btn */
          onCancel={onClose}
          destroyOnClose
          maskStyle={{ backdropFilter: "blur(6px)" }} /* ← background blur */
          modalRender={(modal) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -40 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {modal}
            </motion.div>
          )}
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-2 border-b">
            <h3 id="logout-modal-title" className="text-lg font-semibold">
              Confirm Logout
            </h3>
            <Button
              type="text"
              aria-label="Close modal"
              icon={<RiCloseLine className="text-xl" />}
              onClick={onClose}
            />
          </div>

          {/* Body */}
          <p id="logout-modal-description" className="mt-4">
            Are you sure you want to log out?
          </p>

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-2">
            <Button onClick={onClose} id="cancel-button">
              Cancel
            </Button>
            <Button
              id="confirm-logout-button"
              type="primary"
              danger
              loading={loading}
              onClick={onConfirm}
            >
              {loading ? "Logging out…" : "Logout"}
            </Button>
          </div>
        </Modal>
      )}
    </AnimatePresence>
  )
);

LogoutConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

LogoutConfirmationModal.defaultProps = {
  loading: false,
};

export default LogoutConfirmationModal;
