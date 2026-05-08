"use client";

import Image from "next/image";
import { fabric } from "fabric";

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

  return (
    <section className="sticky left-0 flex h-full min-w-[227px] select-none flex-col overflow-y-auto border-r border-primary-grey-200 bg-primary-black pb-20 text-primary-grey-300 max-sm:hidden">
      <h3 className="border-b border-primary-grey-200 px-5 py-4 text-xs uppercase tracking-wide">
        Layers
      </h3>
      {allShapes?.length === 0 ? (
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
        <div className="flex flex-col py-1">
          {allShapes?.map((shape: any) => {
            const objectId = shape[1]?.objectId;
            const info = getShapeInfo(shape[1]?.type);
            const isSelected = objectId && objectId === activeObjectId;
            return (
              <button
                type="button"
                key={objectId}
                onClick={() => handleLayerClick(objectId)}
                className={`group mx-2 my-0.5 flex items-center gap-2 rounded px-3 py-2 text-left transition-colors ${
                  isSelected
                    ? "bg-primary-green text-primary-black"
                    : "hover:bg-primary-grey-200 hover:text-white"
                }`}
              >
                <Image
                  src={info?.icon}
                  alt="Layer"
                  width={14}
                  height={14}
                  className={isSelected ? "invert" : "group-hover:invert"}
                />
                <span className="text-xs font-medium capitalize">
                  {info.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default LeftSidebar;
