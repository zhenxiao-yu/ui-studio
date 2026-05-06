"use client";

import Image from "next/image";
import { fabric } from "fabric";

import { getShapeInfo } from "@/lib/utils";

type Props = {
  allShapes: Array<any>;
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
};

const LeftSidebar = ({ allShapes, fabricRef }: Props) => {
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
    <section className='sticky left-0 flex h-full min-w-[227px] select-none flex-col overflow-y-auto border-t border-primary-grey-200 bg-primary-black pb-20 text-primary-grey-300 max-sm:hidden'>
      <h3 className='border border-primary-grey-200 px-5 py-4 text-xs uppercase'>
        Layers
      </h3>
      {allShapes?.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-2 py-10 text-center'>
          <Image
            src='/assets/rectangle.svg'
            alt='empty'
            width={24}
            height={24}
            className='opacity-30'
          />
          <p className='text-xs text-primary-grey-300 opacity-60'>
            No layers yet.
            <br />
            Start drawing.
          </p>
        </div>
      ) : (
        <div className='flex flex-col'>
          {allShapes?.map((shape: any) => {
            const info = getShapeInfo(shape[1]?.type);
            return (
              <div
                key={shape[1]?.objectId}
                onClick={() => handleLayerClick(shape[1]?.objectId)}
                className='group my-1 flex items-center gap-2 px-5 py-2.5 hover:cursor-pointer hover:bg-primary-green hover:text-primary-black'
              >
                <Image
                  src={info?.icon}
                  alt='Layer'
                  width={16}
                  height={16}
                  className='group-hover:invert'
                />
                <h3 className='text-sm font-semibold capitalize'>
                  {info.name}
                </h3>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default LeftSidebar;
