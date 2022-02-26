import { useState, useEffect } from "react";
import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";

export type Range = {
  start: number;
  end: number;
};

interface TimeSliderProps {
  label: string;
  onChange(range: Range): void;
}

export function TimeSlider({ label, onChange }: TimeSliderProps) {
  const [range, setRange] = useState<Range>({ start: 9, end: 12 });

  useEffect(() => {
    onChange(range);
  }, [range, onChange]);

  return (
    <Flex direction="column" width="100%">
      <Text color="blue.900" pb="4px" fontSize="16px">
        {label}
      </Text>
      <RangeSlider
        onChangeEnd={(val) => setRange({ start: val[0], end: val[1] })}
        defaultValue={[9, 12]}
        min={0}
        max={24}
        step={1}
      >
        <RangeSliderTrack bg="gray.200">
          <RangeSliderFilledTrack bg="blue.300" />
        </RangeSliderTrack>

        <RangeSliderThumb boxSize={6} index={0}>
          <Text fontSize="12px" color="blue.900">
            {range.start}
          </Text>
        </RangeSliderThumb>

        <RangeSliderThumb boxSize={6} index={1}>
          <Text fontSize="12px" color="blue.900">
            {range.end}
          </Text>
        </RangeSliderThumb>
      </RangeSlider>
    </Flex>
  );
}
