"use client";

import { Pipette } from "lucide-react";
import { toast } from "sonner";

import { Label } from "../ui/label";

const PALETTE = [
  "#000000",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#aabbcc",
  "transparent",
];

type Props = {
  inputRef: any;
  attribute: string;
  placeholder: string;
  attributeType: string;
  handleInputChange: (property: string, value: string) => void;
};

const supportsEyeDropper = () =>
  typeof window !== "undefined" && "EyeDropper" in window;

const Color = ({
  inputRef,
  attribute,
  placeholder,
  attributeType,
  handleInputChange,
}: Props) => {
  const handleEyedropper = async () => {
    if (!supportsEyeDropper()) {
      toast.info("Eyedropper isn't supported in this browser");
      return;
    }
    try {
      const dropper = new (window as any).EyeDropper();
      const result = await dropper.open();
      if (result?.sRGBHex) {
        handleInputChange(attributeType, result.sRGBHex);
      }
    } catch {
      // User cancelled the eyedropper — no-op.
    }
  };

  return (
    <div className="flex flex-col gap-2 border-b border-primary-grey-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] uppercase tracking-wide text-primary-grey-300">
          {placeholder}
        </h3>
        <button
          type="button"
          aria-label="Pick color from screen"
          onClick={handleEyedropper}
          className="flex h-5 w-5 items-center justify-center rounded text-primary-grey-300 hover:bg-primary-grey-200 hover:text-white"
        >
          <Pipette className="h-3 w-3" />
        </button>
      </div>

      <div className="flex items-center gap-2 rounded border border-primary-grey-200 px-2 py-1">
        <input
          type="color"
          value={attribute || "#000000"}
          ref={inputRef}
          onChange={(e) => handleInputChange(attributeType, e.target.value)}
          className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0"
        />
        <Label className="flex-1 truncate text-xs text-white">{attribute}</Label>
      </div>

      <div className="grid grid-cols-6 gap-1">
        {PALETTE.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Set ${placeholder} to ${color}`}
            onClick={() => handleInputChange(attributeType, color)}
            className={`h-5 w-5 rounded border ${
              attribute?.toLowerCase() === color.toLowerCase()
                ? "border-primary-green ring-1 ring-primary-green"
                : "border-primary-grey-200 hover:border-white"
            }`}
            style={{
              background:
                color === "transparent"
                  ? "repeating-conic-gradient(#666 0 25%, #999 0 50%) 50%/8px 8px"
                  : color,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Color;
