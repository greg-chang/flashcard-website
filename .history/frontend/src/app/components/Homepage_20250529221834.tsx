'use client';
import {
  Box,
  Button,
  Center,
  Heading,
  Stack,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import Header from './Header';

export default function Homepage() {
  return (
    <Box minH="100vh" bg="pink.50" color="black">
      <Header />
      {/* Intro*/}
      {/* https://www.chakra-ui.com/docs/components/simple-grid
      // https://www.chakra-ui.com/docs/components/stack */}
      <SimpleGrid columns={[1, null, 2]} spacing={8} p={8} alignItems="center">
        <VStack align="start" spacing={4}>
          <Heading size="lg">Brand Purpose</Heading>
          <Text>
            This is flashcard for ecs162 studing and practice. Blua BluaBluaBluaBlua You can study any subjects or any languages
          </Text>
          <SignUpButton mode="modal">
            <Button bg="white" _hover={{ bg: 'gray.100' }}>
              Sign Up now for Free!
            </Button>
          </SignUpButton>
        </VStack>
        <Box bg="pink.300" h="200px" borderRadius="full" />
      </SimpleGrid>

      {/* LOGO*/}
      <SimpleGrid columns={[1, null, 2]} spacing={8} p={8} alignItems="center">
        <Box bg="pink.400" h="200px" borderRadius="full" />
        <VStack align="start" spacing={4}>
          <Heading size="lg">Logos</Heading>
          
          <Text>This is flashcard for ecs162 studing and practice. Blua BluaBluaBluaBlua You can study any subjects or any languages</Text>
          <SignUpButton mode="modal">
            <Button bg="white" _hover={{ bg: 'gray.100' }}>
            Sign Up now for Nitta!
            </Button>
          </SignUpButton>
        </VStack>
      </SimpleGrid>

      {/* Funtionality introduction  Maybe add some content here?*/}
      <Center p={8}>
        <VStack spacing={6} w="full">
          <Heading size="md">Introduction of the functions offered on the website</Heading>
          <SimpleGrid columns={[1, null, 3]} spacing={6} w="full">
            {['Flashcards', 'Generative Set', 'Other'].map((feature) => (
              <Box key={feature} bg="pink.200" p={6} borderRadius="lg" textAlign="center">
                <Text fontWeight="bold" mb={4}>{feature}</Text>
                <SignUpButton mode="modal">
                  <Button bg="white" _hover={{ bg: 'gray.100' }}>
                    Sign Up now for whatever reason!
                  </Button>
                </SignUpButton>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Center>
    </Box>
  );
}
