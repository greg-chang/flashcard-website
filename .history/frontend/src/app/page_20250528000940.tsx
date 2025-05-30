'use client';
import Homepage from './components/Homepage';
import UserInterface from './components/UserInterface';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <UserInterface />
    </main>
  );
}
