import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

type Props = {
  opacity: string;
  strokeWidth: string;
  cornerRadius: string;
  showCornerRadius: boolean;
  isEditingRef: React.MutableRefObject<boolean>;
  handleInputChange: (property: string, value: string) => void;
};

const Appearance = ({
  opacity,
  strokeWidth,
  cornerRadius,
  showCornerRadius,
  isEditingRef,
  handleInputChange,
}: Props) => {
  const opacityValue = Number(opacity || "100");

  return (
    <section className="flex flex-col gap-3 border-b border-primary-grey-200 px-4 py-3">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="opacity"
            className="text-[11px] font-medium text-primary-grey-300"
          >
            Opacity
          </Label>
          <span className="font-mono text-[11px] tabular-nums text-white">
            {Number.isFinite(opacityValue) ? opacityValue : 100}%
          </span>
        </div>
        <Slider
          id="opacity"
          min={0}
          max={100}
          step={1}
          value={[Number.isFinite(opacityValue) ? opacityValue : 100]}
          onValueChange={(values) => {
            handleInputChange("opacity", String(values[0]));
          }}
          onValueCommit={() => {
            isEditingRef.current = false;
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <Label
          htmlFor="strokeWidth"
          className="w-20 text-[11px] font-medium text-primary-grey-300"
        >
          Stroke
        </Label>
        <Input
          type="number"
          id="strokeWidth"
          min={0}
          max={50}
          placeholder="0"
          value={strokeWidth}
          className="w-full rounded border border-primary-grey-200 bg-primary-black px-2 py-1 font-mono text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
          onChange={(e) => handleInputChange("strokeWidth", e.target.value)}
          onBlur={() => {
            isEditingRef.current = false;
          }}
        />
      </div>

      {showCornerRadius && (
        <div className="flex items-center gap-2">
          <Label
            htmlFor="cornerRadius"
            className="w-20 text-[11px] font-medium text-primary-grey-300"
          >
            Radius
          </Label>
          <Input
            type="number"
            id="cornerRadius"
            min={0}
            max={500}
            placeholder="0"
            value={cornerRadius}
            className="w-full rounded border border-primary-grey-200 bg-primary-black px-2 py-1 font-mono text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
            onChange={(e) => handleInputChange("cornerRadius", e.target.value)}
            onBlur={() => {
              isEditingRef.current = false;
            }}
          />
        </div>
      )}
    </section>
  );
};

export default Appearance;
