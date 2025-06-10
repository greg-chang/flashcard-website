// app/dashboard/page.tsx
'use client';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '@/app/theme';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '@/components/footer';
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
  IconButton,
  Select,
} from '@chakra-ui/react';
import { FiPlus, FiUpload } from 'react-icons/fi';
import { useAuth } from '@clerk/nextjs';

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
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/go/decks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDecks(Array.isArray(res.data) ? res.data : []);
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Failed to load decks');
      } finally {
        setLoading(false);
      }
    };
    fetchDecks();
  }, [getToken]);

  const handleDeckClick = (deckId: string) => {
    router.push(`/study/${deckId}`);
  };

  const handleCreateClick = () => {
    router.push('/create-deck');
  };

  return (
    <ChakraProvider theme={theme}>
    <Flex p={10} gap={6} align="start" bg="#FFF8F3">
      {/* Left Column*/}
      <Box flex="1" bg="white" p={6} borderRadius="xl" boxShadow="md">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Decks</Heading>
          <IconButton
            aria-label="Create Deck"
            onClick={handleCreateClick}
            borderRadius="full"
            size="sm"
            colorScheme="teal"
          />
        </Flex>
        <Text mb={4}>Create, view, edit, and collaborate on decks</Text>

        <Box border="2px" borderStyle="dashed" borderColor="gray.300" p={4} borderRadius="lg" mb={4} cursor="pointer" onClick={handleCreateClick}>
          <Flex justify="center" align="center">
            <FiPlus size="24px" color="gray.500" />
          </Flex>
        </Box>

        <Box maxH="65vh" overflowY="auto">
          <VStack spacing={4} align="stretch">
            {loading && <Spinner size="xl" alignSelf="center" mt={10} />}
            {error && <Text color="red.500" textAlign="center">{error}</Text>}
            {!loading && !error && decks.length === 0 && (
              <Text textAlign="center" color="gray.500">No decks found. Create your first deck!</Text>
            )}

            {decks.map((deck) => (
              <Box
                key={deck.id}
                bg="#FCEFE8"
                p={4}
                borderRadius="lg"
                boxShadow="sm"
                _hover={{ boxShadow: 'md' }}
                cursor="pointer"
                onClick={() => handleDeckClick(deck.id)}
              >
                <Flex justify="space-between" align="center" mb={2}>
                  <Heading size="sm">{deck.title}</Heading>
                  <IconButton
                    icon={<FiUpload />}
                    aria-label="Manage Deck"
                    size="xs"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/study/${deck.id}`);
                    }}
                  />
                </Flex>
                <Text fontSize="sm" color="gray.600" mb={2}>{deck.description}</Text>
                <HStack spacing={2} wrap="wrap">
                  {deck.labels.map((label, i) => (
                    <Tag key={i} size="sm" borderRadius="full" colorScheme="red">
                      <TagLabel>{label}</TagLabel>
                    </Tag>
                  ))}
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>

      {/* Right Column*/}
      <Box flex="1" bg="white" p={6} borderRadius="xl" boxShadow="md" minH="500px">
        {/* study interface. */}
      </Box>
      <Footer />
    </Flex>
  </ChakraProvider>
  );
}
