import React, { useCallback, useRef } from "react";
import Image from "next/image";
import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignStartVertical,
  Copy,
  MousePointer2,
} from "lucide-react";

import { AlignAxis, RightSidebarProps } from "@/types/type";
import { bringElement, modifyShape } from "@/lib/shapes";
import { directionOptions } from "@/constants";

import Appearance from "./settings/Appearance";
import Color from "./settings/Color";
import Dimensions from "./settings/Dimensions";
import Export from "./settings/Export";
import Text from "./settings/Text";

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h4 className="border-b border-primary-grey-200 px-4 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-wide text-primary-grey-300">
    {children}
  </h4>
);

const ALIGN_BUTTONS: Array<{
  axis: AlignAxis;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { axis: "left", label: "Align left", Icon: AlignStartVertical },
  { axis: "horizontalCenter", label: "Align horizontal center", Icon: AlignCenterVertical },
  { axis: "right", label: "Align right", Icon: AlignEndVertical },
  { axis: "top", label: "Align top", Icon: AlignStartHorizontal },
  { axis: "verticalCenter", label: "Align vertical center", Icon: AlignCenterHorizontal },
  { axis: "bottom", label: "Align bottom", Icon: AlignEndHorizontal },
];

const RightSidebar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  activeObjectId,
  isEditingRef,
  syncShapeInStorage,
  brushSize,
  setBrushSize,
  duplicateActive,
  alignSelected,
  activeTool,
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
  const showCornerRadius = elementAttributes.cornerRadius !== "";
  const isFreeform = activeTool === "freeform";

  if (!hasSelection) {
    return (
      <section className="sticky right-0 flex h-full min-w-[227px] max-w-xs select-none flex-col overflow-y-auto border-l border-primary-grey-200 bg-primary-black text-primary-grey-300 max-sm:hidden">
        <h3 className="border-b border-primary-grey-200 px-4 py-4 text-xs uppercase tracking-wide">
          Design
        </h3>

        {isFreeform ? (
          <div className="border-b border-primary-grey-200 px-4 py-4">
            <SectionHeader>Brush</SectionHeader>
            <div className="mt-3 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-primary-grey-300">Size</span>
                <span className="text-[11px] tabular-nums text-white">
                  {brushSize}px
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={60}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="h-1 w-full cursor-pointer appearance-none rounded bg-primary-grey-200 accent-primary-green"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <MousePointer2 className="h-6 w-6 opacity-40" />
            <p className="text-xs leading-relaxed text-primary-grey-300">
              Select an object on the canvas to edit its properties.
            </p>
          </div>
        )}

        <div className="border-t border-primary-grey-200">
          <Export />
        </div>
      </section>
    );
  }

  return (
    <section className="sticky right-0 flex h-full min-w-[227px] max-w-xs select-none flex-col overflow-y-auto border-l border-primary-grey-200 bg-primary-black text-primary-grey-300 max-sm:hidden">
      <h3 className="px-4 pt-4 text-xs uppercase tracking-wide">Design</h3>
      <span className="mt-1 border-b border-primary-grey-200 px-4 pb-3 text-[11px] text-primary-grey-300">
        Adjust the selected object
      </span>

      <SectionHeader>Position &amp; Size</SectionHeader>
      <Dimensions
        isEditingRef={isEditingRef}
        width={elementAttributes.width}
        height={elementAttributes.height}
        left={elementAttributes.left}
        top={elementAttributes.top}
        angle={elementAttributes.angle}
        handleInputChange={handleInputChange}
      />

      <SectionHeader>Appearance</SectionHeader>
      <Appearance
        opacity={elementAttributes.opacity}
        strokeWidth={elementAttributes.strokeWidth}
        cornerRadius={elementAttributes.cornerRadius}
        showCornerRadius={showCornerRadius}
        isEditingRef={isEditingRef}
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
        placeholder="fill"
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
      <div className="flex flex-col gap-3 border-b border-primary-grey-200 px-4 py-3">
        <div className="grid grid-cols-3 gap-1">
          {ALIGN_BUTTONS.map(({ axis, label, Icon }) => (
            <button
              key={axis}
              type="button"
              title={label}
              aria-label={label}
              onClick={() => alignSelected(axis)}
              className="flex h-7 w-full items-center justify-center rounded border border-primary-grey-200 text-primary-grey-300 hover:bg-primary-green hover:text-primary-black"
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
        <div className="flex gap-1">
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
              className="flex h-7 w-full items-center justify-center gap-1.5 rounded border border-primary-grey-200 text-[10px] text-primary-grey-300 hover:bg-primary-green hover:text-primary-black"
            >
              <Image
                src={option.icon}
                alt={option.label}
                width={12}
                height={12}
              />
              <span>
                {option.label.replace("Bring to ", "").replace("Send to ", "")}
              </span>
            </button>
          ))}
          <button
            type="button"
            title="Duplicate (⌘ D)"
            aria-label="Duplicate"
            onClick={duplicateActive}
            className="flex h-7 w-full items-center justify-center gap-1.5 rounded border border-primary-grey-200 text-[10px] text-primary-grey-300 hover:bg-primary-green hover:text-primary-black"
          >
            <Copy className="h-3 w-3" />
            <span>Dup</span>
          </button>
        </div>
      </div>

      <SectionHeader>Export</SectionHeader>
      <Export />
    </section>
  );
};

export default RightSidebar;
