"use client";

import {
  InputWrapper,
  Label,
  StyledInput,
  StyledSelect,
  StyledTextarea,
  ErrorMessage,
  HelperText,
} from "./Input.styles";
import {
  forwardRef,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

// Input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = true, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, "-");

    return (
      <InputWrapper $fullWidth={fullWidth} $hasError={!!error}>
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <StyledInput ref={ref} id={inputId} $hasError={!!error} {...props} />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {helperText && !error && <HelperText>{helperText}</HelperText>}
      </InputWrapper>
    );
  },
);

Input.displayName = "Input";

// Select
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      id,
      options,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s/g, "-");

    return (
      <InputWrapper $fullWidth={fullWidth} $hasError={!!error}>
        {label && <Label htmlFor={selectId}>{label}</Label>}
        <StyledSelect ref={ref} id={selectId} $hasError={!!error} {...props}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </StyledSelect>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {helperText && !error && <HelperText>{helperText}</HelperText>}
      </InputWrapper>
    );
  },
);

Select.displayName = "Select";

// Textarea
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, fullWidth = true, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s/g, "-");

    return (
      <InputWrapper $fullWidth={fullWidth} $hasError={!!error}>
        {label && <Label htmlFor={textareaId}>{label}</Label>}
        <StyledTextarea
          ref={ref}
          id={textareaId}
          $hasError={!!error}
          {...props}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {helperText && !error && <HelperText>{helperText}</HelperText>}
      </InputWrapper>
    );
  },
);

Textarea.displayName = "Textarea";
