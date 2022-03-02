import { Flex, Text, Stack } from "@chakra-ui/react";
import { useGroupPageContext } from "../../hooks/useGroupPageContext";
import { Button } from "../Button";

export function JoinRequests() {
  const { group, acceptJoinRequest, removeParticipant } = useGroupPageContext();

  async function handleAccept(userId: string) {
    if (!group) return;
    await acceptJoinRequest(group.id, userId);
  }

  async function handleReject(userId: string) {
    if (!group) return;
    await removeParticipant(group.id, userId);
  }

  return (
    <Flex direction="column" justify="center" alignItems="center" pb="32px">
      <Text margin="16px 0 36px 0" fontSize="24px">
        Join requests
      </Text>

      <Stack>
        {group?.joinRequests.length === 0 ? (
          <Text textAlign="center">
            There are no requests at the moment. Invite a study partner!
          </Text>
        ) : (
          group?.joinRequests?.map((user) => {
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
                    onClick={() => handleAccept(user.userId)}
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
                    onClick={() => handleReject(user.userId)}
                  >
                    Reject
                  </Button>
                </Flex>
              </Flex>
            );
          })
        )}
      </Stack>
    </Flex>
  );
}
