'use client';

import React from 'react';
import GithubLogo from '@/assets/Github Logo.png'; 
export default function Footer() {
  return (
    <footer className="w-full bg-[#5C4033] text-white text-sm py-6 px-4 flex justify-between items-center">
      <span className="font-semibold">studylounge</span>
      <a
        href="https://github.com/greg-chang/flashcard-website"
        target="_blank"
        className="text-white hover:underline flex items-center gap-1"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54..." />
        </svg>
        Github
      </a>
    </footer>
  );
}