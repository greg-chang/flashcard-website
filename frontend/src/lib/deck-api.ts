import { Deck } from "../types/deck";
import { Flashcard } from "../types/flashcard";
import { getAuth } from "@clerk/nextjs/server"; // or useAuth if in a React component

/**
 * Creates a deck and its flashcards for the authenticated user.
 * @param deck Deck object (title, description, labels)
 * @param flashcards Array of flashcards (front, back, starred)
 * @param getToken Function to get the Clerk JWT (from useAuth or similar)
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
  const deckRes = await fetch("/api/go/decks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(deck),
  });

  if (!deckRes.ok) {
    const errorText = await deckRes.text();
    throw new Error(`Failed to create deck: ${errorText}`);
  }

  const createdDeck: Deck = await deckRes.json();

  // 2. Create each flashcard
  for (const card of flashcards) {
    const cardRes = await fetch(`/api/go/decks/${createdDeck.id}/flashcards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...card,
        starred: card.starred ?? false,
      }),
    });

    if (!cardRes.ok) {
      const errorText = await cardRes.text();
      throw new Error(`Failed to create flashcard: ${errorText}`);
    }
  }

  return createdDeck;
}
