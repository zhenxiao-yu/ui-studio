"use client";

import React from "react";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

import { LeftSidebar, Live, Navbar, RightSidebar } from "@/components/index";
import Onboarding from "@/components/Onboarding";
import { useFabricCanvas } from "@/hooks/useFabricCanvas";
import { useLiveStorage } from "@/hooks/useLiveStorage";

const ResizeHandle = ({ orientation = "vertical" }: { orientation?: "vertical" | "horizontal" }) => (
  <PanelResizeHandle
    className={
      orientation === "vertical"
        ? "group relative w-1 bg-primary-grey-200/40 transition-colors hover:bg-primary-green data-[resize-handle-active]:bg-primary-green"
        : "group relative h-1 bg-primary-grey-200/40 transition-colors hover:bg-primary-green data-[resize-handle-active]:bg-primary-green"
    }
  >
    <span className="absolute inset-0 flex items-center justify-center">
      <span
        className={
          orientation === "vertical"
            ? "h-8 w-0.5 rounded-full bg-primary-grey-100 opacity-0 transition-opacity group-hover:opacity-100"
            : "h-0.5 w-8 rounded-full bg-primary-grey-100 opacity-0 transition-opacity group-hover:opacity-100"
        }
      />
    </span>
  </PanelResizeHandle>
);

const Editor = () => {
  const {
    canvasObjects,
    undo,
    redo,
    syncShapeInStorage,
    deleteShapeFromStorage,
    deleteAllShapes,
  } = useLiveStorage();

  const {
    canvasRef,
    fabricRef,
    imageInputRef,
    activeElement,
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
  } = useFabricCanvas({
    syncShapeInStorage,
    deleteShapeFromStorage,
    deleteAllShapes,
    undo,
    redo,
    canvasObjects,
  });

  return (
    <main className="relative flex h-screen flex-col overflow-hidden">
      <Onboarding />
      <Navbar
        imageInputRef={imageInputRef}
        activeElement={activeElement}
        handleImageUpload={handleImageUploadChange}
        handleActiveElement={handleActiveElement}
      />

      <PanelGroup direction="horizontal" className="flex-1" autoSaveId="ui-studio:editor">
        <Panel
          defaultSize={16}
          minSize={12}
          maxSize={32}
          className="hidden bg-primary-black sm:block"
        >
          <LeftSidebar
            allShapes={Array.from(canvasObjects ?? [])}
            fabricRef={fabricRef}
            activeObjectId={activeObjectId}
          />
        </Panel>

        <ResizeHandle />

        <Panel minSize={30} className="bg-primary-grey-800">
          <Live
            canvasRef={canvasRef}
            fabricRef={fabricRef}
            undo={undo}
            redo={redo}
          />
        </Panel>

        <ResizeHandle />

        <Panel
          defaultSize={20}
          minSize={14}
          maxSize={36}
          className="hidden bg-primary-black sm:block"
        >
          <RightSidebar
            elementAttributes={elementAttributes}
            setElementAttributes={setElementAttributes}
            fabricRef={fabricRef}
            isEditingRef={isEditingRef}
            activeObjectRef={activeObjectRef}
            activeObjectId={activeObjectId}
            syncShapeInStorage={syncShapeInStorage}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            duplicateActive={duplicateActive}
            alignSelected={alignSelected}
            activeTool={activeElement?.value ?? null}
          />
        </Panel>
      </PanelGroup>
    </main>
  );
};

export default Editor;
