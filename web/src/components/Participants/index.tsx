import { Flex, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useGroupPageContext } from "../../hooks/useGroupPageContext";
import { Button } from "../Button";
import { Circle } from "../Circle";
import { Rating, Rate } from "../Rating";
interface ParticipantProps {
  userId: string;
  name: string;
  rate: number;
}

function Participant({ name, rate, userId }: ParticipantProps) {
  const [selectedRating, setSelectedRating] = useState<Rate>(0);
  const { group, removeParticipant } = useGroupPageContext();

  useEffect(() => {
    if (selectedRating !== 0) {
      // TODO: call api to get participant's rate
      console.log(`Selected rating: ${selectedRating}`);
    }
  }, [selectedRating]);

  async function handleRemoveParticipant(userId: string) {
    console.log("sds");
    if (!group) return;
    await removeParticipant(group.id, userId);
  }

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
          {name}
        </Text>
        <Text fontSize="12px">{rate}/5</Text>
      </Flex>

      <Flex alignItems="center">
        <Rating
          currentRate={selectedRating}
          onClick={(rating) => setSelectedRating(rating)}
        />

        <Button
          marginLeft="16px"
          buttonType="regular"
          fontSize="12px"
          bgColor="red.500"
          height="24px"
          paddingX="16px"
          onClick={() => handleRemoveParticipant(userId)}
        >
          Remove
        </Button>
      </Flex>
    </Flex>
  );
}

export function Participants() {
  const { group } = useGroupPageContext();

  return (
    <Flex
      width="100%"
      height="400px"
      bgColor="white"
      filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25))"
      borderRadius="10px"
      direction="column"
      borderBottom="solid 30px"
      borderBottomColor="blue.300"
      overflow="hidden"
    >
      <Flex
        paddingX="16px"
        paddingY="8px"
        bgColor="blue.300"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text color="white" fontSize="20px">
          Participants
        </Text>

        <Circle num={group?.participants?.length || 0} />
      </Flex>

      <Stack paddingX="16px" paddingY="8px" spacing="8px" overflowY="scroll">
        {group?.participants.length === 0 ? (
          <Text textAlign="center">
            There are no other participants at the moment. Invite a study
            partner!
          </Text>
        ) : (
          group?.participants.map((participant) => (
            <Participant
              key={participant.userId}
              userId={participant.userId}
              name={participant.name}
              rate={participant.rate}
            />
          ))
        )}
      </Stack>
    </Flex>
  );
}
