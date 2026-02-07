import styled, { css } from "styled-components";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "primary";
export type BadgeSize = "sm" | "md";

const variantStyles = {
  default: css`
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.textSecondary};
  `,
  success: css`
    background: ${({ theme }) => theme.colors.successLight};
    color: ${({ theme }) => theme.colors.success};
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.warningLight};
    color: ${({ theme }) => theme.colors.warning};
  `,
  error: css`
    background: ${({ theme }) => theme.colors.errorLight};
    color: ${({ theme }) => theme.colors.error};
  `,
  info: css`
    background: ${({ theme }) => theme.colors.infoLight};
    color: ${({ theme }) => theme.colors.info};
  `,
  primary: css`
    background: ${({ theme }) => theme.colors.primaryFaded};
    color: ${({ theme }) => theme.colors.primary};
  `,
};

const sizeStyles = {
  sm: css`
    padding: 2px 8px;
    font-size: ${({ theme }) => theme.fontSizes.xs};
  `,
  md: css`
    padding: 4px 12px;
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `,
};

export const StyledBadge = styled.span<{
  $variant: BadgeVariant;
  $size: BadgeSize;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.radii.full};
  white-space: nowrap;

  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}
`;
