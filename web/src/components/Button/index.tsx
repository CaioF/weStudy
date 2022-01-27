import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';

interface Props extends ButtonProps {
  buttonType: 'regular' | 'ghost';
}

const styles = {
  regular: {
    paddingX: '30px',
    bgColor: 'blue.300',
    color: 'white',
  },
  ghost: {
    color: 'blue.300',
    backgroundColor: 'transparent',
    border: '1px solid',
    borderColor: 'blue.300',
    paddingX: '30px',
  },
};

export const Button = (props: Props) => (
  <ChakraButton {...styles[props.buttonType]} {...props}>
    {props.children}
  </ChakraButton>
);
