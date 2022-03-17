import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./hooks/useAuth";
import { theme } from "./theme";
import { Routes } from "./routes";
import { Header } from "./components/Header";
import { ModalProvider } from "./hooks/useModal";
import { Modal } from "./components/Modal";
import { GroupPageContextProvider } from "./hooks/useGroupPageContext";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <ModalProvider>
          <GroupPageContextProvider>
            <Header />
            <Routes />
            <Modal />
          </GroupPageContextProvider>
        </ModalProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
