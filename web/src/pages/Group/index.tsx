// import { useParams } from 'react-router-dom';
import { Text, Grid, GridItem, Stack } from '@chakra-ui/react';
import { Participants } from '../../components/Participants';
import { Button } from '../../components/Button';
import { Circle } from '../../components/Circle';

export function Group() {
  // const { groupId } = useParams();

  return (
    <Grid
      minH="80vh"
      marginTop={{ base: '0', md: '-40px' }}
      width="100%"
      maxWidth="var(--maxWidth)"
      marginX="auto"
      gap="16px"
      padding="16px"
      bgColor="gray.300"
      filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25))"
      borderRadius="10px"
      templateRows={{
        base: 'repeat(4, 1fr)',
        md: '0.1fr 0.4fr 0.5fr',
      }}
      templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
      templateAreas={{
        base: `
          "buttons"
          "participants"
          "chat"
          "tasks"
        `,
        md: `
          "buttons      tasks"
          "participants tasks"
          "chat         tasks"
        `,
      }}
    >
      <GridItem area="buttons">
        <Stack direction="row" justify="stretch" spacing="16px">
          <Button flex={1}>Edit group</Button>

          <Button flex={1}>Invite to group</Button>

          <Button flex={1} flexShrink={0}>
            <Text marginRight="8px">Join requests</Text>
            <Circle num={2} />
          </Button>
        </Stack>
      </GridItem>

      <GridItem area="participants">
        <Participants />
      </GridItem>

      <GridItem area="chat" bg="blue.900">
        chat
      </GridItem>

      <GridItem area="tasks" bg="tomato">
        tasks
      </GridItem>
    </Grid>
  );
}
