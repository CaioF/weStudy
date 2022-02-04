import { Flex, Text, Button, Stack } from '@chakra-ui/react';

function Card(props: {
  title: any;
  summary: any;
  date: any;
  tasks: any;
  participants: any;
}) {
  const { title, summary, date, tasks, participants } = props;

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
        <Flex bgColor="green.300" width="100%">
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
        <Flex bgColor="green.300">
          <Stack justify="space-between" width="100%">
            <Flex width="20rem">
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                fontSize="lg"
                letterSpacing="wide"
                color="white"
              >
                {date}
              </Text>
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                fontSize="lg"
                letterSpacing="wide"
                color="white"
                flex="2"
              >
                {tasks}
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
            <Button display="block" width="10rem" my={2}>
              Open group
            </Button>
          </Stack>
        </Flex>
      </Stack>
    </Flex>
  );
}

export default Card;
