import { Flex, Text, Stack } from "@chakra-ui/react";
import { Button } from "../Button";

const requests = [
  {
    name: "Joe Doe",
    rate: 5,
  },
  {
    name: "Maria da Silva",
    rate: 4,
  },
  {
    name: "Mick Heiz",
    rate: 3,
  },
];

export function JoinRequests() {
  async function handleAccept() {
    // TODO: implement
  }

  async function handleReject() {
    // TODO: implement
  }

  return (
    <Flex direction="column" justify="center" alignItems="center" pb="32px">
      <Text margin="16px 0 36px 0" fontSize="24px">
        Join requests
      </Text>

      <Stack>
        {requests.map((user) => {
          return (
            <Flex
              alignItems="center"
              justify="space-between"
              borderBottom="1px solid"
              borderBottomColor="gray.400"
              paddingY="8px"
            >
              <Flex alignItems="center">
                <Text fontSize="14px" marginRight="16px">
                  {user.name}
                </Text>
                <Text fontSize="12px">{user.rate}/5</Text>
              </Flex>

              <Flex alignItems="center">
                <Button
                  marginLeft="16px"
                  buttonType="regular"
                  fontSize="12px"
                  bgColor="green.300"
                  height="24px"
                  paddingX="16px"
                  onClick={handleAccept}
                >
                  Accept
                </Button>
                <Button
                  marginLeft="16px"
                  buttonType="regular"
                  fontSize="12px"
                  bgColor="red.500"
                  height="24px"
                  paddingX="16px"
                  onClick={handleReject}
                >
                  Reject
                </Button>
              </Flex>
            </Flex>
          );
        })}
      </Stack>
    </Flex>
  );
}
