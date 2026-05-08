"use client";

import React from "react";

import { LeftSidebar, Live, Navbar, RightSidebar } from "@/components/index";
import Onboarding from "@/components/Onboarding";
import { useFabricCanvas } from "@/hooks/useFabricCanvas";
import { useLiveStorage } from "@/hooks/useLiveStorage";

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
    <main className="relative h-screen overflow-hidden">
      <Onboarding />
      <Navbar
        imageInputRef={imageInputRef}
        activeElement={activeElement}
        handleImageUpload={handleImageUploadChange}
        handleActiveElement={handleActiveElement}
      />

      <section className="flex h-full flex-row">
        <LeftSidebar
          allShapes={Array.from(canvasObjects ?? [])}
          fabricRef={fabricRef}
          activeObjectId={activeObjectId}
        />

        <Live
          canvasRef={canvasRef}
          fabricRef={fabricRef}
          undo={undo}
          redo={redo}
        />

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
      </section>
    </main>
  );
};

export default Editor;
