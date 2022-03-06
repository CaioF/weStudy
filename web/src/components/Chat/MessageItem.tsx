import { Flex, Text } from '@chakra-ui/react';

export interface Message {
  userId: string;
  author: {
    name: string;
  } | null;
  message: string;
  time: string;
}

export function MessageItem({ message }: { message: Message }) {
  return (
    <Flex direction="column">
      <Text fontSize="14px">{ message.author ? message.author.name : message.userId }</Text>

      <Text fontSize="12px" color="gray.500">
        {message.time}
      </Text>

      <Text fontSize="14px">{message.message}</Text>
    </Flex>
  );
}
