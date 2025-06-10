'use client';

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
  ChakraProvider,
} from '@chakra-ui/react';
import { FiPlus, FiUpload } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Footer from '@/components/footer';
import theme from '@/app/theme';

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
  const [selectedDeckId, setSelectedDeckId] = useState('');
  const router = useRouter();
  const toast = useToast();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/go/decks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDecks(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError('Failed to load decks');
      } finally {
        setLoading(false);
      }
    };
    fetchDecks();
  }, [getToken]);

  const handleDeckClick = (id: string) => router.push(`/decks/${id}`);
  const handleCreateClick = () => router.push('/create-deck');
  const handleStudyClick = () => {
    if (selectedDeckId) {
      router.push(`/deck/${selectedDeckId}`);
    } else {
      toast({ title: 'Please select a deck.', status: 'info' });
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Flex direction="column" minH="100vh" bg="#FFF8F3">
        <Flex p={10} gap={6} justify="center" flex="1" flexWrap="wrap">
          {/* Left: Deck List */}
          <Box w="360px" bg="#F4E6DD" p={6} borderRadius="xl" boxShadow="md" border="2px solid #D5C6BA">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading fontSize="xl">Decks </Heading>
            </Flex>

            <Text mb={4} fontSize="sm" color="gray.600">
              Create, view, edit, and collaborate on decks
            </Text>

            <Box
              border="2px dashed #C0B2A4"
              borderRadius="lg"
              p={4}
              mb={6}
              cursor="pointer"
              onClick={handleCreateClick}
              _hover={{ bg: '#F5EDE6' }}
              textAlign="center"
            >
              <FiPlus size="24px" color="gray" />
            </Box>

            <VStack spacing={4} maxH="60vh" overflowY="auto" align="stretch">
              {loading && <Spinner alignSelf="center" />}
              {error && <Text color="red.500">{error}</Text>}
              {!loading && decks.length === 0 && (
                <Text textAlign="center" color="gray.500">No decks found</Text>
              )}
              {decks.map(deck => (
                <Box
                  key={deck.id}
                  bg="#FCEFE8"
                  p={4}
                  borderRadius="lg"
                  _hover={{ bg: '#ECD9CF' }}
                  cursor="pointer"
                  onClick={() => handleDeckClick(deck.id)}
                >
                  <Flex justify="space-between" align="center" mb={2}>
                    <Heading fontSize="md">{deck.title}</Heading>
                    <IconButton
                      icon={<FiUpload />}
                      aria-label="View Deck"
                      size="xs"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeckClick(deck.id);
                      }}
                    />
                  </Flex>
                  <Text fontSize="sm" color="gray.600">{deck.description}</Text>
                  <HStack mt={2}>
                    {deck.labels.map((label, i) => (
                      <Tag key={i} size="sm" borderRadius="full" bg="#E7BFB1" color="#F4E6DD">
                        <TagLabel>{label}</TagLabel>
                      </Tag>
                    ))}
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Box>

          {/* Right Column: Two Boxes */}
          <Flex direction="column" w="360px" gap={6}>
            {/* Top Box: Study */}
            <Box bg="#F4E6DD" p={6} borderRadius="xl" boxShadow="md" border="2px solid #D5C6BA" minH="250px">
              <Heading fontSize="xl" mb={2}>Study </Heading>
              <Text fontSize="sm" color="gray.600">Review your flashcard decks</Text>
              <Select
                placeholder="Select Deck"
                mt={4}
                onChange={(e) => setSelectedDeckId(e.target.value)}
              >
                {decks.map((deck) => (
                  <option key={deck.id} value={deck.id}>{deck.title}</option>
                ))}
              </Select>
              <Button
                mt={3}
                bg="#5C4033"
                color="#F4E6DD"
                w="full"
                _hover={{ bg: '#3D2C23' }}
                onClick={handleStudyClick}
              >
                STUDY
              </Button>
            </Box>

            {/* Bottom Box: Placeholder */}
            <Box bg="#F4E6DD" p={6} borderRadius="xl" boxShadow="md" border="2px solid #D5C6BA" minH="250px">
              {/* Avatar, Preview, or Placeholder */}
            </Box>
          </Flex>
        </Flex>
        <Footer />
      </Flex>
    </ChakraProvider>
  );
}
