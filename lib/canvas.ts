import { fabric } from "fabric";
import { v4 as uuid4 } from "uuid";
import {
  CanvasMouseDown,
  CanvasMouseMove,
  CanvasMouseUp,
  CanvasObjectModified,
  CanvasObjectScaling,
  CanvasPathCreated,
  CanvasSelectionCreated,
  RenderCanvas,
} from "@/types/type";
import { defaultNavElement } from "@/constants";
import { createSpecificShape } from "./shapes";

type StoredCanvasObject = Record<string, unknown> & { objectId?: string };
type FabricObjectWithId = fabric.Object & { objectId?: string };

const VISUAL_STATE_FIELDS = [
  "left",
  "top",
  "width",
  "height",
  "scaleX",
  "scaleY",
  "angle",
  "fill",
  "stroke",
  "strokeWidth",
  "opacity",
  "radius",
  "rx",
  "ry",
  "x1",
  "y1",
  "x2",
  "y2",
  "text",
  "fontSize",
  "fontFamily",
  "fontWeight",
  "src",
] as const;

// Initialize the fabric canvas
export const initializeFabric = ({
  fabricRef,
  canvasRef,
}: {
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}) => {
  const canvasElement = document.getElementById("canvas");

  // Fall back to window dimensions when the container element is not yet mounted
  const width = canvasElement?.clientWidth ?? window.innerWidth;
  const height = canvasElement?.clientHeight ?? window.innerHeight;

  const canvas = new fabric.Canvas(canvasRef.current, { width, height });

  fabricRef.current = canvas;

  return canvas;
};

// Handle canvas mouse down event to create or select objects
export const handleCanvasMouseDown = ({
  options,
  canvas,
  selectedShapeRef,
  isDrawing,
  shapeRef,
}: CanvasMouseDown) => {
  const pointer = canvas.getPointer(options.e);
  const target = canvas.findTarget(options.e, false);

  canvas.isDrawingMode = false;

  if (selectedShapeRef.current === "freeform") {
    isDrawing.current = true;
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.width = 5;
    return;
  }

  canvas.isDrawingMode = false;

  if (
    target &&
    (target.type === selectedShapeRef.current ||
      target.type === "activeSelection")
  ) {
    isDrawing.current = false;
    canvas.setActiveObject(target);
    target.setCoords();
  } else {
    isDrawing.current = true;
    shapeRef.current = createSpecificShape(
      selectedShapeRef.current,
      pointer as any
    );

    if (shapeRef.current) {
      canvas.add(shapeRef.current);
    }
  }
};

// Handle mouse move event on the canvas to draw shapes dynamically
export const handleCanvasMouseMove = ({
  options,
  canvas,
  isDrawing,
  selectedShapeRef,
  shapeRef,
  syncShapeInStorage,
}: CanvasMouseMove) => {
  if (!isDrawing.current) return;
  if (selectedShapeRef.current === "freeform") return;

  canvas.isDrawingMode = false;
  const pointer = canvas.getPointer(options.e);

  switch (selectedShapeRef?.current) {
    case "rectangle":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
      break;
    case "circle":
      shapeRef.current.set({
        radius: Math.abs(pointer.x - (shapeRef.current?.left || 0)) / 2,
      });
      break;
    case "triangle":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
      break;
    case "line":
      shapeRef.current?.set({
        x2: pointer.x,
        y2: pointer.y,
      });
      break;
    case "image":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
      break;
    default:
      break;
  }

  canvas.renderAll();

  if (shapeRef.current?.objectId) {
    syncShapeInStorage(shapeRef.current);
  }
};

// Handle mouse up event to finalize shape drawing
export const handleCanvasMouseUp = ({
  canvas,
  isDrawing,
  shapeRef,
  activeObjectRef,
  selectedShapeRef,
  syncShapeInStorage,
  setActiveElement,
}: CanvasMouseUp) => {
  isDrawing.current = false;
  if (selectedShapeRef.current === "freeform") return;

  if (shapeRef.current?.objectId) {
    syncShapeInStorage(shapeRef.current);
  }

  shapeRef.current = null;
  activeObjectRef.current = null;
  selectedShapeRef.current = null;

  if (!canvas.isDrawingMode) {
    setTimeout(() => {
      setActiveElement(defaultNavElement);
    }, 700);
  }
};

// Sync shape with storage when object is modified
export const handleCanvasObjectModified = ({
  options,
  syncShapeInStorage,
}: CanvasObjectModified) => {
  const target = options.target;
  if (!target) return;

  if (target?.type == "activeSelection") {
    // Handle active selection modification
  } else {
    syncShapeInStorage(target);
  }
};

