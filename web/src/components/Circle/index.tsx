import { Flex } from '@chakra-ui/react';

export function Circle({ text }: { text: string }) {
  return (
    <Flex
      bgColor="white"
      fontSize="12px"
      width="20px"
      height="20px"
      borderRadius="50%"
      textAlign="center"
      justifyContent="center"
      alignItems="center"
      color="blue.700"
    >
      {text}
    </Flex>
  );
}
