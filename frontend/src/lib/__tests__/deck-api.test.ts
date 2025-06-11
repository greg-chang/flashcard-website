import { getAllDecks, getDeck, getAllFlashcards } from '../deck-api';
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
}); 