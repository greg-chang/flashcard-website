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
      bg="transparent"
      px={8}
      py={4}
      shadow="none"
    >
      <Flex align="center">
        {/* Logo */}
        <Text fontSize="2xl" fontWeight="bold" color="black">studylounge</Text>

        <Spacer />

        {/* Right side: Auth buttons or Avatar */}
        {isLoaded && (
          <HStack spacing={4}>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <>
                <SignUpButton mode="modal">
                  <Button size="md" bg="gray.100" _hover={{ bg: 'gray.200' }} borderRadius="md">
                    <HStack spacing={2}>
                      <Text>G</Text>
                      <Text>Sign Up</Text>
                    </HStack>
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