"use client";

import { useState } from "react";

export default function CreateDeckPage() {
  const [title, setTitle] = useState("Untitled Deck");
  const [description, setDescription] = useState("");
  const [cards, setCards] = useState([{ front: "", back: "" }]);

  const handleCardChange = (idx: number, side: "front" | "back", value: string) => {
    setCards((prev) =>
      prev.map((card, i) =>
        i === idx ? { ...card, [side]: value } : card
      )
    );
  };

  const addCard = () => setCards([...cards, { front: "", back: "" }]);
  const removeCard = (idx: number) =>
    setCards(cards.length > 1 ? cards.filter((_, i) => i !== idx) : cards);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with your API endpoint
    const res = await fetch("/api/go/decks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, cards }),
    });
    if (res.ok) {
      // Optionally redirect or show success
      setTitle("");
      setDescription("");
      setCards([{ front: "", back: "" }]);
      alert("Deck created!");
    } else {
      alert("Failed to create deck.");
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
            <div key={idx} className="flex bg-white items-center border border-coffee rounded-xl">
              <textarea
                className="flex-1 rounded px-3 py-2 focus:outline-none focus:ring-0 focus:ring-coffee resize-none"
                value={card.front}
                onChange={(e) => handleCardChange(idx, "front", e.target.value)}
                placeholder="Term"
                required
              />
              <div className="w-px h-10 bg-[#8F6E4F4D] mx-1" />
              <textarea
                className="flex-1 rounded px-3 py-2 focus:outline-none focus:ring-0 focus:ring-coffee resize-none"
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