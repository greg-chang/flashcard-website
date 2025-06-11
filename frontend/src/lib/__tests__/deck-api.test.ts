import { getAllDecks, getDeck, getAllFlashcards, createDeckWithFlashcards, editDeck } from '../deck-api';
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

  describe('editDeck', () => {
    const deckId = 'deck-1';
    const deckData = { title: 'Updated Title', description: 'Updated desc', labels: [] };
    const flashcardsToEdit = [
      // Update an existing flashcard
      { id: 'fc-1', front: 'Updated Q1', back: 'Updated A1', starred: true },
      // Create a new flashcard
      { front: 'New Q2', back: 'New A2', starred: false },
    ];
    const updatedDeck: Deck = { id: deckId, owner_id: 'user1', ...deckData };

    it('should edit a deck, update existing flashcards, and create new ones successfully', async () => {
      // 1. Mock deck update
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => updatedDeck,
      });
      // 2. Mock existing flashcard update
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({}) });
      // 3. Mock new flashcard creation
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({}) });

      const result = await editDeck(deckId, deckData, flashcardsToEdit, mockGetToken);

      expect(result).toEqual(updatedDeck);
      expect(mockGetToken).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledTimes(3);

      // Check deck update call
      expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/api/go/decks/${deckId}`, expect.anything());
      // Check existing flashcard update call
      expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/api/go/flashcards/fc-1`, expect.anything());
      // Check new flashcard creation call
      expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/api/go/decks/${deckId}/flashcards`, expect.anything());
    });

    it('should throw an error if the deck update fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Deck update failed',
      });

      await expect(editDeck(deckId, deckData, flashcardsToEdit, mockGetToken)).rejects.toThrow('Deck update failed');
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if an existing flashcard update fails', async () => {
        (fetch as jest.Mock)
          // Mock successful deck update
          .mockResolvedValueOnce({ ok: true, json: async () => updatedDeck })
          // Mock failed flashcard update
          .mockResolvedValueOnce({ ok: false, text: async () => 'Flashcard update failed' });
  
        await expect(editDeck(deckId, deckData, flashcardsToEdit, mockGetToken)).rejects.toThrow('Flashcard update failed');
        expect(fetch).toHaveBeenCalledTimes(2);
      });
  });
}); 