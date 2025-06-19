import { forwardRef } from "react";
import { InputLabelText } from "./InputLabelText";

type Props = {
  label?: string;
  type?: "text" | "tel" | "email" | "password" | "url";
  required?: boolean;
  disabled?: boolean;
  value: string;
  setValue: (text: string) => void;
};

export const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ label, type, required, disabled, value, setValue }, ref) => {
    return (
      <label>
        {label && <InputLabelText text={label} />}
        <input
          ref={ref}
          className="w-full px-2 py-1 border-1 focus:outline-none focus:ring-3 focus:ring-blue-300 focus:ring-offset-0"
          type={type ?? "text"}
          required={required}
          disabled={disabled}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
    );
  }
);

TextInput.displayName = "TextInput";
