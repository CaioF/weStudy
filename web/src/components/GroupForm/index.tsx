import { Flex, Text, Box } from '@chakra-ui/react';

export function GroupForm({ action }: { action: 'create' | 'edit' }) {
  // TODO: implement form
  return (
    <Flex direction="column" justify="center" alignItems="center">
      <Text margin="16px 0 36px 0" fontSize="24px">
        {action === 'create' ? 'Create group' : 'Edit group'}
      </Text>

      <Box>Coming soon!</Box>
    </Flex>
  );
}
