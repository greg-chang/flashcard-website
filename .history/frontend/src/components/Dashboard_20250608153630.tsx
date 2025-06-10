'use client';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Spinner,
  Button,
  HStack,
  Flex,
  Tag,
  TagLabel,
  TagLeftIcon,
  useToast // Import useToast for error messages
} from '@chakra-ui/react';
import { FiPlus, FiUpload, FiBook, FiTag } from 'react-icons/fi'; // Import icons
import Header from './Header';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';

interface Deck {
  id: string;
  owner_id: string;
  labels: string[];
  title: string;
  description: string;
}

export default function Dashboard() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await getToken();
        if (!token) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/go/decks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDecks(response.data.data); // Assuming data is nested under 'data'
      } catch (err) {
        console.error('Failed to fetch decks:', err);
        setError('Failed to load decks. Please try again later.');
        toast({
          title: 'Error loading decks.',
          description: 'Could not fetch flashcard decks. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, [getToken, toast]);

  return (
    <Box minH="100vh" bg="#FFFBF5" color="black" fontFamily="var(--font-dm-sans)">
      <Header />
      <Box p={10}>
        <Heading size="lg" mb={4}>Home Page</Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {/* Left Column: Decks Section */}
          <Box bg="white" p={6} borderRadius="xl" boxShadow="md">
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Heading size="md"><Flex alignItems="center"><FiBook /> <Text ml={2}>Decks</Text></Flex></Heading>
              <Button leftIcon={<FiPlus />} size="sm" colorScheme="green">
                New Deck
              </Button>
            </Flex>
            <Text mb={4}>Create, view, edit, and collaborate on decks</Text>

            {/* Add New Deck Card */}
            <Box
              border="2px" borderColor="gray.200" borderStyle="dashed"
              borderRadius="lg" p={4} textAlign="center" cursor="pointer"
              _hover={{ borderColor: 'gray.400' }}
              onClick={() => toast({ title: 'Create new deck', description: 'This feature is not yet implemented.', status: 'info' })}
            >
              <Flex direction="column" alignItems="center" justifyContent="center" h="100px">
                <FiPlus size="30px" color="gray.400" />
              </Flex>
            </Box>

            <VStack spacing={4} mt={6} align="stretch">
              {loading && <Spinner size="xl" alignSelf="center" mt={10} />}
              {error && <Text color="red.500" textAlign="center">{error}</Text>}

              {!loading && !error && decks.length === 0 && (
                <Text textAlign="center" color="gray.500">No decks found. Create your first deck!</Text>
              )}

              {decks.map((deck) => (
                <Box key={deck.id} bg="gray.50" p={4} borderRadius="lg" boxShadow="sm">
                  <Flex justifyContent="space-between" alignItems="center" mb={2}>
                    <Heading size="sm">{deck.title}</Heading>
                    <Button size="xs" variant="ghost" leftIcon={<FiUpload />}>
                      Upload
                    </Button>
                  </Flex>
                  <Text fontSize="sm" color="gray.600" mb={2}>{deck.description || 'No description'}</Text>
                  <HStack wrap="wrap">
                    {deck.labels.length > 0 ? (
                      deck.labels.map((label, index) => (
                        <Tag key={index} size="sm" borderRadius="full" variant="solid" colorScheme="blue">
                          <TagLeftIcon as={FiTag} />
                          <TagLabel>{label}</TagLabel>
                        </Tag>
                      ))
                    ) : (
                      <Text fontSize="xs" color="gray.400">No labels</Text>
                    )}
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Box>

          {/* Right Column: Study Section */}
          <Box>
            {/* Study Block */}
            <Box bg="white" p={6} borderRadius="xl" boxShadow="md" mb={8}>
              <Heading size="md" mb={4}><Flex alignItems="center"><FiBook /> <Text ml={2}>Study</Text></Flex></Heading>
              <Text mb={4}>Review your flashcard decks</Text>
              <HStack spacing={4}>
                <Box flex="1" border="1px" borderColor="gray.300" borderRadius="md" p={2}>Select Deck</Box>
                <Button colorScheme="brown" bg="#937C6D" _hover={{ bg: '#7A645A' }}>
                  STUDY
                </Button>
              </HStack>
            </Box>

            {/* Placeholder for Study Content/Progress */}
            <Box bg="white" p={6} borderRadius="xl" boxShadow="md" minH="200px" display="flex" alignItems="center" justifyContent="center">
              <Text color="gray.500">Study content or progress will appear here.</Text>
            </Box>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
}