"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ThreadData } from "@liveblocks/client";
import { Thread } from "@liveblocks/react-comments";

import { ThreadMetadata } from "@/liveblocks.config";

type Props = {
  thread: ThreadData<ThreadMetadata>;
  onFocus: (threadId: string) => void;
};

export const PinnedThread = ({ thread, onFocus, ...props }: Props) => {
  // Open pinned threads that have just been created
  const startMinimized = useMemo(
    () => Number(new Date()) - Number(new Date(thread.createdAt)) > 100,
    [thread]
  );

  const [minimized, setMinimized] = useState(startMinimized);
  const avatarIndex = useMemo(() => {
    const seed = thread.id
      .split("")
      .reduce((total, char) => total + char.charCodeAt(0), 0);

    return seed % 30;
  }, [thread.id]);

  return (
    <div
      className='absolute flex cursor-pointer gap-4'
      {...props}
      onClick={(e) => {
        onFocus(thread.id);

        const target = e.target as HTMLElement | null;
        if (
          target?.classList.contains("lb-icon") &&
          target.classList.contains("lb-button-icon")
        ) {
          return;
        }

        setMinimized((value) => !value);
      }}
    >
      <div
        className='relative flex h-9 w-9 select-none items-center justify-center rounded-bl-full rounded-br-full rounded-tl-md rounded-tr-full bg-white shadow'
        data-draggable={true}
      >
        <Image
          src={`https://liveblocks.io/avatars/avatar-${avatarIndex}.png`}
          alt='Comment author'
          width={28}
          height={28}
          draggable={false}
          className='rounded-full'
        />
      </div>
      {!minimized ? (
        <div className='flex min-w-60 flex-col overflow-hidden rounded-lg bg-white text-sm shadow'>
          <Thread
            thread={thread}
            indentCommentContent={false}
            onKeyUp={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
