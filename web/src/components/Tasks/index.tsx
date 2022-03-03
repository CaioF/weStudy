import { AddIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useGroupPageContext } from "../../hooks/useGroupPageContext";
import { Circle } from "../Circle";
import { TaskItem } from "./TaskItem";

export function Tasks() {
  const [input, setInput] = useState("");
  const { group, createTask } = useGroupPageContext();

  const numOfDoneTasks = useMemo(
    () => group?.doneTasks.length,
    [group?.doneTasks]
  );

  const numOfPendingTasks = useMemo(
    () => group?.pendingTasks.length,
    [group?.pendingTasks]
  );

  function handleDoneToggle(taskId: string) {
    // update only task that was clicked
    // const updatedTasks = tasks.map((task) => {
    //   return task.id === taskId ? { ...task, isDone: !task.isDone } : task;
    // });
    // TODO: Make api call to update tasks of the group
    // setTasks(updatedTasks);
  }

  function handleRemoveClick(taskId: string) {
    // const updatedTasks = tasks.filter((task) => task.id !== taskId);
    // // TODO: Make api call to remove task
    // setTasks(updatedTasks);
  }

  function handleAssignToMeClick(taskId: string) {
    // const assignedUser = { id: user.id, name: user.name };
    // // add user to assigned users list of the task
    // const updatedTasks = tasks.map((task) => {
    //   return task.id === taskId
    //     ? { ...task, assignedUsers: [...task.assignedUsers, assignedUser] }
    //     : task;
    // });
    // // TODO: Make api call to update tasks of the group
    // setTasks(updatedTasks);
  }

  function handleRemoveMeClick(taskId: string) {
    // remove user to assigned users list of the task
    // const updatedTasks = tasks.map((task) => {
    //   if (task.id === taskId) {
    //     return {
    //       ...task,
    //       assignedUsers: task.assignedUsers.filter((u) => u.id !== user.id),
    //     };
    //   }
    //   return task;
    // });
    // // TODO: Make api call to update tasks of the group
    // setTasks(updatedTasks);
  }

  async function handleCreateTask() {
    if (!group || input.trim().length === 0) return;
    await createTask(group?.id, { name: "task", description: input.trim() });
    setInput("");
  }

  function handleEditDescription(taskId: string, description: string) {
    // Update task description
    // const updatedTasks = tasks.map((task) => {
    //   if (task.id === taskId) {
    //     return {
    //       ...task,
    //       description,
    //     };
    //   }
    //   return task;
    // });
    // // TODO: Make api call to update tasks of the group
    // setTasks(updatedTasks);
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
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={(e) => (e.key === "Enter" ? handleCreateTask() : "")}
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
            <Circle num={numOfPendingTasks || 0} withBorder />
          </Tab>

          <Tab>
            <Text mr="8px">Done</Text>
            <Circle num={numOfDoneTasks || 0} withBorder />
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {group?.pendingTasks.length === 0 ? (
              <Text>You have no pending tasks.</Text>
            ) : (
              group?.pendingTasks.map((task) => (
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
            {group?.doneTasks.length === 0 ? (
              <Text>You have not finished a task yet.</Text>
            ) : (
              group?.doneTasks.map((task) => (
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
