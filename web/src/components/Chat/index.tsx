import { ArrowUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Input, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Message, MessageItem } from "./MessageItem";

// Chat socket
import socketIOClient from 'socket.io-client';
import { useAuth, useGroupPageContext } from "../../hooks";
const socket = socketIOClient(`${process.env.REACT_APP_API_URL}`, {
  extraHeaders: {
    'Access-Control-Allow-Origin': '*',
  }
})

export function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const {
    fetchGroup,
    group,
    clearGroup,
    fetchInvitationLink,
    clearInvitationLink,
  } = useGroupPageContext();
  const { id } = useAuth();

  // Chat socket
  useEffect(() => {
    if (!group || !group?.id) return;
    console.log(group.id)
    socket.on('getMessage', (message) => {
      setMessages(state => [...state, message]);
    });
    socket.emit('joinChat', group.id);
  }, [group?.id]);

  /**
    let chatMessage = { 
            groupId : msg.groupId,
            time : time, 
            userId : msg.userId, 
            user : tryGetUser.payload.firstName, 
            message : msg.message 
        };
   */

  const handleSendMessage = () => {
    
    if (!group || !group?.id) return;
    socket.emit('message', {groupId: group.id, message: input, userId: id});
    setInput('');
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
        {messages.map((message, index) => (
          <MessageItem key={index} message={message} />
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
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => (e.key === "Enter" ? handleSendMessage() : "")}
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
