import {
  Flex,
  Text,
  Textarea as ChackraTextArea,
  TextareaProps as ChakraTextAreaProps,
} from "@chakra-ui/react";

type TextAreaProps = {
  label: string;
  placeholder: string;
  value: string;
  errorMessage?: string;
} & ChakraTextAreaProps;

export function TextArea({
  label,
  placeholder,
  value,
  errorMessage,
  ...rest
}: TextAreaProps) {
  return (
    <Flex direction="column" width="100%">
      <Text color="blue.900" pb="4px" fontSize="16px">
        {label}
      </Text>
      <ChackraTextArea
        {...rest}
        placeholder={placeholder}
        value={value}
        filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25))"
        width="100%"
        height="100px"
        minH="100px"
        maxH="100px"
      />
      {errorMessage && (
        <Text my="4px" fontSize="12px" color="red">
          {errorMessage}
        </Text>
      )}
    </Flex>
  );
}