// Sync path with storage when a new path is created in freeform mode
export const handlePathCreated = ({
  options,
  syncShapeInStorage,
}: CanvasPathCreated) => {
  const path = options.path;
  if (!path) return;

  path.set({
    objectId: uuid4(),
  });

  syncShapeInStorage(path);
};

// Restrict object movement to within canvas boundaries
export const handleCanvasObjectMoving = ({
  options,
}: {
  options: fabric.IEvent;
}) => {
  const target = options.target as fabric.Object;
  const canvas = target.canvas as fabric.Canvas;

  target.setCoords();

  if (target && target.left) {
    target.left = Math.max(
      0,
      Math.min(
        target.left,
        (canvas.width || 0) - (target.getScaledWidth() || target.width || 0)
      )
    );
  }

  if (target && target.top) {
    target.top = Math.max(
      0,
      Math.min(
        target.top,
        (canvas.height || 0) - (target.getScaledHeight() || target.height || 0)
      )
    );
  }
};

// Set element attributes when a new selection is created
export const handleCanvasSelectionCreated = ({
  options,
  isEditingRef,
  setElementAttributes,
}: CanvasSelectionCreated) => {
  if (isEditingRef.current) return;
  if (!options?.selected) return;

  const selectedElement = options?.selected[0] as fabric.Object;

  if (selectedElement && options.selected.length === 1) {
    const scaledWidth = selectedElement?.scaleX
      ? selectedElement?.width! * selectedElement?.scaleX
      : selectedElement?.width;

    const scaledHeight = selectedElement?.scaleY
      ? selectedElement?.height! * selectedElement?.scaleY
      : selectedElement?.height;

    setElementAttributes({
      width: scaledWidth?.toFixed(0).toString() || "",
      height: scaledHeight?.toFixed(0).toString() || "",
      fill: selectedElement?.fill?.toString() || "",
      stroke: selectedElement?.stroke || "",
      fontSize: (selectedElement as any)?.fontSize || "",
      fontFamily: (selectedElement as any)?.fontFamily || "",
      fontWeight: (selectedElement as any)?.fontWeight || "",
    });
  }
};

// Update element attributes when an object is scaled
export const handleCanvasObjectScaling = ({
  options,
  setElementAttributes,
}: CanvasObjectScaling) => {
  const selectedElement = options.target;

  const scaledWidth = selectedElement?.scaleX
    ? selectedElement?.width! * selectedElement?.scaleX
    : selectedElement?.width;

  const scaledHeight = selectedElement?.scaleY
    ? selectedElement?.height! * selectedElement?.scaleY
    : selectedElement?.height;

  setElementAttributes((prev) => ({
    ...prev,
    width: scaledWidth?.toFixed(0).toString() || "",
    height: scaledHeight?.toFixed(0).toString() || "",
  }));
};

// Returns true when the canvas object's visual state differs from storage data.
// Uses a tolerance of 0.01 for floats (avoids false positives from serialization rounding).
const shapeChanged = (
  existing: fabric.Object,
  storageData: StoredCanvasObject
) => {
  const e = existing.toObject() as Record<string, unknown>;

  for (const field of VISUAL_STATE_FIELDS) {
    const a = e[field];
    const b = storageData[field];

    if (typeof a === "number" && typeof b === "number") {
      if (Math.abs(a - b) > 0.01) return true;
    } else if (a !== b) {
      return true;
    }
  }
  // Freeform path data is an array, so compare it by value.
  if (JSON.stringify(e.path) !== JSON.stringify(storageData.path)) return true;
  return false;
};

const addEnlivenedObject = ({
  canvas,
  objectId,
  objectData,
  setActive,
  onAdded,
}: {
  canvas: fabric.Canvas;
  objectId: string;
  objectData: StoredCanvasObject;
  setActive: boolean;
  onAdded: () => void;
}) => {
  fabric.util.enlivenObjects(
    [objectData],
    (enlivenedObjects: fabric.Object[]) => {
      enlivenedObjects.forEach((enlivenedObj) => {
        (enlivenedObj as FabricObjectWithId).objectId = objectId;
        canvas.add(enlivenedObj);

        if (setActive) {
          canvas.setActiveObject(enlivenedObj);
        }
      });

      onAdded();
    },
    "fabric"
  );
};

const syncCanvasObjectOrder = (
  canvas: fabric.Canvas,
  canvasObjects: ReadonlyMap<string, StoredCanvasObject>
) => {
  Array.from(canvasObjects.keys()).forEach((objectId, index) => {
    const object = canvas
      .getObjects()
      .find((obj) => (obj as FabricObjectWithId).objectId === objectId);

    if (object) {
      canvas.moveTo(object, index);
    }
  });
};

