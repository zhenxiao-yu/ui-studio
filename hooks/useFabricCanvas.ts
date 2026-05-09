"use client";

import { fabric } from "fabric";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import {
  handleCanvasMouseDown,
  handleCanvasMouseMove,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvasObjectMoving,
  handleCanvasObjectScaling,
  handleCanvasSelectionCreated,
  handleCanvasZoom,
  handlePathCreated,
  handleResize,
  initializeFabric,
  renderCanvas,
} from "@/lib/canvas";
import { handleDelete, handleKeyDown } from "@/lib/key-events";
import { handleImageUpload } from "@/lib/shapes";
import { defaultNavElement, navElements, shapeElements } from "@/constants";
import {
  ActiveElement,
  Attributes,
  CustomFabricObject,
} from "@/types/type";

type UseFabricCanvasParams = {
  syncShapeInStorage: (obj: CustomFabricObject<fabric.Object>) => void;
  deleteShapeFromStorage: (shapeId: string) => void;
  deleteAllShapes: () => boolean | undefined;
  undo: () => void;
  redo: () => void;
  canvasObjects: ReadonlyMap<string, any> | null;
};

const CANVAS_SYNC_THROTTLE_MS = 50;

const DEFAULT_ATTRIBUTES: Attributes = {
  width: "",
  height: "",
  left: "",
  top: "",
  angle: "",
  opacity: "100",
  strokeWidth: "",
  cornerRadius: "",
  fontSize: "",
  fontFamily: "",
  fontWeight: "",
  fill: "#aabbcc",
  stroke: "#aabbcc",
};

// Single-key tool shortcuts (typed without modifier; ignored while editing text)
const TOOL_KEY_MAP: Record<string, string> = {
  v: "select",
  h: "pan",
  r: "rectangle",
  o: "circle",
  l: "line",
  t: "text",
  p: "freeform",
};

const findNavElement = (toolValue: string): ActiveElement => {
  const flat = [...navElements, ...shapeElements];
  for (const item of flat) {
    if (Array.isArray(item.value)) continue;
    if (item.value === toolValue) {
      return {
        name: item.name,
        value: toolValue,
        icon: item.icon ?? "",
      };
    }
  }
  return null;
};

