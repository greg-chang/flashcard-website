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
// import cardBaseImage from '@/assets/card_base.png'; // 假设叠加卡片的基础图片

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
      >
        {/* Left Section: Text Cards */}
        <Box
          position="relative"
          maxW={{ base: 'full', md: '50%' }}
          mb={{ base: 10, md: 0 }}
          display="flex"
          justifyContent={{ base: 'center', md: 'flex-start' }}
          alignItems={{ base: 'center', md: 'flex-start' }}
          p={4} // Add some padding around the stacked cards container
        >
          {/* Back Card 1 (lighter) */}
          <Box
            position="absolute"
            width="90%" // Slightly smaller
            height="90%" // Slightly smaller
            bg="#E7E1DA" // Lighter brown/beige
            borderRadius="xl"
            transform="rotate(-8deg)" // More rotation
            top={{ base: '10%', md: '15%' }}
            left={{ base: '5%', md: '10%' }}
            zIndex="1"
            boxShadow="md"
            display={{ base: 'none', md: 'block' }} // Hide on small screens
          />
          {/* Back Card 2 (mid-tone) */}
          <Box
            position="absolute"
            width="95%" // Slightly smaller than front
            height="95%" // Slightly smaller than front
            bg="#B9A492" // Mid brown
            borderRadius="xl"
            transform="rotate(-4deg)" // Less rotation than back card 1
            top={{ base: '5%', md: '8%' }}
            left={{ base: '2%', md: '5%' }}
            zIndex="2"
            boxShadow="md"
            display={{ base: 'none', md: 'block' }} // Hide on small screens
          />
          {/* Front Card with Text */}
          <Box
            bg="#937C6D"
            p={8}
            borderRadius="xl"
            boxShadow="lg"
            color="white"
            maxW="500px"
            width="100%"
            position="relative"
            zIndex="3"
            textAlign={{ base: 'center', md: 'left' }}
          >
            <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }} mb={4}>
              Enhance your study routine.
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }}>
              Studying made for Nitta, by students
            </Text>
          </Box>
        </Box>

        {/* Right Section: Image Card */}
        <Box
          maxW={{ base: 'full', md: '50%' }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="relative"
          p={4} // Padding to give space for the card style
        >
          <Box
            bg="#FFFBF5" // Card background, matches main background slightly
            p={6} // Inner padding for the image
            borderRadius="xl"
            boxShadow="lg"
            position="relative"
            zIndex="1"
            display="inline-block" // To wrap content tightly
          >
            <Image
              src={landingPageImage}
              alt="Study Lounge Landing Page Illustration"
              width={600} // Adjusted width for better fit within the card
              height={450} // Adjusted height for better fit within the card
              objectFit="contain"
              priority
            />
          </Box>
          {/* Small brown card elements around the image */}
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
          {/* Additional small card in bottom right of image */} 
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
