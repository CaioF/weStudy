// import { useParams } from 'react-router-dom';
import { Grid, GridItem } from '@chakra-ui/react';
import { Participants } from '../../components/Participants';

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
      <GridItem area="buttons" bg="green">
        buttons
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
