// app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Box,
  VStack,
  Heading,
  Text,
  Spinner,
  Button,
  Tag,
  TagLabel,
  HStack,
  useToast,
  Flex,
} from '@chakra-ui/react';

interface Deck {
  id: string;
  title: string;
  description: string;
  labels: string[];
}

export default function DashboardPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const res = await axios.get('/api/go/decks');
        setDecks(Array.isArray(res.data) ? res.data : []);
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Failed to load decks');
      } finally {
        setLoading(false);
      }
    };
    fetchDecks();
  }, []);

  const handleDeckClick = (deckId: string) => {
    router.push(`/study/${deckId}`);
  };

  const handleCreateClick = () => {
    router.push('/create-deck');
  };

  return (
    <Flex p={6} gap={8} align="start">
      {/* Left: Deck list */}
      <Box flex="1">
        <Heading size="lg" mb={4}>Your Decks</Heading>
        <Button colorScheme="teal" onClick={handleCreateClick} mb={4} alignSelf="flex-end">
          Create Deck
        </Button>

        <Box maxH="70vh" overflowY="auto">
          {loading && <Spinner size="xl" />}
          {error && <Text color="red.500">{error}</Text>}
          {!loading && !error && decks.length === 0 && (
            <Text>No decks found. Start by creating one!</Text>
          )}

          <VStack spacing={4} align="stretch">
            {decks.map((deck) => (
              <Box
                key={deck.id}
                p={4}
                borderWidth={1}
                borderRadius="md"
                _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                onClick={() => handleDeckClick(deck.id)}
              >
                <Heading size="md">{deck.title}</Heading>
                <Text mt={2} color="gray.600">{deck.description}</Text>
                <HStack mt={2} spacing={2} wrap="wrap">
                  {deck.labels.map((label, index) => (
                    <Tag key={index} variant="subtle" colorScheme="blue">
                      <TagLabel>{label}</TagLabel>
                    </Tag>
                  ))}
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>

      {/* Right: Placeholder box */}
      <Box flex="1" bg="gray.50" borderWidth={1} borderRadius="md" p={4}>
        {/* Leave this blank for now */}
      </Box>
    </Flex>
  );
} 
