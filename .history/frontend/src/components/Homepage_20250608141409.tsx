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
import Image from 'next/image';

// 导入你的图片
import landingPageImage from '@/assets/landing_page_main.png'; // 假设你的图片名为 landing_page_main.png

export default function Homepage() {
  return (
    <Box minH="100vh" bg="#FFFBF5" color="black" fontFamily="var(--font-dm-sans)">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        justify="center"
        py={{ base: 10, md: 20 }}
        px={{ base: 4, md: 8 }}
        flex="1" // Occupy available space
      >
        {/* Left Section: Text */}
        <VStack
          align={{ base: 'center', md: 'flex-start' }}
          spacing={6}
          textAlign={{ base: 'center', md: 'left' }}
          maxW={{ base: 'full', md: '50%' }}
          mb={{ base: 10, md: 0 }}
        >
          <Box
            bg="#937C6D"
            p={8}
            borderRadius="xl"
            boxShadow="lg"
            color="white"
            maxW="500px" // Adjust based on your card size in the image
            width="100%"
          >
            <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }} mb={4}>
              Enhance your study routine.
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }}>
              Studying made for Nitta, by students
            </Text>
          </Box>
          {/* Sign Up Button (optional, if you want it closer to the text) */}
          {/* <SignUpButton mode="modal">
            <Button bg="white" _hover={{ bg: 'gray.100' }}>
              Sign Up now for Free!
            </Button>
          </SignUpButton> */}
        </VStack>

        {/* Right Section: Image */}
        <Box
          maxW={{ base: 'full', md: '50%' }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Image
            src={landingPageImage}
            alt="Study Lounge Landing Page Illustration"
            width={700} // Adjust based on the actual image size and desired display
            height={500} // Adjust based on the actual image size and desired display
            layout="responsive" // Make image responsive
            objectFit="contain" // Ensure image fits without cropping
            priority // Prioritize loading for LCP
          />
        </Box>
      </Flex>

      {/* Footer */}
      <Flex
        as="footer"
        bg="#937C6D"
        color="white"
        py={4}
        px={8}
        justify="space-between"
        align="center"
        mt="auto" // Push footer to bottom
      >
        <Text fontSize="lg" fontWeight="bold">studylounge</Text>
        <HStack spacing={4}>
          <Text>GitHub</Text>
          {/* You can add a GitHub icon here, e.g., using react-icons */}
        </HStack>
      </Flex>
    </Box>
  );
}
