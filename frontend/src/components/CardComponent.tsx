import React, { useState } from 'react';

interface User {
    id: string; 
    name: string;
    email: string;
}

interface CardComponentProps {
    card: User;
}

const CardComponent: React.FC<CardComponentProps> = ({ card }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(card.id);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy ID:', err);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{card.name}</h2>
            <p className="text-gray-600 mb-2">Email: {card.email}</p>
            <div className="flex items-center space-x-2">
                <p className="text-gray-500 text-sm">ID: {card.id}</p>
                <button
                    onClick={copyToClipboard}
                    className="text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none"
                    title="Copy ID to clipboard"
                >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
            </div>
        </div>
    );
};

export default CardComponent;
