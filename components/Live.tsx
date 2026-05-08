"use client";

import { useCallback, useEffect, useState } from "react";
import { fabric } from "fabric";
import { Maximize2, Minus, Plus, X } from "lucide-react";

import {
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
  useOthers,
  useStatus,
  useStorage,
} from "@/liveblocks.config";
import useInterval from "@/hooks/useInterval";
import { fitCanvasToScreen, resetZoom, zoomIn, zoomOut } from "@/lib/canvas";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type";
import { shortcuts } from "@/constants";

import { Comments } from "./comments/Comments";
import {
  CursorChat,
  FlyingReaction,
  LiveCursors,
  ReactionSelector,
} from "./index";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  fabricRef?: React.MutableRefObject<fabric.Canvas | null>;
  undo: () => void;
  redo: () => void;
};

const Live = ({ canvasRef, fabricRef, undo, redo }: Props) => {
  /**
   * useOthers returns the list of other users in the room.
   *
   * useOthers: https://liveblocks.io/docs/api-reference/liveblocks-react#useOthers
   */
  const others = useOthers();

  /**
   * useMyPresence returns the presence of the current user in the room.
   * It also returns a function to update the presence of the current user.
   *
   * useMyPresence: https://liveblocks.io/docs/api-reference/liveblocks-react#useMyPresence
   */
  const [{ cursor }, updateMyPresence] = useMyPresence();

  /**
   * useBroadcastEvent is used to broadcast an event to all the other users in the room.
   *
   * useBroadcastEvent: https://liveblocks.io/docs/api-reference/liveblocks-react#useBroadcastEvent
   */
  const broadcast = useBroadcastEvent();

  const [zoom, setZoom] = useState(100);
  const status = useStatus();
  const objectCount = useStorage((root) => root.canvasObjects?.size ?? 0);

  // store the reactions created on mouse click
  const [reactions, setReactions] = useState<Reaction[]>([]);

  // track the state of the cursor (hidden, chat, reaction, reaction selector)
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });

  // set the reaction of the cursor
  const setReaction = useCallback((reaction: string) => {
    setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false });
  }, []);

  // Remove reactions that are not visible anymore (every 1 sec)
  useInterval(() => {
    setReactions((reactions) =>
      reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000)
    );
  }, 1000);

  // Broadcast the reaction to other users (every 100ms)
  useInterval(() => {
    if (
      cursorState.mode === CursorMode.Reaction &&
      cursorState.isPressed &&
      cursor
    ) {
      // concat all the reactions created on mouse click
      setReactions((reactions) =>
        reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: cursorState.reaction,
            timestamp: Date.now(),
          },
        ])
      );

      // Broadcast the reaction to other users
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      });
    }
  }, 100);

  /**
   * useEventListener is used to listen to events broadcasted by other
   * users.
   *
   * useEventListener: https://liveblocks.io/docs/api-reference/liveblocks-react#useEventListener
   */
  useEventListener((eventData) => {
    const event = eventData.event as ReactionEvent;
    setReactions((reactions) =>
      reactions.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now(),
        },
      ])
    );
  });

  // Sync zoom level from the fabric canvas via custom events
  useEffect(() => {
    const onZoom = (e: Event) => {
      const detail = (e as CustomEvent<{ zoom: number }>).detail;
      setZoom(Math.round(detail.zoom * 100));
    };
    window.addEventListener("canvas:zoom", onZoom);
    return () => window.removeEventListener("canvas:zoom", onZoom);
  }, []);

  // Listen to keyboard events to change the cursor state
  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setCursorState({ mode: CursorMode.Hidden });
      } else if (e.key === "e") {
        setCursorState({ mode: CursorMode.ReactionSelector });
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
      }
    };

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);

  // Listen to mouse events to change the cursor state
  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault();

      if (cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        updateMyPresence({
          cursor: {
            x,
            y,
          },
        });
      }
    },
    [cursor, cursorState.mode, updateMyPresence]
  );

  // Hide the cursor when the mouse leaves the canvas
  const handlePointerLeave = useCallback(() => {
    setCursorState({
      mode: CursorMode.Hidden,
    });
    updateMyPresence({
      cursor: null,
      message: undefined,
    });
  }, [updateMyPresence]);

  // Show the cursor when the mouse enters the canvas
  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      // get the cursor position in the canvas
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

      updateMyPresence({
        cursor: {
          x,
          y,
        },
      });

      // if cursor is in reaction mode, set isPressed to true
      setCursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction
          ? { ...state, isPressed: true }
          : state
      );
    },
    [cursorState.mode, updateMyPresence]
  );

  // hide the cursor when the mouse is up
  const handlePointerUp = useCallback(() => {
    setCursorState((state: CursorState) =>
      cursorState.mode === CursorMode.Reaction
        ? { ...state, isPressed: false }
        : state
    );
  }, [cursorState.mode, setCursorState]);

  // trigger respective actions when the user clicks on the right menu
  const handleContextMenuClick = useCallback(
    (key: string) => {
      switch (key) {
        case "Chat":
          setCursorState({
            mode: CursorMode.Chat,
            previousMessage: null,
            message: "",
          });
          break;

        case "Reactions":
          setCursorState({ mode: CursorMode.ReactionSelector });
          break;

        case "Undo":
          undo();
          break;

        case "Redo":
          redo();
          break;

        default:
          break;
      }
    },
    [redo, undo]
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger
        className='relative flex h-full w-full flex-1 items-center justify-center'
        id='canvas'
        style={{
          cursor: cursorState.mode === CursorMode.Chat ? "none" : "auto",
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <canvas ref={canvasRef} />

        {/* Render the reactions */}
        {reactions.map((reaction) => (
          <FlyingReaction
            key={reaction.timestamp.toString()}
            x={reaction.point.x}
            y={reaction.point.y}
            timestamp={reaction.timestamp}
            value={reaction.value}
          />
        ))}

        {/* If cursor is in chat mode, show the chat cursor */}
        {cursor && (
          <CursorChat
            cursor={cursor}
            cursorState={cursorState}
            setCursorState={setCursorState}
            updateMyPresence={updateMyPresence}
          />
        )}

        {/* If cursor is in reaction selector mode, show the reaction selector */}
        {cursorState.mode === CursorMode.ReactionSelector && (
          <ReactionSelector
            setReaction={(reaction) => {
              setReaction(reaction);
            }}
          />
        )}

        {/* Show the live cursors of other users */}
        <LiveCursors others={others} />

        {/* Show the comments */}
        <Comments />

        {/* Status bar */}
        <StatusBar
          objectCount={objectCount}
          status={status}
        />

        {/* Zoom controls */}
        <ZoomControls fabricRef={fabricRef} zoom={zoom} />

        {/* Shortcut hint button */}
        <ShortcutHint />
      </ContextMenuTrigger>

      <ContextMenuContent className='right-menu-content'>
        {shortcuts.map((item) => (
          <ContextMenuItem
            key={item.key}
            className='right-menu-item'
            onClick={() => handleContextMenuClick(item.name)}
          >
            <p>{item.name}</p>
            <p className='text-xs text-primary-grey-300'>{item.shortcut}</p>
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
};

const statusDot: Record<string, string> = {
  connected: "bg-green-400",
  connecting: "bg-yellow-400",
  reconnecting: "bg-yellow-400",
  disconnected: "bg-red-500",
};

const StatusBar = ({
  objectCount,
  status,
}: {
  objectCount: number;
  status: string;
}) => (
  <div className="pointer-events-none absolute bottom-3 left-3 flex select-none items-center gap-3 rounded border border-primary-grey-200 bg-primary-black/80 px-3 py-1.5 text-[11px] text-primary-grey-300 backdrop-blur">
    <span>
      {objectCount} {objectCount === 1 ? "object" : "objects"}
    </span>
    <span className="h-3 w-px bg-primary-grey-200" />
    <span className="flex items-center gap-1.5 capitalize">
      <span
        className={`h-1.5 w-1.5 rounded-full ${statusDot[status] ?? "bg-gray-400"}`}
      />
      {status}
    </span>
  </div>
);

const ZoomControls = ({
  fabricRef,
  zoom,
}: {
  fabricRef?: React.MutableRefObject<fabric.Canvas | null>;
  zoom: number;
}) => {
  const run = (fn: (c: fabric.Canvas) => void) => () => {
    const canvas = fabricRef?.current;
    if (canvas) fn(canvas);
  };

  return (
    <div className="absolute bottom-3 right-12 flex select-none items-center gap-0.5 rounded border border-primary-grey-200 bg-primary-black/80 p-0.5 text-primary-grey-300 backdrop-blur">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={run(zoomOut)}
            className="flex h-6 w-6 items-center justify-center rounded text-white hover:bg-primary-grey-200"
          >
            <Minus className="h-3 w-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          Zoom out · ⌘ −
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="Reset zoom to 100%"
            onClick={run(resetZoom)}
            className="min-w-[3.5rem] rounded px-1 py-0.5 text-center text-[11px] tabular-nums hover:bg-primary-grey-200"
          >
            {zoom}%
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          Reset zoom · ⌘ 0
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={run(zoomIn)}
            className="flex h-6 w-6 items-center justify-center rounded text-white hover:bg-primary-grey-200"
          >
            <Plus className="h-3 w-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          Zoom in · ⌘ +
        </TooltipContent>
      </Tooltip>

      <span className="mx-0.5 h-4 w-px bg-primary-grey-200" />

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="Fit to screen"
            onClick={run(fitCanvasToScreen)}
            className="flex h-6 w-6 items-center justify-center rounded text-white hover:bg-primary-grey-200"
          >
            <Maximize2 className="h-3 w-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          Fit to screen · ⌘ 1
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

const ShortcutHint = () => {
  const [open, setOpen] = useState(false);
  const all = [
    ...shortcuts,
    { key: "5", name: "Select", shortcut: "Click" },
    { key: "6", name: "Delete shape", shortcut: "Del / ⌫" },
    { key: "7", name: "Copy", shortcut: "⌘ + C" },
    { key: "8", name: "Paste", shortcut: "⌘ + V" },
    { key: "9", name: "Cut", shortcut: "⌘ + X" },
    { key: "10", name: "Zoom in", shortcut: "⌘ + +" },
    { key: "11", name: "Zoom out", shortcut: "⌘ + −" },
    { key: "12", name: "Reset zoom", shortcut: "⌘ + 0" },
    { key: "13", name: "Fit to screen", shortcut: "⌘ + 1" },
  ];
  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className='absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-grey-200 text-[11px] font-bold text-primary-grey-300 hover:bg-primary-grey-300 hover:text-white'
        title='Keyboard shortcuts'
      >
        ?
      </button>
      {open && (
        <div className='absolute bottom-12 right-3 z-50 w-56 rounded-lg border border-primary-grey-200 bg-primary-black p-4 shadow-xl'>
          <div className='mb-3 flex items-center justify-between'>
            <span className='text-[11px] font-semibold uppercase text-primary-grey-300'>
              Shortcuts
            </span>
            <button onClick={() => setOpen(false)}>
              <X className='h-3.5 w-3.5 text-primary-grey-300' />
            </button>
          </div>
          <div className='flex flex-col gap-2'>
            {all.map((s) => (
              <div
                key={s.key}
                className='flex items-center justify-between text-xs text-white'
              >
                <span>{s.name}</span>
                <kbd className='rounded bg-primary-grey-200 px-1.5 py-0.5 text-[10px] text-primary-grey-300'>
                  {s.shortcut}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Live;
