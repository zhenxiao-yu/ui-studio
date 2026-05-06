"use client";

import React from "react";

import { LeftSidebar, Live, Navbar, RightSidebar } from "@/components/index";
import Onboarding from "@/components/Onboarding";
import { useLiveStorage } from "@/hooks/useLiveStorage";
import { useFabricCanvas } from "@/hooks/useFabricCanvas";

const Home = () => {
  const { canvasObjects, undo, redo, syncShapeInStorage, deleteShapeFromStorage, deleteAllShapes } =
    useLiveStorage();

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
    handleImageUploadChange,
  } = useFabricCanvas({ syncShapeInStorage, deleteShapeFromStorage, deleteAllShapes, undo, redo, canvasObjects });

  return (
    <main className='relative h-screen overflow-hidden'>
      <Onboarding />
      <Navbar
        imageInputRef={imageInputRef}
        activeElement={activeElement}
        handleImageUpload={handleImageUploadChange}
        handleActiveElement={handleActiveElement}
      />

      <section className='flex h-full flex-row'>
        <LeftSidebar allShapes={Array.from(canvasObjects ?? [])} fabricRef={fabricRef} />

        <Live canvasRef={canvasRef} undo={undo} redo={redo} />

        <RightSidebar
          elementAttributes={elementAttributes}
          setElementAttributes={setElementAttributes}
          fabricRef={fabricRef}
          isEditingRef={isEditingRef}
          activeObjectRef={activeObjectRef}
          syncShapeInStorage={syncShapeInStorage}
        />
      </section>
    </main>
  );
};

export default Home;
