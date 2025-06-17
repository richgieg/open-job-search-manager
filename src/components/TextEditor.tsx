import { InputLabelText } from "./InputLabelText";

type Props = {
  label?: string;
  type?: "text" | "tel" | "email" | "password" | "url";
  value: string;
  setValue: (text: string) => void;
  originalValue: string;
};

export function TextEditor({
  label,
  type,
  value,
  setValue,
  originalValue,
}: Props) {
  return (
    <label>
      {label && <InputLabelText text={label} />}
      <input
        className={`w-full px-2 py-1 border-1 focus:outline-none focus:ring-3 focus:ring-blue-300 focus:ring-offset-0 ${
          value !== originalValue && "border-orange-400"
        }`}
        type={type ?? "text"}
        value={value}
        title={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  );
}
