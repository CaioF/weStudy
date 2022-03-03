import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function GroupInvite() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const groupId = searchParams.get("groupId");
    const linkId = searchParams.get("linkId");

    if (!groupId || !linkId) return;
    // TODO: make api call
    console.log(groupId, linkId);
  }, [searchParams]);

  return (
    <Flex>
      <Flex></Flex>
    </Flex>
  );
}
