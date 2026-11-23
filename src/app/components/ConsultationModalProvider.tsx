"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ConsultationModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ConsultationModalContext = createContext<
  ConsultationModalContextType | undefined
>(undefined);

export function ConsultationModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ConsultationModalContext.Provider
      value={{
        isModalOpen,
        openModal: () => setIsModalOpen(true),
        closeModal: () => setIsModalOpen(false),
      }}
    >
      {children}
    </ConsultationModalContext.Provider>
  );
}

export function useConsultationModal() {
  const context = useContext(ConsultationModalContext);
  if (context === undefined) {
    throw new Error(
      "useConsultationModal must be used within ConsultationModalProvider",
    );
  }
  return context;
}
