import { ChangeEvent } from "react";
import { Flex, Text, Textarea as ChackraTextArea } from "@chakra-ui/react";

interface TextAreaProps {
  label: string;
  placeholder: string;
  value: string;
  onChange(value: string): void;
}

export function TextArea({
  label,
  placeholder,
  value,
  onChange,
}: TextAreaProps) {
  return (
    <Flex direction="column" width="100%">
      <Text color="blue.900" pb="4px" fontSize="16px">
        {label}
      </Text>
      <ChackraTextArea
        placeholder={placeholder}
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25))"
        width="100%"
        height="100px"
        minH="100px"
        maxH="100px"
      />
    </Flex>
  );
}
