"use client";

import { fabric } from "fabric";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

import { useOthers, useStorage } from "@/liveblocks.config";

type StoredCanvasObject = Record<string, unknown> & { objectId?: string };

const FIT_PADDING = 40;
const PINCH_MIN_ZOOM = 0.1;
const PINCH_MAX_ZOOM = 8;

const fitToScreen = (canvas: fabric.Canvas) => {
  const objects = canvas.getObjects();
  if (objects.length === 0) {
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.requestRenderAll();
    return;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  objects.forEach((obj) => {
    const rect = obj.getBoundingRect(true, true);
    minX = Math.min(minX, rect.left);
    minY = Math.min(minY, rect.top);
    maxX = Math.max(maxX, rect.left + rect.width);
    maxY = Math.max(maxY, rect.top + rect.height);
  });

  const contentW = maxX - minX;
  const contentH = maxY - minY;
  if (contentW <= 0 || contentH <= 0) return;

  const cw = canvas.getWidth();
  const ch = canvas.getHeight();
  const scale = Math.min(
    (cw - FIT_PADDING * 2) / contentW,
    (ch - FIT_PADDING * 2) / contentH,
    4
  );
  const tx = (cw - contentW * scale) / 2 - minX * scale;
  const ty = (ch - contentH * scale) / 2 - minY * scale;

  canvas.setViewportTransform([scale, 0, 0, scale, tx, ty]);
  canvas.requestRenderAll();
};

const MobileViewer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const canvasObjects = useStorage((root) => root.canvasObjects);
  const others = useOthers();

  const handleFit = useCallback(() => {
    if (fabricRef.current) fitToScreen(fabricRef.current);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: container.clientWidth,
      height: container.clientHeight,
      selection: false,
      hoverCursor: "default",
      defaultCursor: "default",
      interactive: false,
      renderOnAddRemove: false,
    });
    fabricRef.current = canvas;

    const onResize = () => {
      canvas.setDimensions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
      fitToScreen(canvas);
    };
    window.addEventListener("resize", onResize);

    let lastTouchDist = 0;
    let panLastX = 0;
    let panLastY = 0;
    let isPanning = false;

    const touchDist = (t: TouchList) => {
      const dx = t[0].clientX - t[1].clientX;
      const dy = t[0].clientY - t[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        lastTouchDist = touchDist(e.touches);
        isPanning = false;
      } else if (e.touches.length === 1) {
        isPanning = true;
        panLastX = e.touches[0].clientX;
        panLastY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && lastTouchDist > 0) {
        e.preventDefault();
        const newDist = touchDist(e.touches);
        const ratio = newDist / lastTouchDist;
        const next = Math.min(
          Math.max(canvas.getZoom() * ratio, PINCH_MIN_ZOOM),
          PINCH_MAX_ZOOM
        );
        const rect = container.getBoundingClientRect();
        const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
        const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
        canvas.zoomToPoint({ x: cx, y: cy }, next);
        lastTouchDist = newDist;
      } else if (e.touches.length === 1 && isPanning) {
        e.preventDefault();
        const dx = e.touches[0].clientX - panLastX;
        const dy = e.touches[0].clientY - panLastY;
        canvas.relativePan({ x: dx, y: dy });
        panLastX = e.touches[0].clientX;
        panLastY = e.touches[0].clientY;
      }
    };

    const onTouchEnd = () => {
      lastTouchDist = 0;
      isPanning = false;
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("resize", onResize);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !canvasObjects) return;

    const stored = canvasObjects as ReadonlyMap<string, StoredCanvasObject>;
    const data = Array.from(stored.values()).filter(Boolean);

    canvas.remove(...canvas.getObjects());

    if (data.length === 0) {
      canvas.requestRenderAll();
      return;
    }

    fabric.util.enlivenObjects(
      data as object[],
      (enlivened: fabric.Object[]) => {
        enlivened.forEach((obj) => {
          obj.selectable = false;
          obj.evented = false;
          obj.hoverCursor = "default";
          canvas.add(obj);
        });
        fitToScreen(canvas);
      },
      "fabric"
    );
  }, [canvasObjects]);

  const copyShareUrl = useCallback(() => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success("Board URL copied"))
      .catch(() => toast.error("Couldn't copy. Long-press the address bar instead."));
  }, []);

  const viewerCount = others.length + 1;

  return (
    <main className="flex h-screen w-full flex-col bg-primary-black text-white">
      <header className="flex items-center justify-between border-b border-primary-grey-200 px-4 py-3">
        <Image
          src="/assets/logo-ui-studio.png"
          alt="UI STUDIO"
          width={120}
          height={12}
          priority
        />
        <div className="flex items-center gap-2 text-[11px] text-primary-grey-300">
          <span>
            {viewerCount} {viewerCount === 1 ? "viewer" : "viewers"}
          </span>
          <button
            onClick={copyShareUrl}
            className="rounded border border-primary-grey-200 px-2 py-1 text-white hover:bg-primary-grey-200"
          >
            Copy link
          </button>
        </div>
      </header>

      <div
        ref={containerRef}
        className="relative flex-1 touch-none overflow-hidden bg-[#0f0f0f]"
      >
        <canvas ref={canvasRef} />
        <button
          onClick={handleFit}
          className="absolute bottom-3 right-3 rounded-full bg-primary-grey-200 px-3 py-1.5 text-xs text-white shadow-lg hover:bg-primary-grey-300"
        >
          Fit to screen
        </button>
      </div>

      <footer className="space-y-1 border-t border-primary-grey-200 px-4 py-3 text-center text-[11px] text-primary-grey-300">
        <p className="font-medium text-white">Read-only on mobile</p>
        <p>Open this URL on a desktop browser to edit, comment, and collaborate.</p>
      </footer>
    </main>
  );
};

export default MobileViewer;
