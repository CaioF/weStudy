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

interface GroupData {
  id: string;
  name: string;
  description: string;
  topic: string;
  groupSize: string;
  timezone: string;
  participants: { userId: string; name: string; rate: number }[];
  joinRequests: { userId: string; name: string; rate: number }[];
}

interface ContextExport {
  group: GroupData | null;
  clearGroup(): void;
  fetchGroup(id: string): Promise<void>;
  createGroup(data: CreateEditGroupRequestData): Promise<void>;
  editGroup(id: string, data: CreateEditGroupRequestData): Promise<void>;
  deleteGroup(id: string): Promise<void>;
  acceptJoinRequest(groupId: string, userId: string): Promise<void>;
  removeParticipant(groupId: string, userId: string): Promise<void>;
}

const GroupPageContext = createContext<ContextExport>({} as ContextExport);

const GroupPageContextProvider: React.FC = ({ children }) => {
  const [group, setGroup] = useState<GroupData | null>(null);
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
      debugger;
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

  return (
    <GroupPageContext.Provider
      value={{
        group,
        clearGroup,
        fetchGroup,
        createGroup,
        editGroup,
        deleteGroup,
        acceptJoinRequest,
        removeParticipant,
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
