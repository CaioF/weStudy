import { Flex, Text } from '@chakra-ui/react';

export interface Message {
  id: string;
  author: {
    name: string;
  };
  content: string;
  time: string;
}

export function MessageItem({ message }: { message: Message }) {
  return (
    <Flex direction="column">
      <Text fontSize="14px">{message.author.name}</Text>

      <Text fontSize="12px" color="gray.500">
        {message.time}
      </Text>

      <Text fontSize="14px">{message.content}</Text>
    </Flex>
  );
}
