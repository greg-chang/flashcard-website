"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { getDeck, getAllFlashcards } from "../../../lib/deck-api";
import type { Deck } from "../../../types/deck";
import type { Flashcard } from "../../../types/flashcard";
import { FiChevronLeft, FiChevronRight, FiRefreshCw } from "react-icons/fi";

export default function StudyPage() {
    const { id } = useParams<{ id: string }>();
    const { getToken } = useAuth();
    const router = useRouter();
    const [deck, setDeck] = useState<Deck | null>(null);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (!id) return;
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
        fetchData();
    }, [id, getToken]);

    const handleNextCard = useCallback(() => {
        if (flashcards.length === 0) return;
        setIsFlipped(false);
        setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    }, [flashcards.length]);

    const handlePrevCard = useCallback(() => {
        if (flashcards.length === 0) return;
        setIsFlipped(false);
        setCurrentCardIndex(
            (prev) => (prev - 1 + flashcards.length) % flashcards.length
        );
    }, [flashcards.length]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === " ") {
                event.preventDefault();
                setIsFlipped((prev) => !prev);
            } else if (event.key === "ArrowRight") {
                handleNextCard();
            } else if (event.key === "ArrowLeft") {
                handlePrevCard();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleNextCard, handlePrevCard]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#FBF6F1]">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#FBF6F1] text-red-600">
                {error}
            </div>
        );
    }

    if (!deck || flashcards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#FBF6F1] text-mocha">
                <p>Deck not found or no flashcards in this deck.</p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 px-4 py-2 bg-coffee text-white rounded-lg hover:bg-expresso transition"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const currentCard = flashcards[currentCardIndex];

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#FBF6F1] text-[#5C4033] p-8">
            <button onClick={() => router.push(`/decks/${id}`)} className="absolute top-24 right-10 text-3xl font-semibold hover:underline">
            Exit
            </button>

            <div className="flex items-center justify-center w-full max-w-4xl">
                <button
                    onClick={handlePrevCard}
                    className="p-4 text-4xl"
                    aria-label="Previous card"
                >
                    <FiChevronLeft />
                </button>

                <div className="flex-grow flex flex-col items-center">
                    <div
                        className="w-full max-w-2xl h-80 cursor-pointer [perspective:1000px]"
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <div
                            className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? "rotate-y-180" : ""
                                }`}
                        >
                            <div className="absolute w-full h-full [backface-visibility:hidden] bg-white rounded-2xl shadow-lg flex items-center justify-center p-6">
                                <p className="text-3xl font-semibold text-center">
                                    {currentCard.front}
                                </p>
                            </div>
                            <div className="absolute w-full h-full [backface-visibility:hidden] bg-white rounded-2xl shadow-lg flex items-center justify-center p-6 transform rotate-y-180">
                                <p className="text-3xl font-semibold text-center">
                                    {currentCard.back}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm text-gray-500">
                        <span>Click to flip</span>
                        <FiRefreshCw className="ml-2" />
                    </div>
                </div>

                <button
                    onClick={handleNextCard}
                    className="p-4 text-4xl"
                    aria-label="Next card"
                >
                    <FiChevronRight />
                </button>
            </div>
        </div>
    );
}