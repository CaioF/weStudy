import { useToast as useChackraToast } from '@chakra-ui/react';

interface Toast {
  status: 'success' | 'error',
  title: string;
  description: string;
}

function useToast() {
  const toast = useChackraToast();

  function showToast({ status, title, description}: Toast) {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
      position: 'top-right'
    })
  }
  
  return { showToast };
}

export { useToast };