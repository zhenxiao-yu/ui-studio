"use client";

import { useMutation, useRedo, useStorage, useUndo } from "@/liveblocks.config";
import { CustomFabricObject } from "@/types/type";
import { fabric } from "fabric";

export const useLiveStorage = () => {
  const undo = useUndo();
  const redo = useRedo();
  const canvasObjects = useStorage((root) => root.canvasObjects);

  const deleteShapeFromStorage = useMutation(({ storage }, shapeId: string) => {
    storage.get("canvasObjects").delete(shapeId);
  }, []);

  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObjects = storage.get("canvasObjects");
    if (!canvasObjects || canvasObjects.size === 0) return true;
    for (const [key] of canvasObjects.entries()) {
      canvasObjects.delete(key);
    }
    return canvasObjects.size === 0;
  }, []);

  const syncShapeInStorage = useMutation(({ storage }, object: CustomFabricObject<fabric.Object>) => {
    if (!object) return;
    const objectId = object.objectId;
    if (!objectId) return;
    const shapeData = object.toJSON() as Record<string, unknown>;
    shapeData.objectId = objectId;
    storage.get("canvasObjects").set(objectId, shapeData);
  }, []);

  return { canvasObjects, undo, redo, syncShapeInStorage, deleteShapeFromStorage, deleteAllShapes };
};
