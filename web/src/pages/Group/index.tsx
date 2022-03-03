import { useParams } from "react-router-dom";
import { Text, Stack, Box, Flex } from "@chakra-ui/react";
import { Participants } from "../../components/Participants";
import { Button } from "../../components/Button";
import { Circle } from "../../components/Circle";
import { Tasks } from "../../components/Tasks";
import { Chat } from "../../components/Chat";
import { useModal } from "../../hooks";
import { GroupForm } from "../../components/GroupForm";
import { JoinRequests } from "../../components/JoinRequests";
import { InvitationLink } from "../../components/InvitationLink";
import { useEffect } from "react";
import { useGroupPageContext } from "../../hooks/useGroupPageContext";

export function Group() {
  const { openModal } = useModal();
  const {
    fetchGroup,
    group,
    clearGroup,
    fetchInvitationLink,
    clearInvitationLink,
  } = useGroupPageContext();
  const { groupId } = useParams();

  useEffect(() => {
    if (!groupId) return;
    (async () => {
      await fetchGroup(groupId as string);
    })();

    return clearGroup;
  }, [groupId, fetchGroup, clearGroup]);

  useEffect(() => {
    if (!groupId) return;
    (async () => {
      await fetchInvitationLink(groupId as string);
    })();

    return clearInvitationLink;
  }, [groupId, fetchInvitationLink, clearInvitationLink]);

  return (
    <Flex
      height={{ base: "auto", md: "80vh" }}
      marginTop={{ base: "0", md: "-40px" }}
      width="100%"
      maxWidth="var(--maxWidth)"
      marginX="auto"
      padding="16px"
      bgColor="gray.300"
      filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25))"
      borderRadius="10px"
      justify="space-evenly"
      direction={{ base: "column", md: "row" }}
    >
      <Stack
        spacing="16px"
        width={{ base: "100%", md: '"50%"' }}
        marginRight={{ base: 0, md: "16px" }}
        marginBottom={{ base: "16px", md: 0 }}
      >
        <Stack
          direction={{ base: "column", lg: "row" }}
          justify={{ base: "center", lg: "stretch" }}
          spacing="16px"
        >
          <Button
            disabled={!group}
            flexGrow={1}
            flexShrink={0}
            onClick={() => openModal(<GroupForm action="edit" />)}
          >
            Edit group
          </Button>

          <Button
            disabled={!group}
            flexGrow={1}
            flexShrink={0}
            onClick={() => openModal(<InvitationLink />)}
          >
            Invite to group
          </Button>

          <Button
            disabled={!group}
            flexGrow={1}
            flexShrink={0}
            onClick={() => openModal(<JoinRequests />)}
          >
            <Text marginRight="8px">Join requests</Text>

            <Circle num={group?.joinRequests?.length || 0} />
          </Button>
        </Stack>

        <Participants />

        <Chat />
      </Stack>

      <Box width={{ base: "100%", md: '"50%"' }}>
        <Tasks />
      </Box>
    </Flex>
  );
}
