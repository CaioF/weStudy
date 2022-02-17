import { Flex, Text, Box } from '@chakra-ui/react';
import { Button } from '../Button';

export function MyAccount() {
  return (
    <Flex direction="column" justify="center" alignItems="center">
      <Text margin="16px 0 36px 0" fontSize="24px">
        My Account
      </Text>

      <Box>
        <Button onClick={() => console.log('Delete account')} bgColor="red.500">
          Delete account
        </Button>
      </Box>
    </Flex>
  );
}
