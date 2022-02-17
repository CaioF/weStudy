import { Flex, Box } from '@chakra-ui/react';
import star from '../../assets/star.svg';
import starActive from '../../assets/star-active.svg';

export type Rate = 0 | 1 | 2 | 3 | 4 | 5;

interface Props {
  currentRate: Rate;
  onClick: (rate: Rate) => void;
}

export function Rating({ currentRate, onClick }: Props) {
  return (
    <Flex>
      {[1, 2, 3, 4, 5].map(rate => (
        <Box key={rate} onClick={() => onClick(rate as Rate)} cursor="pointer">
          <img src={rate <= currentRate ? starActive : star} alt="Star" />
        </Box>
      ))}
    </Flex>
  );
}
