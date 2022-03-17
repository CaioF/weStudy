import {
  Modal as ChakraModal,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { useModal } from "../../hooks/useModal";

export function Modal() {
  const { component, isOpen, closeModal } = useModal();

  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={closeModal}
      blockScrollOnMount
      closeOnOverlayClick
    >
      <ModalOverlay />
      <ModalContent
        marginTop={{ base: 0, md: "220px" }}
        minWidth="300px"
        minHeight="200px"
      >
        <ModalCloseButton />
        <ModalBody padding="16px">{component}</ModalBody>
      </ModalContent>
    </ChakraModal>
  );
}
