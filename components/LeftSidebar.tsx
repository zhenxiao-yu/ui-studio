"use client";

import Image from "next/image";
import { fabric } from "fabric";
import { Layers3 } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { getLayerLabel, getShapeInfo } from "@/lib/utils";

type Props = {
  allShapes: Array<any>;
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
  activeObjectId?: string | null;
};

const LeftSidebar = ({ allShapes, fabricRef, activeObjectId }: Props) => {
  const handleLayerClick = (objectId: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const target = canvas
      .getObjects()
      .find((obj: any) => obj.objectId === objectId);

    if (target) {
      canvas.setActiveObject(target);
      canvas.requestRenderAll();
    }
  };

  const count = allShapes?.length ?? 0;
  const layers = [...(allShapes ?? [])].reverse();

  return (
    <aside className="flex h-full select-none flex-col bg-primary-black text-primary-grey-300">
      <header className="flex items-center justify-between border-b border-primary-grey-200 px-4 py-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-wide">
          Layers
        </h3>
        <span className="font-mono text-[10px] tabular-nums text-primary-grey-300">
          {count}
        </span>
      </header>

      {count === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
          <Layers3 className="h-6 w-6 opacity-30" />
          <p className="text-xs text-primary-grey-300 opacity-70">
            No layers yet. Draw a shape, add text, or drop in an image to build your board.
          </p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-0.5 px-2 py-2">
            {layers.map((shape: any, index: number) => {
              const objectId = shape[1]?.objectId;
              const info = getShapeInfo(shape[1]?.type);
              const label = getLayerLabel(shape[1] ?? {});
              const isSelected = objectId && objectId === activeObjectId;
              return (
                <button
                  type="button"
                  key={objectId}
                  onClick={() => handleLayerClick(objectId)}
                  className={`group flex items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-primary-green text-primary-black"
                      : "text-white hover:bg-primary-grey-200"
                  }`}
                >
                  <Image
                    src={info?.icon}
                    alt="Layer"
                    width={14}
                    height={14}
                    className={isSelected ? "invert" : "opacity-70"}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{label}</div>
                    <div
                      className={`text-[10px] ${
                        isSelected
                          ? "text-primary-black/70"
                          : "text-primary-grey-300"
                      }`}
                    >
                      {index === 0 ? "Top layer" : "Layer"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </aside>
  );
};

export default LeftSidebar;
