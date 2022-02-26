import { useState } from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';
import { Input } from '../Form/input';


export function GroupForm({ action }: { action: 'create' | 'edit' }) {
  const [name, setName] = useState('');


  // TODO: implement form
  return (
    <Flex direction="column" width="100%" justify="center" alignItems="center">
      <Text margin="16px 0 26px 0" fontSize="24px">
        {action === 'create' ? 'Create group' : 'Edit group'}
      </Text>

      <Box width="100%" px="32px">
        <Input label="Name" placeholder='Joe' value={name} onChange={setName} />
      </Box>
    </Flex>
  );
}
