import {
  AddIcon,
  MinusIcon,
  DeleteIcon,
  CheckIcon,
  RepeatIcon,
  InfoOutlineIcon,
} from '@chakra-ui/icons';
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
} from '@chakra-ui/react';
import { useAuth, User } from '../../hooks';
import { Button } from '../Button';

export interface Task {
  id: string;
  description: string;
  isDone: boolean;
  assignedUsers: Pick<User, 'id' | 'name'>[];
}

interface TaskProps {
  task: Task;
  onRemoveClick: () => void;
  onDoneToggle: () => void;
  onAssignToMeClick: () => void;
  onRemoveMeClick: () => void;
  onEditDescription: (taskId: string, description: string) => void | undefined;
}

export function TaskItem({
  task,
  onRemoveClick,
  onDoneToggle,
  onAssignToMeClick,
  onRemoveMeClick,
  onEditDescription,
}: TaskProps) {
  const { user } = useAuth();

  const isUserAssignedToTask = task.assignedUsers.find(u => u.id === user.id);

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
          width={{ base: '150px', md: '200' }}
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          onSubmit={nextValue => onEditDescription(task.id, nextValue)}
        >
          <EditablePreview width="100%" />
          <EditableInput />
        </Editable>
      </Flex>

      <Stack
        direction="row"
        alignItems="center"
        spacing={{ base: '4px', md: '8px' }}
        overflow="hidden"
      >
        {task.assignedUsers.length > 0 && (
          <Stack
            direction="row"
            alignItems="center"
            spacing="4px"
            display={{ base: 'none', md: 'flex' }}
            maxWidth="120px"
          >
            {isUserAssignedToTask && (
              <Text
                key={user.id}
                fontSize="12px"
                color="gray.400"
                paddingX="4px"
                border="1px solid"
                borderRadius="5px"
                borderColor="gray.400"
              >
                {user.name}
              </Text>
            )}

            <Popover>
              <PopoverTrigger>
                <InfoOutlineIcon color="gray.400" cursor="pointer" />
              </PopoverTrigger>
              <PopoverContent width="150px">
                <PopoverHeader fontSize="12px" textAlign="center">
                  Assigned participants
                </PopoverHeader>
                <PopoverBody display="flex" padding="16px" flexWrap="wrap">
                  {task.assignedUsers.map(user => (
                    <Text
                      key={user.id}
                      fontSize="12px"
                      color="gray.400"
                      paddingX="4px"
                      border="1px solid"
                      borderRadius="5px"
                      borderColor="gray.400"
                      width="fit-content"
                      marginRight="4px"
                      marginBottom="4px"
                    >
                      {user.name}
                    </Text>
                  ))}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Stack>
        )}

        <Button
          buttonType="regular"
          width="100px"
          fontSize="12px"
          bgColor="blue.300"
          height="24px"
          paddingX={{ base: '0', md: '16px' }}
          onClick={isUserAssignedToTask ? onRemoveMeClick : onAssignToMeClick}
        >
          <Text display={{ base: 'none', md: 'block' }}>
            {isUserAssignedToTask ? 'Remove me' : 'Assign to me'}
          </Text>
          {isUserAssignedToTask ? (
            <MinusIcon display={{ base: 'block', md: 'none' }} />
          ) : (
            <AddIcon display={{ base: 'block', md: 'none' }} />
          )}
        </Button>

        <Button
          buttonType="regular"
          fontSize="12px"
          bgColor="red.500"
          height="24px"
          paddingX="16px"
          onClick={onRemoveClick}
        >
          <Text display={{ base: 'none', md: 'block' }}>Remove</Text>
          <DeleteIcon display={{ base: 'block', md: 'none' }} />
        </Button>

        <Button
          buttonType="regular"
          fontSize="12px"
          bgColor="green.300"
          height="24px"
          paddingX="16px"
          onClick={onDoneToggle}
        >
          <Text display={{ base: 'none', md: 'block' }}>
            {task.isDone ? 'Undone' : 'Done'}
          </Text>
          {task.isDone ? (
            <RepeatIcon display={{ base: 'block', md: 'none' }} />
          ) : (
            <CheckIcon display={{ base: 'block', md: 'none' }} />
          )}
        </Button>
      </Stack>
    </Flex>
  );
}
