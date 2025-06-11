"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createDeckWithFlashcards } from "../../lib/deck-api";

export default function CreateDeckPage() {
  const [title, setTitle] = useState("Untitled Deck");
  const [description, setDescription] = useState("");
  const [cards, setCards] = useState([{ front: "", back: "" }]);
  const { getToken } = useAuth();
  const router = useRouter();

  const handleCardChange = (
    idx: number,
    side: "front" | "back",
    value: string,
  ) => {
    setCards((prev) =>
      prev.map((card, i) => (i === idx ? { ...card, [side]: value } : card)),
    );
  };

  const addCard = () => setCards([...cards, { front: "", back: "" }]);
  const removeCard = (idx: number) =>
    setCards(cards.length > 1 ? cards.filter((_, i) => i !== idx) : cards);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdDeck = await createDeckWithFlashcards(
        { title, description, labels: [] },
        cards.map((card) => ({
          front: card.front,
          back: card.back,
          starred: false,
        })),
        getToken,
      );
      setTitle("Untitled Deck");
      setDescription("");
      setCards([{ front: "", back: "" }]);
      // Redirect to the new deck's page
      router.push(`/decks/${createdDeck.id}`);
    } catch (err: any) {
      let message = "Failed to create deck.";
      if (err?.message) {
        try {
          // Try to parse as JSON and show the error field if present
          const parsed = JSON.parse(err.message);
          message = parsed.error || parsed.message || message;
        } catch {
          // If not JSON, just show the message string
          message = err.message;
        }
      }
      alert(message);
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-24 p-8">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            className="w-min text-3xl border-0 px-0 py-2 focus:outline-none focus:ring-0"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter deck title"
          />
        </div>
        <div className="mb-6">
          <textarea
            className="w-full text-expresso bg-[#8F6E4F33] border-none rounded px-3 py-2 focus:outline-none focus:ring-0"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description here.."
          />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-expresso">Cards</h2>
        <div className="space-y-4 mb-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="flex bg-white items-center border border-walnut rounded-xl"
            >
              <textarea
                className="text-walnut flex-1 rounded px-3 py-2 focus:outline-none focus:ring-0 focus:ring-coffee resize-none"
                value={card.front}
                onChange={(e) => handleCardChange(idx, "front", e.target.value)}
                placeholder="Term"
                required
              />
              <div className="w-px h-10 bg-[#8F6E4F4D] mx-1" />
              <textarea
                className="text-walnut flex-1 rounded px-3 py-2 focus:outline-none focus:ring-0 focus:ring-coffee resize-none"
                value={card.back}
                onChange={(e) => handleCardChange(idx, "back", e.target.value)}
                placeholder="Definition"
                required
              />
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs text-expresso hover:underline"
                onClick={() => removeCard(idx)}
                disabled={cards.length === 1}
                title="Remove card"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mb-6 px-4 py-2 bg-coffee text-white rounded hover:bg-expresso transition"
          onClick={addCard}
        >
          + Add Card
        </button>
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-expresso text-white font-semibold rounded hover:bg-coffee transition"
          >
            Create Deck
          </button>
        </div>
      </form>
    </div>
  );
}
