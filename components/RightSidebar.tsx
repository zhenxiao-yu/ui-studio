import React, { useMemo, useRef } from "react";
import Image from "next/image";

import { RightSidebarProps } from "@/types/type";
import { bringElement, modifyShape } from "@/lib/shapes";
import { directionOptions } from "@/constants";

import Text from "./settings/Text";
import Color from "./settings/Color";
import Export from "./settings/Export";
import Dimensions from "./settings/Dimensions";

const RightSidebar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
  syncShapeInStorage,
}: RightSidebarProps) => {
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);

  const handleInputChange = (property: string, value: string) => {
    if (!isEditingRef.current) isEditingRef.current = true;

    setElementAttributes((prev) => ({ ...prev, [property]: value }));

    modifyShape({
      canvas: fabricRef.current as fabric.Canvas,
      property,
      value,
      activeObjectRef,
      syncShapeInStorage,
    });
  };

  // Memoize the content of the right sidebar to avoid re-rendering on every mouse action
  const memoizedContent = useMemo(
    () => (
      <section className='sticky right-0 flex h-full min-w-[227px] max-w-xs select-none flex-col border-t border-primary-grey-200 bg-primary-black text-primary-grey-300 max-sm:min-w-full max-sm:max-w-full sm:min-w-[227px] sm:max-w-xs'>
        <h3 className='px-5 pt-4 text-xs uppercase'>Design</h3>
        <span className='mt-3 border-b border-primary-grey-200 px-5 pb-4 text-xs text-primary-grey-300'>
          Make changes to canvas as you like
        </span>

        <Dimensions
          isEditingRef={isEditingRef}
          width={elementAttributes.width}
          height={elementAttributes.height}
          handleInputChange={handleInputChange}
        />

        <Text
          fontFamily={elementAttributes.fontFamily}
          fontSize={elementAttributes.fontSize}
          fontWeight={elementAttributes.fontWeight}
          handleInputChange={handleInputChange}
        />

        <Color
          inputRef={strokeInputRef}
          attribute={elementAttributes.stroke}
          placeholder='stroke'
          attributeType='stroke'
          handleInputChange={handleInputChange}
        />

        <Color
          inputRef={colorInputRef}
          attribute={elementAttributes.fill}
          placeholder='color'
          attributeType='fill'
          handleInputChange={handleInputChange}
        />

        <div className='flex flex-col gap-3 border-b border-primary-grey-200 px-5 py-3'>
          <h3 className='text-[10px] uppercase'>Order</h3>
          <div className='flex gap-2'>
            {directionOptions.map((option) => (
              <button
                key={option.value}
                title={option.label}
                onClick={() =>
                  bringElement({
                    canvas: fabricRef.current as fabric.Canvas,
                    direction: option.value,
                    syncShapeInStorage,
                  })
                }
                className='flex h-8 w-full items-center justify-center gap-1.5 rounded border border-primary-grey-200 text-[10px] hover:bg-primary-green hover:text-primary-black'
              >
                <Image src={option.icon} alt={option.label} width={14} height={14} />
                <span>{option.label.replace("Bring to ", "").replace("Send to ", "")}</span>
              </button>
            ))}
          </div>
        </div>

        <Export />
      </section>
    ),
    [elementAttributes]
  ); // Only re-render when elementAttributes changes

  return memoizedContent;
};

export default RightSidebar;
