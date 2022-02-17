import { AddIcon } from '@chakra-ui/icons';
import {
  Flex,
  IconButton,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../hooks';
import { Circle } from '../Circle';
import { TaskItem, Task } from './TaskItem';

const fakeTasks: Task[] = [
  {
    id: '1',
    description: 'Research something',
    isDone: false,
    assignedUsers: [
      { id: '123', name: 'Joe' },
      { id: '432', name: 'Alex' },
      { id: '4123', name: 'Joao' },
      { id: '432123', name: 'Patricia' },
    ],
  },
  {
    id: '2',
    description: 'Implement something',
    isDone: false,
    assignedUsers: [
      { id: '123', name: 'Joe' },
      { id: '432', name: 'Alex' },
    ],
  },
  {
    id: '3',
    description: 'Design something',
    isDone: true,
    assignedUsers: [],
  },
];

export function Tasks() {
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // TODO: Fetch tasks from api
    setTasks(fakeTasks);
  }, []);

  const doneTasks = useMemo(() => {
    return tasks.filter(task => task.isDone);
  }, [tasks]);

  const undoneTasks = useMemo(() => {
    return tasks.filter(task => !task.isDone);
  }, [tasks]);

  const numOfDoneTasks = useMemo(() => doneTasks.length, [doneTasks]);

  const numOfUndoneTasks = useMemo(() => undoneTasks.length, [undoneTasks]);

  function handleDoneToggle(taskId: string) {
    // update only task that was clicked
    const updatedTasks = tasks.map(task => {
      return task.id === taskId ? { ...task, isDone: !task.isDone } : task;
    });

    // TODO: Make api call to update tasks of the group
    setTasks(updatedTasks);
  }

  function handleRemoveClick(taskId: string) {
    const updatedTasks = tasks.filter(task => task.id !== taskId);

    // TODO: Make api call to remove task
    setTasks(updatedTasks);
  }

  function handleAssignToMeClick(taskId: string) {
    const assignedUser = { id: user.id, name: user.name };
    // add user to assigned users list of the task
    const updatedTasks = tasks.map(task => {
      return task.id === taskId
        ? { ...task, assignedUsers: [...task.assignedUsers, assignedUser] }
        : task;
    });

    // TODO: Make api call to update tasks of the group
    setTasks(updatedTasks);
  }

  function handleRemoveMeClick(taskId: string) {
    // remove user to assigned users list of the task
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          assignedUsers: task.assignedUsers.filter(u => u.id !== user.id),
        };
      }
      return task;
    });

    // TODO: Make api call to update tasks of the group
    setTasks(updatedTasks);
  }

  function handleCreateTask() {
    // TODO handle creating according to backend
    const task: Task = {
      id: new Date().toUTCString(),
      assignedUsers: [],
      isDone: false,
      description: input,
    };

    setTasks(state => [...state, task]);
    setInput('');
  }

  function handleEditDescription(taskId: string, description: string) {
    // Update task description
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          description,
        };
      }
      return task;
    });

    // TODO: Make api call to update tasks of the group
    setTasks(updatedTasks);
  }

  return (
    <Flex
      width="100%"
      height="100%"
      minHeight="300px"
      bgColor="white"
      filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25))"
      borderRadius="10px"
      direction="column"
      borderBottom="solid 30px"
      borderBottomColor="blue.300"
      overflow="hidden"
    >
      <Flex direction="column" padding="8px 16px 16px 16px" bgColor="blue.300">
        <Text color="white" fontSize="20px" mb="8px">
          Tasks
        </Text>

        <Flex>
          <Input
            marginRight="16px"
            placeholder="Add task"
            size="sm"
            borderRadius="10px"
            bgColor="white"
            color="blue.900"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyUp={e => (e.key === 'Enter' ? handleCreateTask() : '')}
          />
          <IconButton
            size="sm"
            borderRadius="50%"
            bgColor="white"
            aria-label="Add task"
            icon={<AddIcon color="blue.300" />}
            disabled={input.length === 0}
            onClick={handleCreateTask}
          />
        </Flex>
      </Flex>

      <Tabs variant="enclosed" mt="8px" overflowY="scroll">
        <TabList>
          <Tab>
            <Text mr="8px">Pending</Text>
            <Circle num={numOfUndoneTasks} withBorder />
          </Tab>

          <Tab>
            <Text mr="8px">Done</Text>
            <Circle num={numOfDoneTasks} withBorder />
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {undoneTasks.length === 0 ? (
              <Text>You have no pending tasks.</Text>
            ) : (
              undoneTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDoneToggle={() => handleDoneToggle(task.id)}
                  onRemoveClick={() => handleRemoveClick(task.id)}
                  onAssignToMeClick={() => handleAssignToMeClick(task.id)}
                  onRemoveMeClick={() => handleRemoveMeClick(task.id)}
                  onEditDescription={handleEditDescription}
                />
              ))
            )}
          </TabPanel>

          <TabPanel>
            {doneTasks.length === 0 ? (
              <Text>You have not finished a task yet.</Text>
            ) : (
              doneTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDoneToggle={() => handleDoneToggle(task.id)}
                  onRemoveClick={() => handleRemoveClick(task.id)}
                  onAssignToMeClick={() => handleAssignToMeClick(task.id)}
                  onRemoveMeClick={() => handleRemoveMeClick(task.id)}
                  onEditDescription={handleEditDescription}
                />
              ))
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
