import { useState, useEffect } from 'react';
import {
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    Text,
    Box,
    Flex,
  } from '@chakra-ui/react'

export type Range = {
  start: number;
  end: number;
}

interface TimeSliderProps {
  label: string;
  onChange(range: Range): void;
}

export function TimeSlider({ label, onChange }: TimeSliderProps) {
    const [range, setRange] = useState<Range>({start: 9, end: 12});

    useEffect(() => {
      onChange(range);
    }, [range])
    
    return (
        <Flex bgColor="gray.300" direction="column" justify="center" alignItems="center" width="100%">
            <RangeSlider bgColor="gray.300" onChangeEnd={(val) => setRange({start: val[0], end: val[1]})} defaultValue={[9, 12]} min={0} max={24} step={1}>

                <RangeSliderTrack bg='blue.100'>
                <RangeSliderFilledTrack bg='green.300' />
                </RangeSliderTrack>

                <RangeSliderThumb boxSize={6} index={0}>
                    <Box><Text>{range.start}</Text></Box>
                </RangeSliderThumb>
                
                <RangeSliderThumb boxSize={6} index={1}>
                    <Box><Text>{range.end}</Text></Box>
                </RangeSliderThumb>

           </RangeSlider>
      </Flex>
    );
}
  