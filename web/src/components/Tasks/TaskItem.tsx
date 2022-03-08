import {
  AddIcon,
  MinusIcon,
  DeleteIcon,
  CheckIcon,
  RepeatIcon,
  InfoOutlineIcon,
} from "@chakra-ui/icons";
import {
  Flex,
  Stack,
  Text,
  Editable,
  EditableInput,
  EditablePreview,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import { Task } from "../../hooks";
import { Button } from "../Button";

interface TaskProps {
  task: Task;
  onDoneToggle: () => void;
}

export function TaskItem({
  task,
  onDoneToggle,
}: TaskProps) {
  const isUserAssignedToTask = true;

  return (
    <Flex
      alignItems="center"
      justify="space-between"
      borderBottom="1px solid"
      borderBottomColor="gray.400"
      paddingY="8px"
    >
      <Flex alignItems="center" flexGrow={0}>
        <Editable
          defaultValue={task.description}
          fontSize="14px"
          width={{ base: "150px", md: "200" }}
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          <EditablePreview width="100%" />
          <EditableInput />
        </Editable>
      </Flex>

      <Stack
        direction="row"
        alignItems="center"
        spacing={{ base: "4px", md: "8px" }}
        overflow="hidden"
      >

        <Button
          buttonType="regular"
          fontSize="12px"
          bgColor="green.300"
          height="24px"
          paddingX="16px"
          onClick={onDoneToggle}
        >
          <Text display={{ base: "none", md: "block" }}>
            {task.isDone ? "Undone" : "Done"}
          </Text>
          {task.isDone ? (
            <RepeatIcon display={{ base: "block", md: "none" }} />
          ) : (
            <CheckIcon display={{ base: "block", md: "none" }} />
          )}
        </Button>
      </Stack>
    </Flex>
  );
}
