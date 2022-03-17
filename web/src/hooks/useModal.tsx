import { useDisclosure } from "@chakra-ui/react";
import React, { createContext, useCallback, useContext, useState } from "react";

interface ModalContextData {
  component: JSX.Element;
  isOpen: boolean;
  openModal: (component: JSX.Element) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextData>({} as ModalContextData);

const ModalProvider: React.FC = ({ children }) => {
  const [component, setComponent] = useState<JSX.Element>(<></>);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openModal = useCallback(
    (component: JSX.Element) => {
      setComponent(component);
      onOpen();
    },
    [onOpen]
  );

  const closeModal = useCallback(() => {
    setComponent(<></>);
    onClose();
  }, [onClose]);

  return (
    <ModalContext.Provider value={{ component, isOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

const useModal = (): ModalContextData => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within an ModalProvider");
  }

  return context;
};

export { ModalProvider, useModal };
