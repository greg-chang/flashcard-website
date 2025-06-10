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

// assets
import Illustration from '@/assets/Illustration.png';
import GroupedCards from '@/assets/Grouped Cards.png';
import StyleLine from '@/assets/Style Line.png';
import GithubLogo from '@/assets/Github Logo.png'; 
// import GoogleLogo from '@/assets/Google Logo.png';

export default function Homepage() {
  return (
    <Flex minH="100vh" direction="column" bg="#FFFBF5" color="black" fontFamily="var(--font-dm-sans)">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="stretch"
        justify="space-between"
        py={{ base: 10, md: 20 }}
        px={{ base: 4, md: 8 }}
        flex="1"
        position="relative"
        overflow="hidden"
      >
        {/* Background Wave */}
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="200px"
          backgroundImage={`url(${StyleLine.src})`}
          backgroundSize="contain"
          backgroundRepeat="no-repeat"
          backgroundPosition="center"
          zIndex="0"
          opacity="1"
          bg="red"
        />

        {/* Left Section: Grouped Cards Image */}
        <Box
          position="relative"
          flex="1"
          minW={{ base: 'full', md: '45%' }}
          maxW={{ base: 'full', md: '45%' }}
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-start"
          alignSelf="flex-start"
          zIndex="1"
        >
          <Image
            src={GroupedCards}
            alt="Grouped Study Cards"
            width={550}
            height={400}
            layout="responsive"
            objectFit="contain"
            priority
          />
          {/* Text Overlay on Grouped Cards */}
          <Box
            position="absolute"
            color="white"
            textAlign="center"
            top="45%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="100%"
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
          flex="1"
          minW={{ base: 'full', md: '45%' }}
          maxW={{ base: 'full', md: '45%' }}
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
          alignSelf="flex-end"
          position="relative"
          zIndex="1"
        >
          <Box
            bg="#FFFBF5"
            p={6}
            borderRadius="xl"
            boxShadow="lg"
            position="relative"
            zIndex="1"
            display="inline-block"
          >
            <Image
              src={Illustration}
              alt="Study Lounge Illustration"
              width={600}
              height={450}
              layout="responsive"
              objectFit="contain"
              priority
            />
          </Box>
          {/* Small brown card elements (re-evaluate positions based on new layout) */}
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
        position="relative"
      >
        <Text fontSize="lg" fontWeight="bold">studylounge</Text>
        <HStack spacing={2}>
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
    </Flex>
  );
}
