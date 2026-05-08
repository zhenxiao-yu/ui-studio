"use client";

import Image from "next/image";
import { fabric } from "fabric";

import { ScrollArea } from "@/components/ui/scroll-area";
import { getShapeInfo } from "@/lib/utils";

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
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <Image
            src="/assets/rectangle.svg"
            alt="empty"
            width={24}
            height={24}
            className="opacity-30"
          />
          <p className="text-xs text-primary-grey-300 opacity-60">
            No layers yet.
            <br />
            Start drawing.
          </p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-0.5 px-2 py-2">
            {allShapes?.map((shape: any) => {
              const objectId = shape[1]?.objectId;
              const info = getShapeInfo(shape[1]?.type);
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
                  <span className="truncate capitalize">{info.name}</span>
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
