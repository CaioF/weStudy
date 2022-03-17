import { Flex, Text, Stack, useClipboard } from "@chakra-ui/react";
import { useEffect } from "react";
import { useGroupPageContext } from "../../hooks/useGroupPageContext";
import { Button } from "../Button";
import { Input } from "../Form";

export function InvitationLink() {
  const { invitationLink, fetchInvitationLink, group } = useGroupPageContext();
  const { hasCopied, onCopy } = useClipboard(invitationLink || "");

  useEffect(() => {
    if (invitationLink === null) {
      (async () => {
        await fetchInvitationLink(group?.id as string);
      })();
    }
  });

  return (
    <Flex direction="column" justify="center" alignItems="center" pb="32px">
      <Text margin="16px 0 36px 0" fontSize="24px">
        Invitation link
      </Text>

      <Stack alignItems="center" spacing="16px">
        <Input
          w="300px"
          value={invitationLink || ""}
          placeholder="http://we-study.com/link"
          onChange={() => {}}
        />

        <Button onClick={onCopy} width="fit-content">
          {hasCopied ? "Copied" : "Copy"}
        </Button>
      </Stack>
    </Flex>
  );
}
