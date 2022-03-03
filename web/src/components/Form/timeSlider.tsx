import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  Flex,
} from "@chakra-ui/react";

export type Range = {
  start: number;
  end: number;
};

interface TimeSliderProps {
  label: string;
  start: number;
  end: number;
  onChange(range: Range): void;
}

export function TimeSlider({ label, start, end, onChange }: TimeSliderProps) {
  console.log({ start, end });
  return (
    <Flex direction="column" width="100%">
      <Text color="blue.900" pb="4px" fontSize="16px">
        {label}
      </Text>
      <RangeSlider
        onChangeEnd={(val) => onChange({ start: val[0], end: val[1] })}
        defaultValue={[start, end]}
        min={0}
        max={24}
        step={1}
      >
        <RangeSliderTrack bg="gray.200">
          <RangeSliderFilledTrack bg="blue.300" />
        </RangeSliderTrack>

        <RangeSliderThumb boxSize={6} index={0}>
          <Text fontSize="12px" color="blue.900">
            {start}
          </Text>
        </RangeSliderThumb>

        <RangeSliderThumb boxSize={6} index={1}>
          <Text fontSize="12px" color="blue.900">
            {end}
          </Text>
        </RangeSliderThumb>
      </RangeSlider>
    </Flex>
  );
}
