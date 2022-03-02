import React, { createContext, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "./useModal";
import { api } from "../services";
import { useToast } from "./useToast";

interface CreateEditGroupRequestData {
  name: string;
  description: string;
  size: number;
  timeZone: string;
  timeRanges: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  subject: string;
}

interface CreateTaskRequestData {
  name: string;
  description: string;
}

interface Participant {
  userId: string;
  name: string;
  rate: number;
}
export interface Task {
  id: string;
  description: string;
  isDone: boolean;
}

interface Group {
  id: string;
  name: string;
  description: string;
  topic: string;
  groupSize: string;
  timezone: string;
  participants: Participant[];
  joinRequests: Participant[];
  pendingTasks: Task[];
  doneTasks: Task[];
}

interface ContextExport {
  group: Group | null;
  invitationLink: string | null;
  clearGroup(): void;
  fetchGroup(id: string): Promise<void>;
  createGroup(data: CreateEditGroupRequestData): Promise<void>;
  editGroup(id: string, data: CreateEditGroupRequestData): Promise<void>;
  deleteGroup(id: string): Promise<void>;
  acceptJoinRequest(groupId: string, userId: string): Promise<void>;
  removeParticipant(groupId: string, userId: string): Promise<void>;
  fetchInvitationLink(groupId: string): Promise<void>;
  clearInvitationLink(): void;
  createTask(groupId: string, data: CreateTaskRequestData): Promise<void>;
}

const GroupPageContext = createContext<ContextExport>({} as ContextExport);

const GroupPageContextProvider: React.FC = ({ children }) => {
  const [group, setGroup] = useState<Group | null>(null);
  const [invitationLink, setInvitationLink] = useState<"string" | null>(null);
  const { showToast } = useToast();
  const { closeModal } = useModal();
  const navigate = useNavigate();

  const clearGroup = useCallback(() => {
    setGroup(null);
  }, []);

  const fetchGroup = useCallback(
    async (id: string): Promise<void> => {
      try {
        const { data } = await api.get(`/api/userGroups/${id}`);
        setGroup({
          id: data?.id,
          name: data?.name,
          description: data?.description,
          topic: data?.subject,
          groupSize: String(data?.size),
          timezone: data?.timeZone,
          participants: data?.members
            .filter((p: any) => p.status === 1)
            .map((p: any) => ({
              userId: p.userId,
              name: "placeholder",
              rate: 3,
            })),
          joinRequests: data?.members
            .filter((p: any) => p.status === 0)
            .map((p: any) => ({
              userId: p.userId,
              name: "placeholder",
              rate: 3,
            })),
          pendingTasks: data?.tasks
            .filter((t: any) => t.status === 0)
            .map((t: any) => ({
              id: t.id,
              isDone: !!t.status,
              description: t.description,
            })),
          doneTasks: data?.tasks
            .filter((t: any) => t.status === 1)
            .map((t: any) => ({
              id: t.id,
              isDone: !!t.status,
              description: t.description,
            })),
        });
      } catch (err) {
        showToast({
          status: "error",
          title: "Group Data",
          description: "Could not load data",
        });
      }
    },
    [showToast]
  );

  const createGroup = useCallback(
    async function (data: CreateEditGroupRequestData) {
      try {
        const response = await api.post("/api/userGroups", data);
        if (response) {
          showToast({
            status: "success",
            title: "Group Create",
            description: "Group was created successfully",
          });
          closeModal();
          navigate("/");
        } else {
          showToast({
            status: "error",
            title: "Group Create",
            description: "Could not create group",
          });
        }
      } catch (err) {
        showToast({
          status: "error",
          title: "Group Create",
          description: "Could not create group",
        });
      }
    },
    [showToast, navigate, closeModal]
  );

  const editGroup = useCallback(
    async (id: string, data: CreateEditGroupRequestData): Promise<void> => {
      try {
        await api.put(`/api/userGroups/${id}`, data);
        showToast({
          status: "success",
          title: "Group Update",
          description: "Group was updated successfully",
        });
        closeModal();
      } catch (err) {
        showToast({
          status: "error",
          title: "Group Update",
          description: "Could not update group",
        });
      }
    },
    [closeModal, showToast]
  );

  const deleteGroup = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/api/userGroups/${id}`);
        showToast({
          status: "success",
          title: "Group Delete",
          description: "Group was deleted successfully",
        });
        navigate("/");
        closeModal();
      } catch (err) {
        showToast({
          status: "error",
          title: "Group Delete",
          description: "Could not delete group",
        });
      }
    },
    [closeModal, navigate, showToast]
  );

  const acceptJoinRequest = useCallback(
    async (groupId: string, userId: string) => {
      try {
        await api.post(`/api/userGroups/${groupId}/approve/${userId}`);
        await fetchGroup(groupId);
        showToast({
          status: "success",
          title: "Group Participant",
          description: "The participant was accepted.",
        });
      } catch {
        showToast({
          status: "error",
          title: "Group Participant",
          description: "An error occurred. Please try again.",
        });
      }
    },
    [showToast, fetchGroup]
  );

  const removeParticipant = useCallback(
    async (groupId: string, userId: string) => {
      try {
        await api.post(`/api/userGroups/${groupId}/kick/${userId}`);
        await fetchGroup(groupId);
        showToast({
          status: "success",
          title: "Group Participant",
          description: "The participant was removed.",
        });
      } catch {
        showToast({
          status: "error",
          title: "Group Request",
          description: "An error occurred. Please try again.",
        });
      }
    },
    [showToast, fetchGroup]
  );

  const fetchInvitationLink = useCallback(
    async (groupId: string): Promise<void> => {
      try {
        const { data } = await api.get(`/api/userGroups/${groupId}/link`);
        setInvitationLink(data);
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  const clearInvitationLink = useCallback(() => {
    setInvitationLink(null);
  }, []);

  const createTask = useCallback(
    async (groupId: string, data: CreateTaskRequestData): Promise<void> => {
      try {
        await api.post(`api/userGroups/${groupId}/tasks`, data);
        await fetchGroup(groupId);
        showToast({
          status: "success",
          title: "Group Tasks",
          description: "The task was created.",
        });
      } catch {
        showToast({
          status: "error",
          title: "Group Tasks",
          description: "An error occurred. Please try again.",
        });
      }
    },
    [fetchGroup, showToast]
  );

  return (
    <GroupPageContext.Provider
      value={{
        group,
        invitationLink,
        clearGroup,
        fetchGroup,
        createGroup,
        editGroup,
        deleteGroup,
        acceptJoinRequest,
        removeParticipant,
        fetchInvitationLink,
        clearInvitationLink,
        createTask,
      }}
    >
      {children}
    </GroupPageContext.Provider>
  );
};

const useGroupPageContext = (): ContextExport => {
  const context = useContext(GroupPageContext);

  if (!context) {
    throw new Error(
      "useGroupPageContext must be used within an GroupPageContextProvider"
    );
  }

  return context;
};

export { GroupPageContextProvider, useGroupPageContext };
