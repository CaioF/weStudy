import { Flex, Text, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Button";

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
  isActiveCard: boolean;
}) {
  const { id, title, summary, date, participants, isUserGroup, isActiveCard} = props;
  const navigate = useNavigate();

  return (
    <Stack
      width="20rem"
      height={isActiveCard ? "14rem" : "12rem"}
      borderWidth={0}
      bgColor="white"
      borderRadius="10px"
      overflow="hidden"
      align="center"
      textAlign="center"
      justify="space-between"
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
          {isActiveCard ?
            <Stack justify="space-between" width="100%" p="8px">
            <Flex width={"20rem"}>
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                fontSize="lg"
                letterSpacing="wide"
                color="white"
                flex="1"
              >
                {formatDate(date)}<br />
                <Text fontSize="10px">Date of creation</Text>
              </Text>
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                fontSize="lg"
                letterSpacing="wide"
                color="white"
                flex="1"
              >
                {participants}<br />
                <Text fontSize="10px">Participants</Text>
              </Text>
            </Flex>
            <Button
              bgColor="white"
              color={isUserGroup ? "green.300" : "blue.300"}
              alignSelf="center"
              display="block"
              width="10rem"
              my={2}
              onClick={() => {isUserGroup ? navigate(`/group/${id}`) : console.log('pls add me to your group')}}
            >
              {isUserGroup ? "Open group" : "Join group"}
            </Button>
          </Stack> 
          :
          <Flex width="20rem" height="1rem"></Flex> 
          }
        </Flex>
    </Stack>
  );
}

export default Card;
