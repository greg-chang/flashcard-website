import React from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

interface CardComponentProps {
    card: User;
}

const CardComponent: React.FC<CardComponentProps> = ({ card }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{card.name}</h2>
            <p className="text-gray-600 mb-2">Email: {card.email}</p>
            <p className="text-gray-500 text-sm">ID: {card.id}</p>
        </div>
    );
};

export default CardComponent;