export const useFabricCanvas = ({
  syncShapeInStorage,
  deleteShapeFromStorage,
  deleteAllShapes,
  undo,
  redo,
  canvasObjects,
}: UseFabricCanvasParams) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>(defaultNavElement.value);
  const activeObjectRef = useRef<fabric.Object | null>(null);
  const isEditingRef = useRef(false);
  const isSpacePressed = useRef(false);
  const isPanning = useRef(false);
  const lastPan = useRef<{ x: number; y: number } | null>(null);

  const [activeElement, setActiveElement] =
    useState<ActiveElement>(defaultNavElement);
  const [elementAttributes, setElementAttributes] =
    useState<Attributes>(DEFAULT_ATTRIBUTES);
  const [activeObjectId, setActiveObjectId] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState(5);

  const syncCanvasInteractionMode = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const tool = selectedShapeRef.current;
    const isPanTool = tool === "pan";
    const isFreeformTool = tool === "freeform";

    canvas.isDrawingMode = isFreeformTool;
    canvas.defaultCursor =
      isSpacePressed.current || isPanTool ? "grab" : "default";
    canvas.selection =
      !isSpacePressed.current && !isPanTool && !isFreeformTool;
  }, []);

  const handleActiveElement = useCallback(
    (elem: ActiveElement) => {
      if (!elem || Array.isArray(elem.value)) return;

      setActiveElement(elem);

      switch (elem?.value) {
        case "reset": {
          const confirmed = window.confirm(
            "Clear the entire canvas? This cannot be undone."
          );
          if (!confirmed) {
            setActiveElement(defaultNavElement);
            break;
          }
          deleteAllShapes();
          fabricRef.current?.clear();
          selectedShapeRef.current = defaultNavElement.value;
          setActiveElement(defaultNavElement);
          syncCanvasInteractionMode();
          toast.info("Canvas cleared");
          break;
        }

        case "delete":
          handleDelete(
            fabricRef.current as fabric.Canvas,
            deleteShapeFromStorage
          );
          selectedShapeRef.current = defaultNavElement.value;
          setActiveElement(defaultNavElement);
          syncCanvasInteractionMode();
          break;

        case "image":
          imageInputRef.current?.click();
          selectedShapeRef.current = defaultNavElement.value;
          isDrawing.current = false;
          syncCanvasInteractionMode();
          break;

        case "comments":
          selectedShapeRef.current = defaultNavElement.value;
          syncCanvasInteractionMode();
          break;

        default:
          selectedShapeRef.current = elem?.value as string;
          syncCanvasInteractionMode();
          break;
      }
    },
    [deleteAllShapes, deleteShapeFromStorage, syncCanvasInteractionMode]
  );

  const handleImageUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageUpload({
      file,
      canvas: fabricRef as React.MutableRefObject<fabric.Canvas>,
      shapeRef,
      syncShapeInStorage,
    });
    toast.success("Image added to canvas");
    e.target.value = "";
  };

  const duplicateActive = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;

    active.clone((clone: fabric.Object) => {
      clone.set({
        left: (active.left ?? 0) + 20,
        top: (active.top ?? 0) + 20,
      });
      (clone as CustomFabricObject<fabric.Object>).objectId = uuidv4();
      canvas.add(clone);
      canvas.setActiveObject(clone);
      canvas.requestRenderAll();
      syncShapeInStorage(clone as CustomFabricObject<fabric.Object>);
    });
  }, [syncShapeInStorage]);

  // Multi-select alignment: align each child of the active selection to its bbox.
  const alignSelected = useCallback(
    (axis: "left" | "horizontalCenter" | "right" | "top" | "verticalCenter" | "bottom") => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const active = canvas.getActiveObject() as fabric.ActiveSelection | null;
      if (!active || active.type !== "activeSelection") {
        toast.info("Select two or more objects to align");
        return;
      }

      const objects = active.getObjects();
      if (objects.length < 2) return;

      const bounds = active.getBoundingRect(true, true);
      // Active selection's children use coords relative to the group center.
      const halfW = (active.width ?? 0) / 2;
      const halfH = (active.height ?? 0) / 2;

      objects.forEach((obj) => {
        const w = obj.getScaledWidth();
        const h = obj.getScaledHeight();
        switch (axis) {
          case "left":
            obj.set({ left: -halfW });
            break;
          case "horizontalCenter":
            obj.set({ left: -w / 2 });
            break;
          case "right":
            obj.set({ left: halfW - w });
            break;
          case "top":
            obj.set({ top: -halfH });
            break;
          case "verticalCenter":
            obj.set({ top: -h / 2 });
            break;
          case "bottom":
            obj.set({ top: halfH - h });
            break;
        }
        obj.setCoords();
      });

      active.setCoords();
      canvas.requestRenderAll();

      // Sync each child individually since active selection isn't synced.
      objects.forEach((obj) => {
        syncShapeInStorage(obj as CustomFabricObject<fabric.Object>);
      });

      // Silence unused-bounds warning while keeping the read for future distribute.
      void bounds;
    },
    [syncShapeInStorage]
  );

  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });

    canvas.on("mouse:down", (options) => {
      // Space + drag OR Pan tool active = pan (skip shape creation/selection)
      if (isSpacePressed.current || selectedShapeRef.current === "pan") {
        isPanning.current = true;
        const e = options.e as MouseEvent;
        lastPan.current = { x: e.clientX, y: e.clientY };
        canvas.selection = false;
        canvas.defaultCursor = "grabbing";
        return;
      }

      handleCanvasMouseDown({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
      });
    });

    const mouseMoveThrottle = { last: 0 };
    canvas.on("mouse:move", (options) => {
      if (isPanning.current && lastPan.current) {
        const e = options.e as MouseEvent;
        const dx = e.clientX - lastPan.current.x;
        const dy = e.clientY - lastPan.current.y;
        canvas.relativePan({ x: dx, y: dy });
        lastPan.current = { x: e.clientX, y: e.clientY };
        return;
      }

      const now = Date.now();
      const throttledSync =
        now - mouseMoveThrottle.last >= CANVAS_SYNC_THROTTLE_MS
          ? (obj: fabric.Object) => {
              mouseMoveThrottle.last = now;
              syncShapeInStorage(obj as CustomFabricObject<fabric.Object>);
            }
          : () => {};

      handleCanvasMouseMove({
        options,
        canvas,
        isDrawing,
        selectedShapeRef,
        shapeRef,
        syncShapeInStorage: throttledSync,
      });
    });

    canvas.on("mouse:up", () => {
      if (isPanning.current) {
        isPanning.current = false;
        lastPan.current = null;
        syncCanvasInteractionMode();
        return;
      }

      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        activeObjectRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
      });
    });

    canvas.on("path:created", (options) =>
      handlePathCreated({ options, syncShapeInStorage })
    );

    canvas.on("object:modified", (options) =>
      handleCanvasObjectModified({ options, syncShapeInStorage })
    );

    canvas.on("object:moving", (options) =>
      handleCanvasObjectMoving({ options })
    );

    const trackActiveSelection = (options: any) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      });
      const selected = options?.selected?.[0] as
        | (fabric.Object & { objectId?: string })
        | undefined;
      if (selected) {
        activeObjectRef.current = selected;
        setActiveObjectId(selected.objectId ?? null);
      }
    };

    canvas.on("selection:created", trackActiveSelection);
    canvas.on("selection:updated", trackActiveSelection);

    canvas.on("selection:cleared", () => {
      if (isEditingRef.current) return;
      activeObjectRef.current = null;
      setActiveObjectId(null);
      setElementAttributes(DEFAULT_ATTRIBUTES);
    });

    canvas.on("object:scaling", (options) =>
      handleCanvasObjectScaling({ options, setElementAttributes })
    );

    canvas.on("mouse:wheel", (options) =>
      handleCanvasZoom({ options, canvas })
    );

    const onResize = () => handleResize({ canvas: fabricRef.current });

    const onKeyDown = (e: KeyboardEvent) => {
      // Space → enter pan mode (don't trigger while typing)
      const tag = (e.target as HTMLElement | null)?.tagName;
      const editingTextInput =
        tag === "INPUT" || tag === "TEXTAREA" ||
        (e.target as HTMLElement | null)?.isContentEditable;

      if (e.code === "Space" && !editingTextInput && !e.repeat) {
        e.preventDefault();
        isSpacePressed.current = true;
        const c = fabricRef.current;
        if (c) {
          syncCanvasInteractionMode();
        }
        return;
      }

      // Tool shortcuts (single key, no modifier, not while typing)
      if (
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !editingTextInput &&
        TOOL_KEY_MAP[e.key.toLowerCase()]
      ) {
        const tool = TOOL_KEY_MAP[e.key.toLowerCase()];
        const navItem = findNavElement(tool);
        if (navItem) {
          e.preventDefault();
          handleActiveElement(navItem);
        }
        return;
      }

      // Cmd/Ctrl + D → duplicate
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        duplicateActive();
        return;
      }

      handleKeyDown({
        e,
        canvas: fabricRef.current,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage,
      });
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpacePressed.current = false;
        syncCanvasInteractionMode();
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Track container size changes (resizable panels, mobile rotation, etc.)
    // — window.resize alone misses panel-drag and post-refresh layout restore.
    const container = document.getElementById("canvas");
    const resizeObserver =
      container && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => onResize())
        : null;
    if (container && resizeObserver) resizeObserver.observe(container);

    return () => {
      canvas.dispose();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      resizeObserver?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canvasRef,
    deleteShapeFromStorage,
    duplicateActive,
    handleActiveElement,
    redo,
    syncCanvasInteractionMode,
    syncShapeInStorage,
    undo,
  ]);

  // Apply the current brush size whenever it changes or freeform tool activates.
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas?.freeDrawingBrush) return;
    canvas.freeDrawingBrush.width = brushSize;
  }, [brushSize, activeElement]);

  useEffect(() => {
    renderCanvas({ fabricRef, canvasObjects, activeObjectRef });
  }, [canvasObjects]);

  return {
    canvasRef,
    fabricRef,
    imageInputRef,
    activeElement,
    setActiveElement,
    handleActiveElement,
    elementAttributes,
    setElementAttributes,
    isEditingRef,
    activeObjectRef,
    activeObjectId,
    handleImageUploadChange,
    brushSize,
    setBrushSize,
    duplicateActive,
    alignSelected,
  };
};
