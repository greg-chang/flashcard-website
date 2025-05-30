'use client';
import { SignUpButton, SignInButton } from '@clerk/nextjs';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-pink-100 text-black">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-pink-200 shadow">
        <h1 className="text-lg font-semibold">Logo and Brand Name</h1>
        <div className="space-x-2">
          <SignInButton mode="modal">
            <button className="bg-white px-3 py-1 rounded">Login</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-white px-3 py-1 rounded">Sign Up</button>
          </SignUpButton>
        </div>
      </header>

      {/* Brand Purpose */}
      <section className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Brand Purpose</h2>
          <p className="mb-4">Reinforce brand identity with slogan or other supporting information</p>
          <SignUpButton mode="modal">
            <button className="bg-white px-4 py-2 rounded">Sign Up</button>
          </SignUpButton>
        </div>
        <div className="w-full h-48 bg-pink-300 rounded-full" />
      </section>

      {/* Logos */}
      <section className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Logos</h2>
          <p className="mb-4">Show a statistic about the need for our brand</p>
          <SignUpButton mode="modal">
            <button className="bg-white px-4 py-2 rounded">Sign Up</button>
          </SignUpButton>
        </div>
        <div className="w-full h-48 bg-pink-300 rounded-full" />
      </section>

      {/* Features */}
      <section className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Introduction of the functions offered on the website</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["flashcards", "generative set", "other"].map((title) => (
            <div key={title} className="bg-pink-200 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">{title}</h3>
              <SignUpButton mode="modal">
                <button className="bg-white px-3 py-1 rounded">Sign Up</button>
              </SignUpButton>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}