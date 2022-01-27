import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';
import { Routes } from './routes';
import { Header } from './components/Header';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Header isAuthenticated={false} />
      <Routes />
    </ChakraProvider>
  );
}

export default App;
