import { Deck } from "../types/deck";
import { Flashcard } from "../types/flashcard";

/**
 * Creates a deck and its flashcards for the authenticated user.
 * @param deck Deck object (title, description, labels)
 * @param flashcards Array of flashcards (front, back, starred)
 * @param getToken Function to get the Clerk JWT (from useAuth)
 * @returns The created Deck object from the backend
 */
export async function createDeckWithFlashcards(
  deck: Omit<Deck, "id" | "owner_id">,
  flashcards: Omit<Flashcard, "id" | "parent_deck">[],
  getToken: () => Promise<string | null>,
): Promise<Deck> {
  const token = await getToken();
  if (!token) throw new Error("No authentication token found");

  // 1. Create the deck
  const deckRes = await fetch("http://localhost:8000/api/go/decks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(deck),
  });

  if (!deckRes.ok) {
    const errorText = await deckRes.text();
    throw new Error(errorText);
  }

  const createdDeck: Deck = await deckRes.json();

  // 2. Create each flashcard
  for (const card of flashcards) {
    const cardRes = await fetch(
      `http://localhost:8000/api/go/decks/${createdDeck.id}/flashcards`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...card,
          starred: card.starred ?? false,
        }),
      },
    );

    if (!cardRes.ok) {
      const errorText = await cardRes.text();
      throw new Error(errorText);
    }
  }

  return createdDeck;
}

/**
 * Fetches all decks belonging to the authenticated user.
 * @param getToken Function to get the Clerk JWT (from useAuth)
 * @returns Array of Deck objects
 */
export async function getAllDecks(
  getToken: () => Promise<string | null>,
): Promise<Deck[]> {
  const token = await getToken();
  if (!token) throw new Error("No authentication token found");

  const res = await fetch("http://localhost:8000/api/go/decks", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }

  const decks: Deck[] = await res.json();
  return decks;
}

/**
 * Fetches a single deck by its ID for the authenticated user.
 * @param id The deck's ID (string)
 * @param getToken Function to get the Clerk JWT (from useAuth)
 * @returns The Deck object
 */
export async function getDeck(
  id: string,
  getToken: () => Promise<string | null>,
): Promise<Deck> {
  const token = await getToken();
  if (!token) throw new Error("No authentication token found");

  const res = await fetch(`http://localhost:8000/api/go/decks/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }

  const deck: Deck = await res.json();
  return deck;
}

/**
 * Fetches all flashcards for a given deck ID for the authenticated user.
 * @param deckId The deck's ID (string)
 * @param getToken Function to get the Clerk JWT (from useAuth)
 * @returns Array of Flashcard objects
 */
export async function getAllFlashcards(
  deckId: string,
  getToken: () => Promise<string | null>,
): Promise<Flashcard[]> {
  const token = await getToken();
  if (!token) throw new Error("No authentication token found");

  const res = await fetch(
    `http://localhost:8000/api/go/decks/${deckId}/flashcards`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }

  const flashcards: Flashcard[] = await res.json();
  return flashcards;
}

/**
 * Edits a deck and its flashcards for the authenticated user.
 * Updates the deck info, updates existing flashcards, creates new ones, and (optionally) deletes removed ones.
 * @param deckId The deck's ID (string)
 * @param deck Deck object (title, description, labels)
 * @param flashcards Array of flashcards (may include new and existing)
 * @param getToken Function to get the Clerk JWT (from useAuth)
 * @returns The updated Deck object from the backend
 */
export async function editDeck(
  deckId: string,
  deck: Omit<Deck, "id" | "owner_id">,
  flashcards: Partial<Flashcard>[], // can include id for existing, or omit for new
  getToken: () => Promise<string | null>,
): Promise<Deck> {
  const token = await getToken();
  if (!token) throw new Error("No authentication token found");

  // 1. Update the deck info
  const deckRes = await fetch(`http://localhost:8000/api/go/decks/${deckId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(deck),
  });

  if (!deckRes.ok) {
    const errorText = await deckRes.text();
    throw new Error(errorText);
  }

  const updatedDeck: Deck = await deckRes.json();

  // 2. Update or create flashcards
  for (const card of flashcards) {
    if (card.id) {
      // Update existing flashcard
      const cardRes = await fetch(
        `http://localhost:8000/api/go/flashcards/${card.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            front: card.front,
            back: card.back,
            starred: card.starred ?? false,
          }),
        },
      );
      if (!cardRes.ok) {
        const errorText = await cardRes.text();
        throw new Error(errorText);
      }
    } else {
      // Create new flashcard
      const cardRes = await fetch(
        `http://localhost:8000/api/go/decks/${deckId}/flashcards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            front: card.front,
            back: card.back,
            starred: card.starred ?? false,
          }),
        },
      );
      if (!cardRes.ok) {
        const errorText = await cardRes.text();
        throw new Error(errorText);
      }
    }
  }

  return updatedDeck;
}
