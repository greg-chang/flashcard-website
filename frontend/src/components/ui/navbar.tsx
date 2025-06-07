"use client"
import React, { useState, useRef, useEffect } from 'react';
import { useUser, SignOutButton } from '@clerk/nextjs';

export default function Navbar() {
    const { user } = useUser();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    return (
        <nav className="w-full bg-sand shadow flex items-center justify-between px-6 py-3">
            {/* Logo */}
            <div className="flex items-center">
                <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
                <span className="font-bold text-xl text-indigo-700">Flashcard App</span>
            </div>
            {/* User Profile */}
            {user && (
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="flex items-center gap-2 focus:outline-none"
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        <img
                            src={user.imageUrl}
                            alt="User"
                            className="h-8 w-8 rounded-full border"
                        />
                        <span className="font-medium text-gray-800">{user.firstName || user.username}</span>
                        <svg
                            className={`w-4 h-4 ml-1 transition-transform ${open ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {/* Dropdown */}
                    {open && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-50 p-2">
                            <div className="px-4 py-2 border-b">
                                <div className="font-semibold">{user.firstName || user.username}</div>
                                <div className="text-sm text-gray-500">{user.emailAddresses?.[0]?.emailAddress}</div>
                            </div>
                            <a
                                href={`/profile`}
                                className="block px-4 py-2 text-indigo-700 hover:bg-gray-100"
                            >
                                View Profile
                            </a>
                            <SignOutButton>
                                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                                    Sign Out
                                </button>
                            </SignOutButton>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}