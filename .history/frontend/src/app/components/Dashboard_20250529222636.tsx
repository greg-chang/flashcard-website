'use client';
import { Box, Heading, Text, SimpleGrid, VStack } from '@chakra-ui/react';
import Header from './Header';

export default function Dashboard() {
    return(
        <Box minH="100vh" bg="pink.100">
        <Header />
        <Box p={10}>
        <Heading size="lg" mb={4}>Welcome to your Dashboard</Heading>
        <Text mb={6}>Here to manage flashcards, plans, and more.</Text>
        </Box>
        </Box> 
    );
}