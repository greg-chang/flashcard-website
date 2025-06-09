"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { getDeck, getAllFlashcards } from "../../../lib/deck-api";
import type { Deck } from "../../../types/deck";
import type { Flashcard } from "../../../types/flashcard";

export default function ViewDeckPage() {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const deckData = await getDeck(id, getToken);
        const flashcardData = await getAllFlashcards(id, getToken);
        setDeck(deckData);
        setFlashcards(flashcardData);
      } catch (err: any) {
        setError(err.message || "Failed to load deck.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id, getToken]);

  if (loading) {
    return <div className="max-w-5xl mx-auto mt-24 p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto mt-24 p-8 text-red-600">{error}</div>
    );
  }

  if (!deck) {
    return (
      <div className="max-w-5xl mx-auto mt-24 p-8 text-mocha">
        Deck not found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-24 p-8">
      <div className="mb-4">
        <div className="min-w-96 w-full text-3xl font-bold text-expresso">
          {deck.title}
        </div>
      </div>
      <div className="mb-6">
        <div className="w-full min-h-20 text-expresso bg-[#8F6E4F33] border-none rounded px-3 py-2">
          {deck.description}
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-2 text-expresso">Cards</h2>
      <div className="space-y-4 mb-6">
        {flashcards.map((card) => (
          <div
            key={card.id}
            className="flex bg-white items-center border border-walnut rounded-xl"
          >
            <div className="min-h-20 text-walnut flex-1 rounded px-3 py-2">
              {card.front}
            </div>
            <div className="min-h-20 w-px h-10 bg-[#8F6E4F4D] mx-1" />
            <div className="text-walnut flex-1 rounded px-3 py-2">
              {card.back}
            </div>
            {card.starred && (
              <span className="ml-2 text-yellow-500" title="Starred">
                ★
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
