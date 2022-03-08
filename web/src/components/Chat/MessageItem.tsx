import { Flex, Text } from '@chakra-ui/react';

export interface Message {
  userId: string;
  user: string;
  message: string;
  time: string;
}

export function MessageItem({ message }: { message: Message }) {
  return (
    <Flex direction="column">
      <Text fontSize="14px">{ message.user }</Text>

      <Text fontSize="12px" color="gray.500">
        {message.time}
      </Text>

      <Text fontSize="14px">{message.message}</Text>
    </Flex>
  );
}
