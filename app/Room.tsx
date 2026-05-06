"use client";

import { LiveMap } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import Loader from "@/components/Loader";
import { RoomProvider } from "../liveblocks.config";

const MissingKeyBanner = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-primary-black px-6 text-center text-white">
    <p className="text-xl font-semibold text-red-400">Liveblocks key not configured</p>
    <p className="max-w-md text-sm text-primary-grey-300">
      Add <code className="rounded bg-primary-grey-200 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY</code> to{" "}
      <code className="rounded bg-primary-grey-200 px-1.5 py-0.5 font-mono text-xs">.env.local</code>.
      <br />
      See <code className="font-mono text-xs">.env.example</code> for instructions.
    </p>
  </div>
);

const Room = ({ children, roomId }: { children: React.ReactNode; roomId?: string }) => {
  if (!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) {
    return <MissingKeyBanner />;
  }

  return (
    <RoomProvider
      id={roomId ?? "fig-room"}
      initialPresence={{ cursor: null, cursorColor: null, editingText: null }}
      initialStorage={{
        canvasObjects: new LiveMap(),
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default Room;
