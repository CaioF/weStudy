import {
  Select,
  SelectProps as ChakraSelectProps,
  Flex,
  Text,
} from "@chakra-ui/react";

type SelectProps = {
  label?: string;
  placeholder: string;
  options: string[];
  errorMessage?: string;
} & ChakraSelectProps;

export function SelectForm({
  label,
  placeholder,
  options,
  errorMessage,
  ...rest
}: SelectProps) {
  return (
    <Flex direction="column" width="100%">
      {label && (
        <Text color="blue.900" pb="4px" fontSize="16px">
          {label}
        </Text>
      )}
      <Select color="grey" bgColor="white" {...rest} placeholder={placeholder}>
        {options.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </Select>
      {errorMessage && (
        <Text my="4px" fontSize="12px" color="red">
          {errorMessage}
        </Text>
      )}
    </Flex>
  );
}
