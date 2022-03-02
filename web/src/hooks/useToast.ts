import { useToast as useChackraToast } from '@chakra-ui/react';
import { useCallback } from 'react';

interface Toast {
  status: 'success' | 'error',
  title: string;
  description: string;
}

function useToast() {
  const toast = useChackraToast();

  const showToast = useCallback(({ status, title, description}: Toast) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
      position: 'top-right'
    })
  }, [toast])
  
  return { showToast };
}

export { useToast };