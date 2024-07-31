import { useState } from "react";

const useDeleteModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const openModal = (data = null) => {
    setIsModalOpen(true);
    setModalData(data);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  return {
    isModalOpen,
    modalData,
    openModal,
    closeModal,
  };
};

export default useDeleteModal;
