import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useGroupPageContext } from "../../hooks";

export function GroupInvite() {
  const [searchParams] = useSearchParams();
  const { joinGroupWithLink } = useGroupPageContext();

  useEffect(() => {
    const groupId = searchParams.get("groupId");
    const linkId = searchParams.get("linkId");

    if (!groupId || !linkId) return;

    (async () => {
      await joinGroupWithLink(groupId, linkId);
    })();
  }, [searchParams, joinGroupWithLink]);

  return (
    <Flex alignItems="center" flexDirection="column">
      <Text textAlign="center" mt="24px" mb="24px">
        Joining group with link...
      </Text>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.300"
        size="xl"
      />
    </Flex>
  );
}
