import { ArrowUpIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Input, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Message, MessageItem } from './MessageItem';

export function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // TODO: fetch messages from backend
    setMessages([
      {
        id: '1',
        author: {
          name: 'Joe',
        },
        content: 'Hey guys. how are you?',
        time: '12:30',
      },
      {
        id: '2',
        author: {
          name: 'Alex',
        },
        content: 'Great! how about you?',
        time: '12:32',
      },
      {
        id: '3',
        author: {
          name: 'Joe',
        },
        content: 'We have to finish the project',
        time: '12:34',
      },
      {
        id: '2',
        author: {
          name: 'Leon',
        },
        content: 'Hi!',
        time: '12:35',
      },
    ]);
  }, []);

  function handleSendMessage() {
    // TODO: implement functionality
    console.log({ handleSendMessage: input });
  }

  return (
    <Flex
      width="100%"
      height="100%"
      bgColor="white"
      filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25))"
      borderRadius="10px"
      direction="column"
      overflow="hidden"
      justify="space-between"
    >
      <Flex
        paddingX="16px"
        paddingY="8px"
        bgColor="blue.300"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text color="white" fontSize="20px">
          Chat
        </Text>
      </Flex>

      <Stack spacing="16px" padding="16px" overflowY="scroll" flex={1}>
        {messages.map(message => (
          <MessageItem key={message.id} message={message} />
        ))}
      </Stack>
      <Flex bgColor="blue.300" padding="16px">
        <Input
          marginRight="16px"
          placeholder="Write a message"
          size="sm"
          borderRadius="10px"
          bgColor="white"
          color="blue.900"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyUp={e => (e.key === 'Enter' ? handleSendMessage() : '')}
        />
        <IconButton
          size="sm"
          borderRadius="50%"
          bgColor="white"
          aria-label="Add task"
          icon={<ArrowUpIcon color="blue.300" />}
          disabled={input.length === 0}
          onClick={handleSendMessage}
        />
      </Flex>
    </Flex>
  );
}
