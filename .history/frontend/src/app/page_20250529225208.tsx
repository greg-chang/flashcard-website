'use client';
import Homepage from './components/Homepage';
import UserInterface from './components/UserInterface';
import Dashboard from './components/Dashboard';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <main className="min-h-screen bg-gray-100">
      {isSignedIn ? <Dashboard /> : <Homepage />}
    </main>
  );
}
