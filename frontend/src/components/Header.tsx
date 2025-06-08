'use client';
import {
  Box,
  Flex,
  Heading,
  Spacer,
  Button,
  HStack,
  Text,
} from '@chakra-ui/react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';

export default function Header() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={10}
      bg="pink.200"
      px={4}
      py={2}
      shadow="sm"
    >
      <Flex align="center">
        {/* Logo */}
        <Heading size="md" color="black">
        <Flex
          fontSize="2xl"
          fontWeight="800"
          display="flex"
          alignItems="center"
        >
          FLASH
          <Text
            as="span"
            fontSize="2xl"
            fontWeight="800"
            color="green.600"
            maxWidth="60ch"
          >
            CARD
          </Text>
          .ai
        </Flex>
        </Heading>

        <Spacer />

        {/* Right side: Auth buttons or Avatar */}
        {isLoaded && (
          <HStack spacing={4}>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button size="sm" bg="white" _hover={{ bg: 'gray.100' }}>
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm" bg="white" _hover={{ bg: 'gray.100' }}>
                    Sign Up
                  </Button>
                </SignUpButton>
              </>
            )}
          </HStack>
        )}
      </Flex>
    </Box>
  );
}