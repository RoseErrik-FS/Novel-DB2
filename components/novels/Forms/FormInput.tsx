// components\novels\Forms\FormInput.tsx
import React from "react";
import { Input, Textarea } from "@nextui-org/react";

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type?: string;
  required?: boolean;
  fullWidth?: boolean;
  min?: string;
  max?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  fullWidth = true,
  min,
  max,
}) => {
  return type === "textarea" ? (
    <Textarea
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      fullWidth={fullWidth}
    />
  ) : (
    <Input
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      required={required}
      fullWidth={fullWidth}
      min={min}
      max={max}
    />
  );
};

export default FormInput;
