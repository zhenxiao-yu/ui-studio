import { Label } from "../ui/label";
import { Input } from "../ui/input";

const fields = [
  { label: "X", property: "left" },
  { label: "Y", property: "top" },
  { label: "W", property: "width" },
  { label: "H", property: "height" },
  { label: "°", property: "angle" },
] as const;

type Props = {
  width: string;
  height: string;
  left: string;
  top: string;
  angle: string;
  isEditingRef: React.MutableRefObject<boolean>;
  handleInputChange: (property: string, value: string) => void;
};

const Dimensions = ({
  width,
  height,
  left,
  top,
  angle,
  isEditingRef,
  handleInputChange,
}: Props) => {
  const valueFor = (prop: string) =>
    prop === "width"
      ? width
      : prop === "height"
        ? height
        : prop === "left"
          ? left
          : prop === "top"
            ? top
            : angle;

  return (
    <section className="border-b border-primary-grey-200">
      <div className="grid grid-cols-2 gap-2 px-4 py-3">
        {fields.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <Label
              htmlFor={item.property}
              className="w-3 text-[11px] font-bold text-primary-grey-300"
            >
              {item.label}
            </Label>
            <Input
              type="number"
              id={item.property}
              placeholder="0"
              value={valueFor(item.property)}
              className="w-full rounded border border-primary-grey-200 bg-primary-black px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
              onChange={(e) => handleInputChange(item.property, e.target.value)}
              onBlur={() => {
                isEditingRef.current = false;
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Dimensions;
