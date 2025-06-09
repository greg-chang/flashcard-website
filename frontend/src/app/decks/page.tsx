"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { getDecks } from "../../lib/deck-api";
import type { Deck } from "../../types/deck";
import Link from "next/link";

export default function DecksPage() {
  const { getToken } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDecks() {
      setLoading(true);
      setError(null);
      try {
        const data = await getDecks(getToken);
        setDecks(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch decks.");
      } finally {
        setLoading(false);
      }
    }
    fetchDecks();
  }, [getToken]);

  return (
    <div className="max-w-4xl mx-auto mt-24 p-8">
      <h1 className="text-3xl font-bold mb-6 text-expresso">Your Decks</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {decks.map((deck) => (
          <Link
            key={deck.id}
            href={`/decks/${deck.id}`}
            className="block border border-coffee rounded-lg p-6 bg-white shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-expresso mb-2">
              {deck.title}
            </h2>
            <p className="text-walnut mb-2">{deck.description}</p>
            <div className="text-xs text-mocha">
              {deck.labels && deck.labels.length > 0 ? (
                deck.labels.map((label) => (
                  <span
                    key={label}
                    className="inline-block mr-2 px-2 py-1 bg-sand rounded"
                  >
                    {label}
                  </span>
                ))
              ) : (
                <span>No labels</span>
              )}
            </div>
          </Link>
        ))}
      </div>
      {!loading && decks.length === 0 && (
        <div className="text-mocha mt-8">You have no decks yet.</div>
      )}
    </div>
  );
}
