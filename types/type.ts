// Import necessary types and modules from Liveblocks and fabric.js
import { BaseUserMeta, User } from "@liveblocks/client";
import { Gradient, Pattern } from "fabric/fabric-impl";

// Enum representing different cursor modes
export enum CursorMode {
  Hidden,
  Chat,
  ReactionSelector,
  Reaction,
}

// Union type representing different states of the cursor
export type CursorState =
  | { mode: CursorMode.Hidden }
  | {
      mode: CursorMode.Chat;
      message: string;
      previousMessage: string | null;
    }
  | { mode: CursorMode.ReactionSelector }
  | {
      mode: CursorMode.Reaction;
      reaction: string;
      isPressed: boolean;
    };

// Type representing a reaction with its value, timestamp, and coordinates
export type Reaction = {
  value: string;
  timestamp: number;
  point: { x: number; y: number };
};

// Type representing a reaction event with its coordinates and value
export type ReactionEvent = {
  x: number;
  y: number;
  value: string;
};

// Type representing shape data with various properties
export type ShapeData = {
  type: string;
  width: number;
  height: number;
  fill: string | Pattern | Gradient;
  left: number;
  top: number;
  objectId: string | undefined;
};

// Type representing attributes for various elements
export type Attributes = {
  width: string;
  height: string;
  left: string;
  top: string;
  angle: string;
  opacity: string;
  strokeWidth: string;
  cornerRadius: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fill: string;
  stroke: string;
};

// Type representing an active element, which can be null
export type ActiveElement = {
  name: string;
  value: string;
  icon: string;
} | null;

// Interface extending fabric.Object to include an optional objectId
export interface CustomFabricObject<T extends fabric.Object>
  extends fabric.Object {
  objectId?: string;
}

// Type representing modification of a shape on the canvas
export type ModifyShape = {
  canvas: fabric.Canvas;
  property: string;
  value: any;
  activeObjectRef: React.MutableRefObject<fabric.Object | null>;
  syncShapeInStorage: (shape: fabric.Object) => void;
};

// Type representing direction modification of an element on the canvas
export type ElementDirection = {
  canvas: fabric.Canvas;
  direction: string;
  syncShapeInStorage: (shape: fabric.Object) => void;
};

// Type representing image upload details
export type ImageUpload = {
  file: File;
  canvas: React.MutableRefObject<fabric.Canvas>;
  shapeRef: React.MutableRefObject<fabric.Object | null>;
  syncShapeInStorage: (shape: fabric.Object) => void;
};

// Props for the right sidebar component
export type AlignAxis =
  | "left"
  | "horizontalCenter"
  | "right"
  | "top"
  | "verticalCenter"
  | "bottom";

export type RightSidebarProps = {
  elementAttributes: Attributes;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
  fabricRef: React.RefObject<fabric.Canvas | null>;
  activeObjectRef: React.RefObject<fabric.Object | null>;
  activeObjectId: string | null;
  isEditingRef: React.MutableRefObject<boolean>;
  syncShapeInStorage: (obj: any) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  duplicateActive: () => void;
  alignSelected: (axis: AlignAxis) => void;
  activeTool: string | null;
};

// Props for the navbar component
export type NavbarProps = {
  activeElement: ActiveElement;
  imageInputRef: React.MutableRefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleActiveElement: (element: ActiveElement) => void;
};

// Props for the shapes menu component
export type ShapesMenuProps = {
  item: {
    name: string;
    icon: string;
    value: Array<ActiveElement>;
  };
  activeElement: any;
  handleActiveElement: any;
  handleImageUpload: any;
  imageInputRef: any;
};

export type Presence = {
  cursor: { x: number; y: number } | null;
  cursorColor: string | null;
  editingText: string | null;
  message?: string;
};

// Props for the live cursor component
export type LiveCursorProps = {
  others: readonly User<Presence, BaseUserMeta>[];
};

// Type for handling mouse down events on the canvas
export type CanvasMouseDown = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  selectedShapeRef: any;
  isDrawing: React.MutableRefObject<boolean>;
  shapeRef: React.MutableRefObject<fabric.Object | null>;
};

// Type for handling mouse move events on the canvas
export type CanvasMouseMove = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  isDrawing: React.MutableRefObject<boolean>;
  selectedShapeRef: any;
  shapeRef: any;
  syncShapeInStorage: (shape: fabric.Object) => void;
};

// Type for handling mouse up events on the canvas
export type CanvasMouseUp = {
  canvas: fabric.Canvas;
  isDrawing: React.MutableRefObject<boolean>;
  shapeRef: any;
  activeObjectRef: React.MutableRefObject<fabric.Object | null>;
  selectedShapeRef: any;
  syncShapeInStorage: (shape: fabric.Object) => void;
  setActiveElement: any;
};

// Type for handling object modification events on the canvas
export type CanvasObjectModified = {
  options: fabric.IEvent;
  syncShapeInStorage: (shape: fabric.Object) => void;
};

// Type for handling path creation events on the canvas
export type CanvasPathCreated = {
  options: (fabric.IEvent & { path: CustomFabricObject<fabric.Path> }) | any;
  syncShapeInStorage: (shape: fabric.Object) => void;
};

// Type for handling selection creation events on the canvas
export type CanvasSelectionCreated = {
  options: fabric.IEvent;
  isEditingRef: React.MutableRefObject<boolean>;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};

// Type for handling object scaling events on the canvas
export type CanvasObjectScaling = {
  options: fabric.IEvent;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};

// Props for rendering the canvas component
export type RenderCanvas = {
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
  canvasObjects: any;
  activeObjectRef: any;
};

// Props for the cursor chat component
export type CursorChatProps = {
  cursor: { x: number; y: number };
  cursorState: CursorState;
  setCursorState: (cursorState: CursorState) => void;
  updateMyPresence: (
    presence: Partial<{
      cursor: { x: number; y: number };
      cursorColor: string;
      message: string;
    }>
  ) => void;
};
