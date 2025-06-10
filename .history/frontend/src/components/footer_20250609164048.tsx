'use client';

import { Flex, Text, HStack } from '@chakra-ui/react';
import Image from 'next/image';
import GithubLogo from '@/assets/Github Logo.png';

export default function Footer() {
  return (
    <Flex
      as="footer"
      bg="#937C6D"
      color="white"
      py={4}
      px={8}
      justify="space-between"
      align="center"
      mt="auto"
      fontFamily="var(--font-dm-sans)"
      zIndex="1"
      position="relative"
    >
      <Text fontSize="lg" fontWeight="bold">studylounge</Text>
      <HStack spacing={2}>
        <Image
          src={GithubLogo}
          alt="GitHub Logo"
          width={24}
          height={24}
          style={{ objectFit: 'contain' }}
        />
        <Text>GitHub</Text>
      </HStack>
    </Flex>
  );
}