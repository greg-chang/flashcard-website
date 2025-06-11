import { getAllDecks, getDeck, getAllFlashcards, createDeckWithFlashcards } from '../deck-api';
import { Deck } from '../../types/deck';
import { Flashcard } from '../../types/flashcard';

// Mock the global fetch function
global.fetch = jest.fn();

// Mock getToken function
const mockGetToken = jest.fn().mockResolvedValue('test-token');

describe('Deck API Functions', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    (fetch as jest.Mock).mockClear();
    mockGetToken.mockClear();
  });

  describe('getAllDecks', () => {
    it('should fetch all decks successfully', async () => {
      const mockDecks: Deck[] = [
        { id: '1', title: 'Deck 1', description: 'Desc 1', owner_id: 'user1', labels: [] },
        { id: '2', title: 'Deck 2', description: 'Desc 2', owner_id: 'user1', labels: [] },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockDecks,
      });

      const decks = await getAllDecks(mockGetToken);

      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/go/decks', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer test-token',
        },
      });
      expect(decks).toEqual(mockDecks);
      expect(mockGetToken).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the fetch fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Internal Server Error',
      });

      await expect(getAllDecks(mockGetToken)).rejects.toThrow('Internal Server Error');

      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/go/decks', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer test-token',
        },
      });
      expect(mockGetToken).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if no token is found', async () => {
        mockGetToken.mockResolvedValueOnce(null);

        await expect(getAllDecks(mockGetToken)).rejects.toThrow('No authentication token found');
        expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe('getDeck', () => {
    const mockDeck: Deck = { id: '1', title: 'Deck 1', description: 'Desc 1', owner_id: 'user1', labels: [] };
    const deckId = '1';

    it('should fetch a single deck successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockDeck,
      });

      const deck = await getDeck(deckId, mockGetToken);

      expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/api/go/decks/${deckId}`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer test-token',
        },
      });
      expect(deck).toEqual(mockDeck);
      expect(mockGetToken).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the fetch fails', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          text: async () => 'Deck not found',
        });
  
        await expect(getDeck(deckId, mockGetToken)).rejects.toThrow('Deck not found');
  
        expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/api/go/decks/${deckId}`, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer test-token',
          },
        });
        expect(mockGetToken).toHaveBeenCalledTimes(1);
      });
  
      it('should throw an error if no token is found', async () => {
          mockGetToken.mockResolvedValueOnce(null);
  
          await expect(getDeck(deckId, mockGetToken)).rejects.toThrow('No authentication token found');
          expect(fetch).not.toHaveBeenCalled();
      });
  });

  describe('getAllFlashcards', () => {
    const deckId = '1';
    const mockFlashcards: Flashcard[] = [
      { id: 'fc1', parent_deck: deckId, front: 'Q1', back: 'A1', starred: false },
      { id: 'fc2', parent_deck: deckId, front: 'Q2', back: 'A2', starred: true },
    ];

    it('should fetch all flashcards for a deck successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFlashcards,
      });

      const flashcards = await getAllFlashcards(deckId, mockGetToken);

      expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/api/go/decks/${deckId}/flashcards`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer test-token',
        },
      });
      expect(flashcards).toEqual(mockFlashcards);
      expect(mockGetToken).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the fetch fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Error fetching flashcards',
      });

      await expect(getAllFlashcards(deckId, mockGetToken)).rejects.toThrow('Error fetching flashcards');
    });

    it('should throw an error if no token is found', async () => {
      mockGetToken.mockResolvedValueOnce(null);

      await expect(getAllFlashcards(deckId, mockGetToken)).rejects.toThrow('No authentication token found');
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe('createDeckWithFlashcards', () => {
    const newDeckData = { title: 'New Deck', description: 'A brand new deck', labels: [] };
    const newFlashcardsData = [
      { front: 'Q1', back: 'A1', starred: false },
      { front: 'Q2', back: 'A2', starred: true },
    ];
    const createdDeck: Deck = { id: 'new-deck-id', owner_id: 'user1', ...newDeckData };

    it('should create a deck and its flashcards successfully', async () => {
      // Mock the deck creation fetch call
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => createdDeck,
      });

      // Mock the flashcard creation fetch calls
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({}) });
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({}) });

      const result = await createDeckWithFlashcards(newDeckData, newFlashcardsData, mockGetToken);

      expect(result).toEqual(createdDeck);
      expect(mockGetToken).toHaveBeenCalledTimes(1);
      
      // Check that fetch was called 3 times (1 for deck, 2 for flashcards)
      expect(fetch).toHaveBeenCalledTimes(3);

      // Check the deck creation call
      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/go/decks', expect.anything());

      // Check the flashcard creation calls
      expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/api/go/decks/${createdDeck.id}/flashcards`, expect.anything());
    });

    it('should throw an error if deck creation fails', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            text: async () => 'Deck creation failed',
        });

        await expect(createDeckWithFlashcards(newDeckData, newFlashcardsData, mockGetToken)).rejects.toThrow('Deck creation failed');

        // Should only be called once for the deck, and not for the flashcards
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if a flashcard creation fails', async () => {
        // Mock successful deck creation
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => createdDeck,
        });

        // Mock a failed flashcard creation
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            text: async () => 'Flashcard creation failed',
        });

        await expect(createDeckWithFlashcards(newDeckData, newFlashcardsData, mockGetToken)).rejects.toThrow('Flashcard creation failed');

        // Should be called twice (once for deck, once for the failing flashcard)
        expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
}); 