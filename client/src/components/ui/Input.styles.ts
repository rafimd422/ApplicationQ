import styled, { css } from "styled-components";

interface InputWrapperProps {
  $hasError?: boolean;
  $fullWidth?: boolean;
}

export const InputWrapper = styled.div<InputWrapperProps>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
`;

export const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const baseInputStyles = css<{ $hasError?: boolean }>`
  width: 100%;
  padding: 10px 14px;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.borderDark};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${({ theme, $hasError }) =>
        $hasError ? theme.colors.errorLight : theme.colors.primaryFaded};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.background};
    cursor: not-allowed;
    opacity: 0.7;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const StyledInput = styled.input<{ $hasError?: boolean }>`
  ${baseInputStyles}
`;

export const StyledSelect = styled.select<{ $hasError?: boolean }>`
  ${baseInputStyles}
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
`;

export const StyledTextarea = styled.textarea<{ $hasError?: boolean }>`
  ${baseInputStyles}
  min-height: 100px;
  resize: vertical;
`;

export const ErrorMessage = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.error};
`;

export const HelperText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;
