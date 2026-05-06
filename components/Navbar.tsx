"use client";

import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { toast } from "sonner";

import { navElements } from "@/constants";
import { ActiveElement, NavbarProps } from "@/types/type";
import { useStatus } from "@/liveblocks.config";

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

const Navbar = ({
  activeElement,
  imageInputRef,
  handleImageUpload,
  handleActiveElement,
}: NavbarProps) => {
  const status = useStatus();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (status === "disconnected") toast.error("Connection lost. Trying to reconnect…");
    if (status === "connected") toast.dismiss();
  }, [status]);

  useEffect(() => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
    setIsMobile(mobile);
  }, []);

  const isActive = (value: string | Array<ActiveElement>) =>
    (activeElement && activeElement.value === value) ||
    (Array.isArray(value) &&
      value.some((val) => val?.value === activeElement?.value));

  if (isMobile) {
    return (
      <div className='flex h-screen w-full flex-col items-center justify-center gap-6 bg-primary-black px-8 text-white'>
        <Image src='/assets/logo-ui-studio.png' alt='UI STUDIO' width={200} height={20} />
        <div className='flex flex-col items-center gap-3 text-center'>
          <p className='text-lg font-semibold'>Best on Desktop</p>
          <p className='max-w-xs text-sm text-primary-grey-300'>
            UI Studio is a canvas-based design tool. For the best experience,
            open it on a computer with a mouse and keyboard.
          </p>
        </div>
        <p className='text-xs text-primary-grey-300 opacity-60'>
          Share the board URL on your desktop to continue.
        </p>
      </div>
    );
  }

  return (
    <nav className='flex select-none items-center justify-between gap-4 bg-primary-black px-5 py-2 text-white'>
      <div className='flex items-center'>
        <Image
          src='/assets/logo-ui-studio.png'
          alt='UI STUDIO'
          width={205}
          height={20}
        />
      </div>

      <ul className='flex flex-row flex-wrap items-center justify-center gap-2'>
        {navElements.map((item: ActiveElement | any) => (
          <Tooltip key={item.name}>
            <li
              onClick={() => {
                if (Array.isArray(item.value)) return;
                handleActiveElement(item);
              }}
              className={`group flex items-center justify-center px-2.5 py-2
              ${isActive(item.value) ? "bg-primary-green" : "hover:bg-primary-grey-200"}
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
                      <Button className='relative h-5 w-5 object-contain'>
                        <Image
                          src={item.icon}
                          alt={item.name}
                          fill
                          className={isActive(item.value) ? "invert" : ""}
                        />
                      </Button>
                    </NewThread>
                  ) : (
                    <Button className='relative h-5 w-5 object-contain'>
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

      <div className='flex items-center gap-3'>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={`h-2.5 w-2.5 cursor-default rounded-full ${statusDot[status] ?? "bg-gray-400"}`}
            />
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs capitalize">
            {status}
          </TooltipContent>
        </Tooltip>
        <div className='hidden sm:block'>
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
