"use client";

import Image from "next/image";
import { memo, useEffect } from "react";
import { toast } from "sonner";

import { navElements } from "@/constants";
import { ActiveElement, NavbarProps } from "@/types/type";
import { useRoom, useStatus } from "@/liveblocks.config";

import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import ShapesMenu from "./ShapesMenu";
import ActiveUsers from "./users/ActiveUsers";
import { NewThread } from "./comments/NewThread";

const statusDot: Record<string, string> = {
  connected: "bg-green-400",
  connecting: "bg-yellow-400",
  reconnecting: "bg-yellow-400",
  disconnected: "bg-red-500",
};

const statusLabel: Record<string, string> = {
  connected: "Live",
  connecting: "Connecting…",
  reconnecting: "Reconnecting…",
  disconnected: "Offline",
};

const formatRoomName = (id: string) => {
  if (!id || id === "fig-room") return "Untitled board";
  if (id.length <= 14) return id;
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
};

const Navbar = ({
  activeElement,
  imageInputRef,
  handleImageUpload,
  handleActiveElement,
}: NavbarProps) => {
  const status = useStatus();
  const room = useRoom();
  const roomName = formatRoomName(room.id);

  useEffect(() => {
    if (status === "disconnected") toast.error("Connection lost. Trying to reconnect…");
    if (status === "connected") toast.dismiss();
  }, [status]);

  const isActive = (value: string | Array<ActiveElement>) =>
    (activeElement && activeElement.value === value) ||
    (Array.isArray(value) &&
      value.some((val) => val?.value === activeElement?.value));

  return (
    <nav className="flex select-none items-center justify-between gap-4 border-b border-primary-grey-200 bg-primary-black px-5 py-2 text-white">
      <div className="flex min-w-0 items-center gap-3">
        <Image
          src="/assets/logo-ui-studio.png"
          alt="UI STUDIO"
          width={170}
          height={16}
          priority
        />
        <span className="hidden h-5 w-px bg-primary-grey-200 md:inline-block" />
        <span
          className="hidden truncate font-mono text-xs text-primary-grey-300 md:inline-block"
          title={room.id}
        >
          {roomName}
        </span>
      </div>

      <ul className="flex flex-row flex-wrap items-center justify-center gap-1 rounded border border-primary-grey-200 bg-primary-black/40 p-1">
        {navElements.map((item: ActiveElement | any) => (
          <Tooltip key={item.name}>
            <li
              onClick={() => {
                if (Array.isArray(item.value)) return;
                handleActiveElement(item);
              }}
              className={`group flex items-center justify-center rounded px-2.5 py-1.5 transition-colors
              ${
                isActive(item.value)
                  ? "bg-primary-green"
                  : "hover:bg-primary-grey-200"
              }
              `}
            >
              <TooltipTrigger asChild>
                <span>
                  {Array.isArray(item.value) ? (
                    <ShapesMenu
                      item={item}
                      activeElement={activeElement}
                      imageInputRef={imageInputRef}
                      handleActiveElement={handleActiveElement}
                      handleImageUpload={handleImageUpload}
                    />
                  ) : item?.value === "comments" ? (
                    <NewThread>
                      <Button
                        aria-label={item.name}
                        className="relative h-5 w-5 object-contain"
                      >
                        <Image
                          src={item.icon}
                          alt={item.name}
                          fill
                          className={isActive(item.value) ? "invert" : ""}
                        />
                      </Button>
                    </NewThread>
                  ) : (
                    <Button
                      aria-label={item.name}
                      className="relative h-5 w-5 object-contain"
                    >
                      <Image
                        src={item.icon}
                        alt={item.name}
                        fill
                        className={isActive(item.value) ? "invert" : ""}
                      />
                    </Button>
                  )}
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {item.name}
              </TooltipContent>
            </li>
          </Tooltip>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 rounded border border-primary-grey-200 px-2 py-1 text-[11px] text-primary-grey-300">
              <span
                className={`h-2 w-2 rounded-full ${statusDot[status] ?? "bg-gray-400"}`}
              />
              <span className="hidden capitalize sm:inline-block">
                {statusLabel[status] ?? status}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs capitalize">
            {status}
          </TooltipContent>
        </Tooltip>
        <div className="hidden sm:block">
          <ActiveUsers />
        </div>
      </div>
    </nav>
  );
};

export default memo(
  Navbar,
  (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement
);
