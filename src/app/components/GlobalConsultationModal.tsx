"use client";

import { useConsultationModal } from "./ConsultationModalProvider";
import ConsultationModal from "./ConsultationModal";

export default function GlobalConsultationModal() {
  const { isModalOpen, closeModal } = useConsultationModal();

  return <ConsultationModal isOpen={isModalOpen} onClose={closeModal} />;
}
