import { InputLabelText } from "./InputLabelText";

type Props = {
  label?: string;
  value: string;
  setValue: (text: string) => void;
  originalValue: string;
  className?: string;
};

export function LongTextEditor({
  label,
  value,
  setValue,
  originalValue,
  className,
}: Props) {
  return (
    <label className={`flex flex-col ${className ?? ""}`}>
      {label && <InputLabelText text={label} />}
      <textarea
        className={`w-full grow px-2 py-1 border-1 focus:outline-none focus:ring-3 focus:ring-blue-300 focus:ring-offset-0 ${
          value !== originalValue && "border-orange-400"
        }`}
        value={value}
        title={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  );
}
