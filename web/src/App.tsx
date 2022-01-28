import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './hooks/useAuth';
import { theme } from './theme';
import { Routes } from './routes';
import { Header } from './components/Header';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Header />
        <Routes />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
