"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { getDeck, getAllFlashcards } from "../../../lib/deck-api";
import type { Deck } from "../../../types/deck";
import type { Flashcard } from "../../../types/flashcard";
import Link from "next/link";

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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-expresso">{deck.title}</h1>
        <div className="flex gap-2">
          <Link
            href={`/decks/${deck.id}/edit`}
            className="px-6 py-2 bg-walnut text-white rounded-lg hover:bg-expresso transition"
          >
            Edit
          </Link>
          <Link
            href={`/study/${deck.id}`}
            className="px-6 py-2 bg-coffee text-white rounded-lg hover:bg-expresso transition"
          >
            Study
          </Link>
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
            <div className="min-h-20 text-walnut flex-1 px-3 py-2 flex-row items-start justify-start">
              {card.front}
            </div>
            <div className="w-px self-stretch bg-gray-300 mx-1" />
            <div className="min-h-20 text-walnut flex-1 px-3 py-2 flex-row items-start justify-start">
              {card.back}
            </div>
            {card.starred && (
              <span className="ml-2 pr-2 text-yellow-500" title="Starred">
                ★
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
