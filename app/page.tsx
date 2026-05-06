"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const router = useRouter();

  const createBoard = () => {
    const id = uuidv4();
    router.push(`/board/${id}`);
  };

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center gap-8 bg-primary-black text-white">
      <div className="flex flex-col items-center gap-3">
        <Image
          src="/assets/logo-ui-studio.png"
          alt="UI Studio"
          width={240}
          height={24}
          priority
        />
        <p className="max-w-sm text-center text-sm text-primary-grey-300">
          A real-time collaborative design canvas. Draw shapes, chat with your
          team, and export your work — all in one place.
        </p>
      </div>

      <button
        onClick={createBoard}
        className="rounded bg-primary-green px-6 py-3 text-sm font-semibold text-primary-black transition-opacity hover:opacity-90"
      >
        Create New Board
      </button>

      <p className="text-xs text-primary-grey-300">
        Share the URL with teammates to collaborate in real-time.
      </p>
    </main>
  );
}
