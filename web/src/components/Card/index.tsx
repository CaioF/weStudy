import { Flex, Text, Button, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-GB");
}

function Card(props: {
  id: string;
  title: string;
  summary: string;
  date: Date;
  participants: Number;
  isUserGroup: boolean;
}) {
  const { id, title, summary, date, participants, isUserGroup } = props;
  const navigate = useNavigate();

  return (
    <Flex
      width="20rem"
      height="12rem"
      borderWidth={1}
      margin={2}
      bgColor="white"
      filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25))"
      borderRadius="10px"
      overflow="hidden"
    >
      <Stack
        align="center"
        textAlign="center"
        justify="space-between"
        mt={{ base: 4, md: 0 }}
      >
        <Flex
          bgColor={isUserGroup ? "green.300" : "blue.300"}
          width="100%"
          justifyContent="center"
          p="8px"
        >
          <Text
            fontWeight="bold"
            textTransform="uppercase"
            fontSize="lg"
            letterSpacing="wide"
            color="white"
          >
            {title}
          </Text>
        </Flex>
        <Text my={2}>{summary}</Text>

        <Flex bgColor={isUserGroup ? "green.300" : "blue.300"}>
          <Stack justify="space-between" width="100%" p="8px">
            <Flex width="20rem">
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                fontSize="lg"
                letterSpacing="wide"
                color="white"
              >
                {formatDate(date)}
              </Text>
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                fontSize="lg"
                letterSpacing="wide"
                color="white"
                flex="1"
              >
                {participants}
              </Text>
            </Flex>
            <Button
              alignSelf="center"
              display="block"
              width="10rem"
              my={2}
              onClick={() => navigate(`/group/${id}`)}
            >
              {isUserGroup ? "Open group" : "Join group"}
            </Button>
          </Stack>
        </Flex>
      </Stack>
    </Flex>
  );
}

export default Card;
