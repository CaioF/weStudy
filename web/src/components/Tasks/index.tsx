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
import { api } from "../../services/api";

export function Tasks() {
  const [input, setInput] = useState("");
  const { group, createTask, fetchGroup } = useGroupPageContext();

  const numOfPendingTasks = useMemo(
    () => group?.pendingTasks.length,
    [group?.pendingTasks]
  );

  async function handleDoneToggle(taskId: string) {
    if (!group || !group?.id) return;
    api.delete(`api/userGroups/${group?.id}/tasks/${taskId}`).then((res) => {
      if (res.status !== 200) {
        console.error(res);
      }
    });
    await fetchGroup( group.id );
    window.location.reload();
  }

  async function handleCreateTask() {
    if (!group || input.trim().length === 0) return;
    await createTask(group?.id, { name: "task", description: input.trim() });
    setInput("");
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
                />
              ))
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
