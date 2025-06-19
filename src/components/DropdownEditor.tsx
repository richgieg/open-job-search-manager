import { InputLabelText } from "./InputLabelText";

type Props<T extends string | null> = {
  label: string;
  value: T;
  setValue: (text: T) => void;
  originalValue: T;
  options: readonly Exclude<T, null>[];
  translations: { [P in Exclude<T, null>]: string };
  includeEmptyOption?: boolean;
};

export function DropdownEditor<T extends string | null>({
  label,
  value,
  setValue,
  originalValue,
  options,
  translations,
  includeEmptyOption = false,
}: Props<T>) {
  return (
    <label>
      <InputLabelText text={label} />
      <select
        className={`w-full px-2 py-1 border-1 focus:outline-none focus:ring-3 focus:ring-blue-300 focus:ring-offset-0 ${
          value !== originalValue && "border-orange-400"
        }`}
        value={value ?? ""}
        onChange={(e) =>
          setValue((e.target.value ? e.target.value : null) as T)
        }
      >
        {includeEmptyOption && <option value=""></option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {translations[o]}
          </option>
        ))}
      </select>
    </label>
  );
}
