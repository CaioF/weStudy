import React, { createContext, useState, useContext, useCallback } from "react";
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
}

interface ContextExport {
  group: GroupData | null;
  fetchGroup(id: string): Promise<void>;
  createGroup(data: CreateEditGroupRequestData): Promise<void>;
  editGroup(id: string, data: CreateEditGroupRequestData): Promise<void>;
  deleteGroup(id: string): Promise<void>;
}

const GroupPageContext = createContext<ContextExport>({} as ContextExport);

const GroupPageContextProvider: React.FC = ({ children }) => {
  const [group, setGroup] = useState<GroupData | null>(null);
  const { showToast } = useToast();

  const fetchGroup = useCallback(
    async (id: string): Promise<void> => {
      try {
        const { data } = await api.get(`/api/userGroups/${id}`);
        console.log(data);

        // TODO: topic/subject is not coming from the api
        // TODO: timezone is buggy
        setGroup({
          id: data?.id,
          name: data?.name,
          description: data?.description,
          topic: data?.subject,
          groupSize: String(data?.size),
          timezone: data?.timeZone,
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
    [showToast]
  );

  const editGroup = useCallback(
    async (id: string, data: CreateEditGroupRequestData): Promise<void> => {
      try {
        const response = await api.put(`/api/userGroups/${id}`, data);
        if (response) {
          showToast({
            status: "success",
            title: "Group Update",
            description: "Group was updated successfully",
          });
        } else {
          showToast({
            status: "error",
            title: "Group Update",
            description: "Could not update group",
          });
        }
      } catch (err) {
        showToast({
          status: "error",
          title: "Group Update",
          description: "Could not update group",
        });
      }
    },
    [showToast]
  );

  const deleteGroup = useCallback(
    async (id: string) => {
      try {
        const response = await api.delete(`/api/userGroups/${id}`);

        showToast({
          status: "success",
          title: "Group Delete",
          description: "Group was deleted successfully",
        });
        if (response) {
        } else {
          showToast({
            status: "error",
            title: "Group Delete",
            description: "Could not delete group",
          });
        }
      } catch (err) {
        showToast({
          status: "error",
          title: "Group Delete",
          description: "Could not delete group",
        });
      }
    },
    [showToast]
  );

  // debugger;
  return (
    <GroupPageContext.Provider
      value={{
        group,
        fetchGroup,
        createGroup,
        editGroup,
        deleteGroup,
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
