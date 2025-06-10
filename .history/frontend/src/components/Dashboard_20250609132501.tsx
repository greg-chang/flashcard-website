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
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  Select,
} from '@chakra-ui/react';
import { FiPlus, FiUpload, FiBook, FiTag, FiTrash } from 'react-icons/fi';
import Header from './Header';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [newDeckLabels, setNewDeckLabels] = useState('');
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState('');

  const fetchDecks = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) {
        setError('Authentication token not found. Please log in.');
        return;
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/go/decks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDecks(response.data);
    } catch (err) {
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

  const handleDeleteDeck = async (deckId: string) => {
    try {
      const token = await getToken();
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/go/decks/${deckId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: 'Deck deleted.', status: 'info' });
      fetchDecks();
    } catch (err) {
      toast({ title: 'Delete failed.', status: 'error' });
    }
  };

  const handleCreateDeck = async () => {
    if (!newDeckTitle) {
      toast({
        title: 'Title required.',
        description: 'Please enter a title for your new deck.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsCreatingDeck(true);
    try {
      const token = await getToken();
      const labelsArray = newDeckLabels.split(',').map(label => label.trim()).filter(label => label !== '');

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/go/decks`, {
        title: newDeckTitle,
        description: newDeckDescription,
        labels: labelsArray,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      toast({
        title: 'Deck created!',
        description: `"${response.data.title}" has been created.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setNewDeckTitle('');
      setNewDeckDescription('');
      setNewDeckLabels('');
      onClose();
      fetchDecks();
    } catch (err) {
      toast({
        title: 'Error creating deck.',
        description: 'Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsCreatingDeck(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

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
              <Button leftIcon={<FiPlus />} size="sm" colorScheme="green" onClick={onOpen}>
                New Deck
              </Button>
            </Flex>
            <Text mb={4}>Create, view, edit, and collaborate on decks</Text>

            <Box border="2px" borderColor="gray.200" borderStyle="dashed" borderRadius="lg" p={4} textAlign="center" cursor="pointer" _hover={{ borderColor: 'gray.400' }} onClick={onOpen}>
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
              {!loading && !error && decks.map((deck) => (
                <Box key={deck.id} bg="gray.50" p={4} borderRadius="lg" boxShadow="sm">
                  <Flex justifyContent="space-between" alignItems="center" mb={2}>
                    <Heading size="sm">{deck.title}</Heading>
                    <HStack spacing={2}>
                      <Button size="xs" variant="ghost" leftIcon={<FiUpload />} onClick={() => router.push(`/decks/${deck.id}`)}>
                        Manage
                      </Button>
                      <Button size="xs" variant="ghost" colorScheme="red" leftIcon={<FiTrash />} onClick={() => handleDeleteDeck(deck.id)}>
                        Delete
                      </Button>
                    </HStack>
                  </Flex>
                  <Text fontSize="sm" color="gray.600" mb={2}>{deck.description || 'No description'}</Text>
                  <HStack wrap="wrap">
                    {deck.labels.length > 0 ? deck.labels.map((label, index) => (
                      <Tag key={index} size="sm" borderRadius="full" variant="solid" colorScheme="blue">
                        <TagLeftIcon as={FiTag} />
                        <TagLabel>{label}</TagLabel>
                      </Tag>
                    )) : <Text fontSize="xs" color="gray.400">No labels</Text>}
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Box>

          {/* Right Column: Study Section */}
          <Box>
            <Box bg="white" p={6} borderRadius="xl" boxShadow="md" mb={8}>
              <Heading size="md" mb={4}><Flex alignItems="center"><FiBook /> <Text ml={2}>Study</Text></Flex></Heading>
              <Text mb={4}>Review your flashcard decks</Text>
              <HStack spacing={4}>
                <Select placeholder="Select Deck" onChange={(e) => setSelectedDeckId(e.target.value)}>
                  {decks.map(deck => (
                    <option key={deck.id} value={deck.id}>{deck.title}</option>
                  ))}
                </Select>
                <Button colorScheme="brown" bg="#937C6D" _hover={{ bg: '#7A645A' }} onClick={() => {
                  if (!selectedDeckId) {
                    toast({ title: 'Please select a deck.', status: 'warning' });
                  } else {
                    router.push(`/study/${selectedDeckId}`);
                  }
                }}>
                  STUDY
                </Button>
              </HStack>
            </Box>

            <Box bg="white" p={6} borderRadius="xl" boxShadow="md" minH="200px" display="flex" alignItems="center" justifyContent="center">
              <Text color="gray.500">Study content or progress will appear here.</Text>
            </Box>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Create Deck Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Flashcard Deck</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired mb={4}>
              <FormLabel>Title</FormLabel>
              <Input placeholder="My Awesome Deck" value={newDeckTitle} onChange={(e) => setNewDeckTitle(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea placeholder="A short description..." value={newDeckDescription} onChange={(e) => setNewDeckDescription(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Labels (comma-separated)</FormLabel>
              <Input placeholder="math, science" value={newDeckLabels} onChange={(e) => setNewDeckLabels(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>Cancel</Button>
            <Button colorScheme="green" onClick={handleCreateDeck} isLoading={isCreatingDeck}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}