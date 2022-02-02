import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './hooks/useAuth';
import { theme } from './theme';
import { Routes } from './routes';
import { Header } from './components/Header';
import { ModalProvider } from './hooks/useModal';
import { Modal } from './components/Modal';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <ModalProvider>
          <Header />
          <Routes />
          <Modal />
        </ModalProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
