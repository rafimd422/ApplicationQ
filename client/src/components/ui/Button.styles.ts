import styled, { css } from "styled-components";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryDark};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surfaceHover};
      border-color: ${({ theme }) => theme.colors.borderDark};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.error};
    color: white;
    border: none;

    &:hover:not(:disabled) {
      background: #dc2626;
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    border: none;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surfaceHover};
    }
  `,
};

const sizeStyles = {
  sm: css`
    padding: 6px 12px;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    border-radius: ${({ theme }) => theme.radii.sm};
  `,
  md: css`
    padding: 10px 20px;
    font-size: ${({ theme }) => theme.fontSizes.md};
    border-radius: ${({ theme }) => theme.radii.md};
  `,
  lg: css`
    padding: 14px 28px;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    border-radius: ${({ theme }) => theme.radii.md};
  `,
};

export const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $isLoading: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};

  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ $isLoading }) =>
    $isLoading &&
    css`
      pointer-events: none;
      opacity: 0.7;
    `}
`;

export const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
