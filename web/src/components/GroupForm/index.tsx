import { useState } from "react";
import { Flex, Text, Stack, Box } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "../Form/input";
import { TextArea } from "../Form/textArea";
import { SelectForm, TimeSlider, Range } from "../Form";
import { api } from "../../services";
import { Button } from "../Button";
import { timezones } from "../../util/timezones";
import { useToast } from "../../hooks/useToast";

const topics = ["Maths", "Biology", "Technology"];
const groupSizes = ["1", "2", "3", "4", "5"];

interface GroupFormData {
  id: string;
  name: string;
  description: string;
  topic: string;
  groupSize: string;
  timezone: string;
}

interface GroupRequestData {
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

interface GroupFormProps {
  action: "create" | "edit";
  groupFormData?: GroupFormData;
}

export function GroupForm({ action, groupFormData }: GroupFormProps) {
  const [sessionTime, setSessionTime] = useState<Range>({ start: 8, end: 15 });
  const { showToast } = useToast();

  const formik = useFormik({
    initialValues: {
      name: groupFormData?.name || "",
      description: groupFormData?.description || "",
      topic: groupFormData?.topic || "",
      groupSize: groupFormData?.groupSize || "",
      timezone: groupFormData?.timezone || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required field"),
      description: Yup.string().required("Required field"),
      topic: Yup.string().required("Required field"),
      groupSize: Yup.string().required("Required field"),
      timezone: Yup.string().required("Required field"),
    }),
    onSubmit: async (values) => {
      const data: GroupRequestData = {
        name: values.name,
        description: values.description,
        size: Number(values.groupSize),
        timeZone: values.timezone,
        timeRanges: [
          {
            day: "Saturday",
            startTime: String(sessionTime.start),
            endTime: String(sessionTime.end),
          },
        ],
        subject: values.topic,
      };
      if (action === "edit" && groupFormData) {
        updateGroup(data);
      } else {
        createGroup(data);
      }
    },
  });

  async function createGroup(data: GroupRequestData) {
    try {
      const response = await api.post("/api/userGroups/", data);
      if (response) {
        showToast({
          status: "success",
          title: "Group Creation",
          description: "Group was created successfully",
        });
      } else {
        showToast({
          status: "error",
          title: "Group Creation",
          description: "Could not create group",
        });
      }
    } catch (err) {
      showToast({
        status: "error",
        title: "Group Creation",
        description: "Could not create group",
      });
    }
  }

  async function updateGroup(data: GroupRequestData) {
    try {
      const response = await api.put(
        `/api/userGroups/${groupFormData?.id}`,
        data
      );
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
  }

  async function handleDeleteGroup() {
    try {
      const response = await api.delete(`/api/userGroups/${groupFormData?.id}`);

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
  }

  return (
    <Flex direction="column" width="100%" justify="center" alignItems="center">
      <Text margin="16px 0 26px 0" fontSize="24px">
        {action === "create" ? "Create group" : "Edit group"}
      </Text>

      <form onSubmit={formik.handleSubmit}>
        <Stack width="100%" px="32px" pb="20px" spacing="14px">
          <Input
            id="name"
            label="Name"
            placeholder="Group name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            errorMessage={formik.errors.name}
          />

          <TextArea
            id="description"
            label="Description"
            placeholder="Math study group in Europe timezone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            errorMessage={formik.errors.description}
          />

          <Stack direction="row">
            <SelectForm
              id="topic"
              label="Topic"
              placeholder="select"
              options={topics}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.topic}
              errorMessage={formik.errors.topic}
            />

            <SelectForm
              id="groupSize"
              label="Group size"
              placeholder="select"
              options={groupSizes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.groupSize}
              errorMessage={formik.errors.groupSize}
            />
          </Stack>

          <SelectForm
            id="timezone"
            label="Timezone"
            placeholder="select"
            options={timezones}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.timezone}
            errorMessage={formik.errors.timezone}
          />

          <TimeSlider
            label="Session time"
            onChange={setSessionTime}
            start={sessionTime.start}
            end={sessionTime.end}
          />

          <Box pt="20px"></Box>

          <Stack pt="20px" direction="row">
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              w={{ base: "100%", md: "fit-content" }}
            >
              {action === "create" ? "Create" : "Update"}
            </Button>

            {action === "edit" && (
              <Button
                bgColor="red"
                disabled={formik.isSubmitting}
                w={{ base: "100%", md: "fit-content" }}
                onClick={handleDeleteGroup}
              >
                Delete
              </Button>
            )}
          </Stack>
        </Stack>
      </form>
    </Flex>
  );
}
