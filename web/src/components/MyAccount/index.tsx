import { Flex, Text, Box } from "@chakra-ui/react";
import { api } from "../../services";
import { Button } from "../Button";

export function MyAccount() {
  async function handleDeleteClick() {
    await api.delete("api/users");
  }

  return (
    <Flex direction="column" justify="center" alignItems="center">
      <Text margin="16px 0 36px 0" fontSize="24px">
        My Account
      </Text>

      <Box>
        <Button onClick={handleDeleteClick} bgColor="red.500">
          Delete account
        </Button>
      </Box>
    </Flex>
  );
}
