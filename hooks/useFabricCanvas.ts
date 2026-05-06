"use client";

import { fabric } from "fabric";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
import { defaultNavElement } from "@/constants";
import { ActiveElement, Attributes, CustomFabricObject } from "@/types/type";

type UseFabricCanvasParams = {
  syncShapeInStorage: (obj: CustomFabricObject<fabric.Object>) => void;
  deleteShapeFromStorage: (shapeId: string) => void;
  deleteAllShapes: () => boolean | undefined;
  undo: () => void;
  redo: () => void;
  canvasObjects: ReadonlyMap<string, any> | null;
};

const CANVAS_SYNC_THROTTLE_MS = 50;

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
  const selectedShapeRef = useRef<string | null>(null);
  const activeObjectRef = useRef<fabric.Object | null>(null);
  const isEditingRef = useRef(false);

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });

  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width: "",
    height: "",
    fontSize: "",
    fontFamily: "",
    fontWeight: "",
    fill: "#aabbcc",
    stroke: "#aabbcc",
  });

  const handleActiveElement = (elem: ActiveElement) => {
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
        setActiveElement(defaultNavElement);
        toast.info("Canvas cleared");
        break;
      }

      case "delete":
        handleDelete(
          fabricRef.current as fabric.Canvas,
          deleteShapeFromStorage
        );
        setActiveElement(defaultNavElement);
        break;

      case "image":
        imageInputRef.current?.click();
        isDrawing.current = false;
        if (fabricRef.current) {
          fabricRef.current.isDrawingMode = false;
        }
        break;

      case "comments":
        break;

      default:
        selectedShapeRef.current = elem?.value as string;
        break;
    }
  };

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

  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });

    canvas.on("mouse:down", (options) =>
      handleCanvasMouseDown({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
      })
    );

    // Keep in-progress shape creation responsive without flooding Liveblocks.
    const mouseMoveThrottle = { last: 0 };
    canvas.on("mouse:move", (options) => {
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

    canvas.on("mouse:up", () =>
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        activeObjectRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
      })
    );

    canvas.on("path:created", (options) =>
      handlePathCreated({ options, syncShapeInStorage })
    );

    canvas.on("object:modified", (options) =>
      handleCanvasObjectModified({ options, syncShapeInStorage })
    );

    canvas.on("object:moving", (options) =>
      handleCanvasObjectMoving({ options })
    );

    canvas.on("selection:created", (options) =>
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      })
    );

    canvas.on("object:scaling", (options) =>
      handleCanvasObjectScaling({ options, setElementAttributes })
    );

    canvas.on("mouse:wheel", (options) =>
      handleCanvasZoom({ options, canvas })
    );

    const onResize = () => handleResize({ canvas: fabricRef.current });
    const onKeyDown = (e: KeyboardEvent) =>
      handleKeyDown({
        e,
        canvas: fabricRef.current,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage,
      });

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      canvas.dispose();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef]);

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
    handleImageUploadChange,
  };
};
