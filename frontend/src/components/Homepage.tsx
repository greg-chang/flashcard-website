'use client';

import { Box, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '@/app/theme';
import Footer from '@/components/footer';
import Group from '@/assets/Group 101.png';

export default function Homepage() {
  return (
    <ChakraProvider theme={theme}>
      <Flex
        direction="column"
        minH="100vh"
        bg="#FFFBF5"
        fontFamily="var(--font-dm-sans)"
      >
        <Box height="50px" />

        <Box w="100%" maxW="85%" mx="auto">
          <Image
            src={Group}
            alt="Hero Image"
            width={1920}
            height={1080}
            layout="responsive"
            objectFit="contain"
            priority
          />
        </Box>
        <Box height="50px" />

        {/* Footer */}
        <Footer />
      </Flex>
    </ChakraProvider>
  );
}