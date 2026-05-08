"use client";

import Image from "next/image";
import { Hand } from "lucide-react";
import { memo, useEffect } from "react";
import { toast } from "sonner";

import { defaultNavElement, navElements } from "@/constants";
import { ActiveElement, NavbarProps } from "@/types/type";
import { useRoom, useStatus } from "@/liveblocks.config";

import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
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

const PAN_TOOL: ActiveElement = {
  name: "Pan (H)",
  value: "pan",
  icon: "",
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
    if (status === "disconnected")
      toast.error("Connection lost. Trying to reconnect…");
    if (status === "connected") toast.dismiss();
  }, [status]);

  const isActive = (value: string | Array<ActiveElement>) =>
    (activeElement && activeElement.value === value) ||
    (Array.isArray(value) &&
      value.some((val) => val?.value === activeElement?.value));

  return (
    <nav className="flex select-none items-center justify-between gap-4 border-b border-primary-grey-200 bg-primary-black px-4 py-2 text-white">
      <div className="flex min-w-0 items-center gap-3">
        <Image
          src="/assets/logo-ui-studio.png"
          alt="UI STUDIO"
          width={150}
          height={14}
          priority
        />
        <Separator
          orientation="vertical"
          className="hidden h-5 md:inline-block"
        />
        <span
          className="hidden truncate font-mono text-[11px] text-primary-grey-300 md:inline-block"
          title={room.id}
        >
          {roomName}
        </span>
      </div>

      <ul className="flex flex-row items-center justify-center gap-0.5 rounded-md border border-primary-grey-200 bg-primary-black/60 p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <li
              onClick={() => handleActiveElement(PAN_TOOL)}
              className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded transition-colors ${
                isActive("pan")
                  ? "bg-primary-green text-primary-black"
                  : "text-primary-grey-300 hover:bg-primary-grey-200 hover:text-white"
              }`}
            >
              <Hand className="h-4 w-4" />
            </li>
          </TooltipTrigger>
          <TooltipContent side="bottom">Pan · H</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {navElements.map((item: ActiveElement | any) => {
          const active = isActive(item.value);
          return (
            <Tooltip key={item.name}>
              <li
                onClick={() => {
                  if (Array.isArray(item.value)) return;
                  if (item.value === defaultNavElement.value) {
                    handleActiveElement(item);
                    return;
                  }
                  handleActiveElement(item);
                }}
                className={`group flex h-7 items-center justify-center rounded px-2 transition-colors ${
                  active
                    ? "bg-primary-green"
                    : "hover:bg-primary-grey-200"
                }`}
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
                          className="relative h-4 w-4 object-contain"
                        >
                          <Image
                            src={item.icon}
                            alt={item.name}
                            fill
                            className={active ? "invert" : ""}
                          />
                        </Button>
                      </NewThread>
                    ) : (
                      <Button
                        aria-label={item.name}
                        className="relative h-4 w-4 object-contain"
                      >
                        <Image
                          src={item.icon}
                          alt={item.name}
                          fill
                          className={active ? "invert" : ""}
                        />
                      </Button>
                    )}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">{item.name}</TooltipContent>
              </li>
            </Tooltip>
          );
        })}
      </ul>

      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 rounded-md border border-primary-grey-200 px-2 py-1 text-[11px] font-medium text-primary-grey-300">
              <span
                className={`h-2 w-2 rounded-full ${statusDot[status] ?? "bg-gray-400"}`}
              />
              <span className="hidden capitalize sm:inline-block">
                {statusLabel[status] ?? status}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="capitalize">
            {status}
          </TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="hidden h-5 sm:block" />
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
