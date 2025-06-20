import { InputLabelText } from "./InputLabelText";

type Props = {
  label?: string;
  value: string;
  setValue: (text: string) => void;
  className?: string;
  required?: boolean;
  disabled?: boolean;
};

export function LongTextInput({
  label,
  value,
  setValue,
  className,
  required,
  disabled,
}: Props) {
  return (
    <label className={`flex flex-col ${className ?? ""}`}>
      {label && <InputLabelText text={label} />}
      <textarea
        className="w-full grow px-2 py-1 border-1 focus:outline-none focus:ring-3 focus:ring-blue-300 focus:ring-offset-0"
        value={value}
        title={value}
        onChange={(e) => setValue(e.target.value)}
        required={required}
        disabled={disabled}
      />
    </label>
  );
}
