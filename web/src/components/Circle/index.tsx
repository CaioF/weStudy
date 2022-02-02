import { Flex } from '@chakra-ui/react';

export function Circle({ num }: { num: number }) {
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
      {num}
    </Flex>
  );
}
