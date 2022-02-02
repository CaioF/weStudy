import { Flex } from '@chakra-ui/react';

interface Props {
  num: number;
  withBorder?: boolean;
}

export function Circle({ num, withBorder = false }: Props) {
  return (
    <Flex
      border={withBorder ? '1px solid' : 'unset'}
      bgColor="white"
      fontSize="12px"
      width="20px"
      minWidth="20px"
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
