import React, { useCallback, useRef } from "react";
import Image from "next/image";
import { MousePointer2 } from "lucide-react";

import { RightSidebarProps } from "@/types/type";
import { bringElement, modifyShape } from "@/lib/shapes";
import { directionOptions } from "@/constants";

import Text from "./settings/Text";
import Color from "./settings/Color";
import Export from "./settings/Export";
import Dimensions from "./settings/Dimensions";

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h4 className="border-b border-primary-grey-200 px-5 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-wide text-primary-grey-300">
    {children}
  </h4>
);

const RightSidebar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  activeObjectId,
  isEditingRef,
  syncShapeInStorage,
}: RightSidebarProps) => {
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);

  const handleInputChange = useCallback(
    (property: string, value: string) => {
      if (!isEditingRef.current) isEditingRef.current = true;

      setElementAttributes((prev) => ({ ...prev, [property]: value }));

      modifyShape({
        canvas: fabricRef.current as fabric.Canvas,
        property,
        value,
        activeObjectRef,
        syncShapeInStorage,
      });
    },
    [
      activeObjectRef,
      fabricRef,
      isEditingRef,
      setElementAttributes,
      syncShapeInStorage,
    ]
  );

  const hasSelection = activeObjectId !== null;
  const isText = !!elementAttributes.fontSize;

  if (!hasSelection) {
    return (
      <section className="sticky right-0 flex h-full min-w-[227px] max-w-xs select-none flex-col border-l border-primary-grey-200 bg-primary-black text-primary-grey-300 max-sm:hidden">
        <h3 className="border-b border-primary-grey-200 px-5 py-4 text-xs uppercase tracking-wide">
          Design
        </h3>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <MousePointer2 className="h-6 w-6 opacity-40" />
          <p className="text-xs leading-relaxed text-primary-grey-300">
            Select an object on the canvas to edit its properties.
          </p>
        </div>
        <div className="border-t border-primary-grey-200">
          <Export />
        </div>
      </section>
    );
  }

  return (
    <section className="sticky right-0 flex h-full min-w-[227px] max-w-xs select-none flex-col overflow-y-auto border-l border-primary-grey-200 bg-primary-black text-primary-grey-300 max-sm:hidden">
      <h3 className="px-5 pt-4 text-xs uppercase tracking-wide">Design</h3>
      <span className="mt-1 border-b border-primary-grey-200 px-5 pb-3 text-[11px] text-primary-grey-300">
        Adjust the selected object
      </span>

      <SectionHeader>Position &amp; Size</SectionHeader>
      <Dimensions
        isEditingRef={isEditingRef}
        width={elementAttributes.width}
        height={elementAttributes.height}
        handleInputChange={handleInputChange}
      />

      <SectionHeader>Fill &amp; Stroke</SectionHeader>
      <Color
        inputRef={strokeInputRef}
        attribute={elementAttributes.stroke}
        placeholder="stroke"
        attributeType="stroke"
        handleInputChange={handleInputChange}
      />
      <Color
        inputRef={colorInputRef}
        attribute={elementAttributes.fill}
        placeholder="color"
        attributeType="fill"
        handleInputChange={handleInputChange}
      />

      {isText && (
        <>
          <SectionHeader>Text</SectionHeader>
          <Text
            fontFamily={elementAttributes.fontFamily}
            fontSize={elementAttributes.fontSize}
            fontWeight={elementAttributes.fontWeight}
            handleInputChange={handleInputChange}
          />
        </>
      )}

      <SectionHeader>Arrange</SectionHeader>
      <div className="flex flex-col gap-3 border-b border-primary-grey-200 px-5 py-3">
        <div className="flex gap-2">
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
              className="flex h-8 w-full items-center justify-center gap-1.5 rounded border border-primary-grey-200 text-[10px] hover:bg-primary-green hover:text-primary-black"
            >
              <Image
                src={option.icon}
                alt={option.label}
                width={14}
                height={14}
              />
              <span>
                {option.label.replace("Bring to ", "").replace("Send to ", "")}
              </span>
            </button>
          ))}
        </div>
      </div>

      <SectionHeader>Export</SectionHeader>
      <Export />
    </section>
  );
};

export default RightSidebar;
