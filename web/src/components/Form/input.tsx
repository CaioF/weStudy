import {
  Flex,
  Text,
  Input as ChackraInput,
  InputProps as ChackraInputProps,
} from "@chakra-ui/react";

type InputProps = {
  label?: string;
  placeholder: string;
  value: string;
  errorMessage?: string;
} & ChackraInputProps;

export function Input({
  label,
  placeholder,
  value,
  errorMessage,
  ...rest
}: InputProps) {
  return (
    <Flex direction="column" width="100%">
      {label && (
        <Text color="blue.900" pb="4px" fontSize="16px">
          {label}
        </Text>
      )}
      <ChackraInput
        {...rest}
        placeholder={placeholder}
        value={value}
        filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25))"
        width="100%"
      />
      {errorMessage && (
        <Text my="4px" fontSize="12px" color="red">
          {errorMessage}
        </Text>
      )}
    </Flex>
  );
}
