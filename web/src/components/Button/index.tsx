import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';

interface Props extends ButtonProps {
  buttonType?: 'regular' | 'ghost';
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

export const Button = (props: Props) => {
  const buttonStyles = styles[props.buttonType ? props.buttonType : 'regular'];

  const chakraProps = Object.keys(props)
    .filter(key => key !== 'buttonType')
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: props[key as keyof Props],
      };
    }, {});

  return (
    <ChakraButton {...buttonStyles} {...chakraProps}>
      {props.children}
    </ChakraButton>
  );
};
