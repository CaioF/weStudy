import { ChangeEvent } from 'react';
import { Flex, Text, Input as ChackraInput } from "@chakra-ui/react";

interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange(value: string): void;
}

export function Input({ label, placeholder, value, onChange }: InputProps) {
  return (
    <Flex direction="column" width="100%">
      <Text color="blue.900" pb="4px" fontSize="16px">{label}</Text>
      <ChackraInput 
        placeholder={placeholder}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25))"
        width="100%"
      />
    </Flex>
  );
}