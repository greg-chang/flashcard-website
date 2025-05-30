'use client';
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    //not actually used
  colors: {
    brand: {
      50: '#ffe4ed',
    },
  },
  fonts: {
    heading: 'var(--font-geist-sans), sans-serif',
    body: 'var(--font-geist-sans), sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'pink.100',
        color: 'black',
      },
    },
  },
});

export default theme;