// Render canvas objects from storage using object-level diffing:
//   New objects (in storage, not on canvas): enliven + add
//   Deleted objects (on canvas, not in storage): remove
//   Changed objects: replace unless actively selected
//   Unchanged objects: leave as-is to avoid flicker
export const renderCanvas = ({
  fabricRef,
  canvasObjects,
  activeObjectRef,
}: RenderCanvas) => {
  if (!canvasObjects || !fabricRef.current) return;
  const canvas = fabricRef.current;
  const storedObjects = canvasObjects as ReadonlyMap<
    string,
    StoredCanvasObject
  >;

  // Index all objects currently on the canvas by their objectId
  const existingById = new Map<string, fabric.Object>();
  canvas.getObjects().forEach((obj) => {
    const id = (obj as FabricObjectWithId).objectId;
    if (id) existingById.set(id, obj);
  });

  const storageIds = new Set(storedObjects.keys());
  const activeId = (activeObjectRef.current as FabricObjectWithId | null)
    ?.objectId;

  // Remove objects deleted from storage
  for (const [id, obj] of existingById) {
    if (!storageIds.has(id)) canvas.remove(obj);
  }

  // Add new objects; replace changed objects (skip actively selected)
  for (const [objectId, objectData] of storedObjects) {
    if (!objectData) continue;
    const existing = existingById.get(objectId);

    if (!existing) {
      addEnlivenedObject({
        canvas,
        objectId,
        objectData,
        setActive: activeId === objectId,
        onAdded: () => {
          syncCanvasObjectOrder(canvas, storedObjects);
          canvas.requestRenderAll();
        },
      });
    } else if (activeId !== objectId && shapeChanged(existing, objectData)) {
      // Changed and not actively manipulated: replace.
      canvas.remove(existing);
      addEnlivenedObject({
        canvas,
        objectId,
        objectData,
        setActive: false,
        onAdded: () => {
          syncCanvasObjectOrder(canvas, storedObjects);
          canvas.requestRenderAll();
        },
      });
    }
    // else: unchanged or actively selected, so leave as-is.
  }

  syncCanvasObjectOrder(canvas, storedObjects);
  canvas.requestRenderAll();
};

// Adjust canvas size when the window is resized
export const handleResize = ({ canvas }: { canvas: fabric.Canvas | null }) => {
  const canvasElement = document.getElementById("canvas");
  if (!canvasElement || !canvas) return;

  canvas.setDimensions({
    width: canvasElement.clientWidth,
    height: canvasElement.clientHeight,
  });
};

export const ZOOM_MIN = 0.2;
export const ZOOM_MAX = 4;
const ZOOM_STEP = 1.2;

const clampZoom = (zoom: number) =>
  Math.min(Math.max(zoom, ZOOM_MIN), ZOOM_MAX);

const broadcastZoom = (zoom: number) => {
  window.dispatchEvent(new CustomEvent("canvas:zoom", { detail: { zoom } }));
};

// Zoom canvas in or out with mouse scroll
export const handleCanvasZoom = ({
  options,
  canvas,
}: {
  options: fabric.IEvent & { e: WheelEvent };
  canvas: fabric.Canvas;
}) => {
  const delta = options.e?.deltaY;
  const zoom = clampZoom(canvas.getZoom() + delta * 0.001);

  canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, zoom);
  broadcastZoom(zoom);

  options.e.preventDefault();
  options.e.stopPropagation();
};

const zoomToCenter = (canvas: fabric.Canvas, zoom: number) => {
  const cx = canvas.getWidth() / 2;
  const cy = canvas.getHeight() / 2;
  canvas.zoomToPoint({ x: cx, y: cy }, zoom);
  broadcastZoom(zoom);
};

export const zoomIn = (canvas: fabric.Canvas) =>
  zoomToCenter(canvas, clampZoom(canvas.getZoom() * ZOOM_STEP));

export const zoomOut = (canvas: fabric.Canvas) =>
  zoomToCenter(canvas, clampZoom(canvas.getZoom() / ZOOM_STEP));

export const resetZoom = (canvas: fabric.Canvas) => {
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  broadcastZoom(1);
  canvas.requestRenderAll();
};

export const fitCanvasToScreen = (canvas: fabric.Canvas) => {
  const objects = canvas.getObjects();
  if (objects.length === 0) {
    resetZoom(canvas);
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

  const padding = 60;
  const cw = canvas.getWidth();
  const ch = canvas.getHeight();
  const scale = clampZoom(
    Math.min((cw - padding * 2) / contentW, (ch - padding * 2) / contentH)
  );
  const tx = (cw - contentW * scale) / 2 - minX * scale;
  const ty = (ch - contentH * scale) / 2 - minY * scale;

  canvas.setViewportTransform([scale, 0, 0, scale, tx, ty]);
  broadcastZoom(scale);
  canvas.requestRenderAll();
};
