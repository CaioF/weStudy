import { useState } from "react";
import { Flex, Text, Stack } from "@chakra-ui/react";
import { Input } from "../Form/input";
import { TextArea } from "../Form/textArea";

export function GroupForm({ action }: { action: "create" | "edit" }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // TODO: implement form
  return (
    <Flex direction="column" width="100%" justify="center" alignItems="center">
      <Text margin="16px 0 26px 0" fontSize="24px">
        {action === "create" ? "Create group" : "Edit group"}
      </Text>

      <Stack width="100%" px="32px">
        <Input label="Name" placeholder="Joe" value={name} onChange={setName} />

        <TextArea
          label="Description"
          placeholder="Math study group in Europe timezone"
          value={description}
          onChange={setDescription}
        />
      </Stack>
    </Flex>
  );
}
