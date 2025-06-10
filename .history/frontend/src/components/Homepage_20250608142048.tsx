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
import Illustration from '@/assets/Illustration.jpg'; // Use Illustration.jpg for the main image
import GroupedCards from '@/assets/Grouped Cards.jpg'; // Use Grouped Cards.jpg for the left section
import StyleLine from '@/assets/Style Line.png'; // For background wave
import GithubLogo from '@/assets/Github Logo.jpg'; // For footer GitHub logo

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
        position="relative" // For positioning pseudo-elements or background waves if needed
        overflow="hidden" // Hide overflowing background parts
      >
        {/* Background Wave */}
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          backgroundImage={`url(${StyleLine.src})`}
          backgroundSize="cover" // Adjust as needed, e.g., '100% auto'
          backgroundRepeat="no-repeat"
          backgroundPosition="center bottom" // Position the wave at the bottom or center
          zIndex="0"
        />

        {/* Left Section: Grouped Cards Image */}
        <Box
          position="relative"
          maxW={{ base: 'full', md: '50%' }}
          mb={{ base: 10, md: 0 }}
          display="flex"
          justifyContent={{ base: 'center', md: 'flex-start' }}
          alignItems={{ base: 'center', md: 'flex-start' }}
          p={4} // Add some padding around the stacked cards container
          zIndex="1"
        >
          <Image
            src={GroupedCards}
            alt="Grouped Study Cards"
            width={550} // Adjust based on your image and desired display
            height={400} // Adjust based on your image and desired display
            objectFit="contain"
            priority
          />
          {/* Text Overlay on Grouped Cards (if needed, adjust positioning) */}
          <Box
            position="absolute"
            color="white"
            textAlign="center"
            // You'll need to adjust these values to perfectly overlay text on the image
            top="35%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="80%"
          >
            <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }} mb={2}>
              Enhance your study routine.
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }}>
              Studying made for Nitta, by students
            </Text>
          </Box>
        </Box>

        {/* Right Section: Illustration Image Card */}
        <Box
          maxW={{ base: 'full', md: '50%' }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="relative"
          p={4} // Padding to give space for the card style
          zIndex="1"
        >
          <Box
            bg="#FFFBF5" // Card background
            p={6} // Inner padding for the image
            borderRadius="xl"
            boxShadow="lg"
            position="relative"
            zIndex="1"
            display="inline-block" // To wrap content tightly
          >
            <Image
              src={Illustration}
              alt="Study Lounge Illustration"
              width={600} // Adjusted width for better fit within the card
              height={450} // Adjusted height for better fit within the card
              objectFit="contain"
              priority
            />
          </Box>
          {/* Small brown card elements (if still desired, adjust as needed) */}
          <Box
            position="absolute"
            bg="#937C6D"
            width="60px"
            height="40px"
            borderRadius="md"
            top="5%"
            right="10%"
            transform="rotate(15deg)"
            zIndex="0"
            display={{ base: 'none', md: 'block' }}
          />
          <Box
            position="absolute"
            bg="#937C6D"
            width="40px"
            height="30px"
            borderRadius="md"
            bottom="15%"
            left="20%"
            transform="rotate(-20deg)"
            zIndex="0"
            display={{ base: 'none', md: 'block' }}
          />
          <Box
            position="absolute"
            bg="#937C6D"
            width="50px"
            height="35px"
            borderRadius="md"
            bottom="5%"
            right="5%"
            transform="rotate(5deg)"
            zIndex="0"
            display={{ base: 'none', md: 'block' }}
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
        mt="auto"
        fontFamily="var(--font-dm-sans)"
        zIndex="1"
        position="relative" // Ensure footer is above background wave
      >
        <Text fontSize="lg" fontWeight="bold">studylounge</Text>
        <HStack spacing={2}> {/* Reduced spacing for icon and text */}
          <Image
            src={GithubLogo}
            alt="GitHub Logo"
            width={24}
            height={24}
            objectFit="contain"
          />
          <Text>GitHub</Text>
        </HStack>
      </Flex>
    </Box>
  );
}
