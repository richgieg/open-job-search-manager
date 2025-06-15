import { InputLabelText } from "./InputLabelText";

type Props = {
  label: string;
  value: string | null;
  setValue: (text: string | null) => void;
  originalValue: string | null;
  required?: false;
};

type Props2 = {
  label: string;
  value: string;
  setValue: (text: string) => void;
  originalValue: string;
  required: true;
};

export function DateEditor({
  label,
  value,
  setValue,
  originalValue,
  required,
}: Props | Props2) {
  return (
    <label>
      <InputLabelText text={label} />
      <input
        className={`w-full px-2 py-1 border-1 focus:outline-none focus:ring-3 focus:ring-blue-300 focus:ring-offset-0 ${
          value !== originalValue && "border-orange-400"
        }`}
        type="date"
        value={value ?? ""}
        onChange={(e) => {
          if (required) {
            setValue(e.target.value);
          } else {
            setValue(e.target.value.trim() ? e.target.value : null);
          }
        }}
        required={required}
      />
    </label>
  );
}
