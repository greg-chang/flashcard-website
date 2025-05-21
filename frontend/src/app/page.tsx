'use client';
import Image from "next/image";
import UserInterface from "./components/UserInterface";
export default function Home() {
  return (
    <>
      <UserInterface backendName="go" />
    </>
  );
}
