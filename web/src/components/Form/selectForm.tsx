import { Select, Flex, Text } from "@chakra-ui/react";

interface SelectProps {
  label: string;
  placeholder: string;
  options: string[];
  onChange(value: string): void;
}

export function SelectForm({
  label,
  placeholder,
  options,
  onChange,
}: SelectProps) {
  return (
    <Flex direction="column" width="100%">
      <Text color="blue.900" pb="4px" fontSize="16px">
        {label}
      </Text>
      <Select
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onChange(e.target.value)
        }
      >
        {options.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </Select>
    </Flex>
  );
}
