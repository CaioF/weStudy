import { extendTheme } from '@chakra-ui/react';

const styles = {
  global: {
    'html, body': {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 400,
      fontSize: '16px',
    },
  },
};

const colors = {
  white: '#ffffff',
  gray: {
    '300': '#F4F5F7',
    '400': '#C4C4C4',
    '500': '#717171',
  },
  blue: {
    '300': '#94A0FF',
    '900': '#07062E',
  },
  green: {
    '300': '#70C091',
  },
  red: {
    '500': '#E52C2C',
  },
};

export const theme = extendTheme({ colors, styles });
