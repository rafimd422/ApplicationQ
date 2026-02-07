"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import {
  StyledButton,
  Spinner,
  ButtonVariant,
  ButtonSize,
} from "./Button.styles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <StyledButton
        ref={ref}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        $isLoading={isLoading}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Spinner />}
        {children}
      </StyledButton>
    );
  },
);

Button.displayName = "Button";
