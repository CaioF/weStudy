// import { useParams } from 'react-router-dom';
import { Text, GridItem, Stack, Box, Flex } from '@chakra-ui/react';
import { Participants } from '../../components/Participants';
import { Button } from '../../components/Button';
import { Circle } from '../../components/Circle';
import { Tasks } from '../../components/Tasks';

export function Group() {
  // const { groupId } = useParams();

  return (
    <Flex
      height={{ base: 'auto', md: '80vh' }}
      marginTop={{ base: '0', md: '-40px' }}
      width="100%"
      maxWidth="var(--maxWidth)"
      marginX="auto"
      padding="16px"
      bgColor="gray.300"
      filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25))"
      borderRadius="10px"
      justify="space-evenly"
      direction={{ base: 'column', md: 'row' }}
    >
      <Stack
        spacing="16px"
        width={{ base: '100%', md: '"50%"' }}
        marginRight={{ base: 0, md: '16px' }}
        marginBottom={{ base: '16px', md: 0 }}
      >
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          justify={{ base: 'center', lg: 'stretch' }}
          spacing="16px"
        >
          <Button flexGrow={1} flexShrink={0}>
            Edit group
          </Button>

          <Button flexGrow={1} flexShrink={0}>
            Invite to group
          </Button>

          <Button flexGrow={1} flexShrink={0}>
            <Text marginRight="8px">Join requests</Text>
            <Circle num={2} />
          </Button>
        </Stack>

        <Box>
          <Participants />
        </Box>

        <Box bgColor="blue.300" h="100%">
          chat
        </Box>
      </Stack>

      <Box width={{ base: '100%', md: '"50%"' }}>
        <Tasks />
      </Box>
    </Flex>
  );
}
