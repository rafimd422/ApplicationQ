"use client";

import styled, { css } from "styled-components";
import { ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "primary";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

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

const StyledBadge = styled.span<{ $variant: BadgeVariant; $size: BadgeSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.radii.full};
  white-space: nowrap;

  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}
`;

export const Badge = ({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) => {
  return (
    <StyledBadge $variant={variant} $size={size} className={className}>
      {children}
    </StyledBadge>
  );
};

// Status Badge - preconfigured for appointment statuses
type AppointmentStatus = "Scheduled" | "Completed" | "Cancelled" | "No-Show";
type StaffStatus = "Available" | "On Leave";
type LoadStatus = "OK" | "Booked";

const statusVariantMap: Record<
  AppointmentStatus | StaffStatus | LoadStatus,
  BadgeVariant
> = {
  Scheduled: "info",
  Completed: "success",
  Cancelled: "error",
  "No-Show": "warning",
  Available: "success",
  "On Leave": "default",
  OK: "success",
  Booked: "warning",
};

interface StatusBadgeProps {
  status: AppointmentStatus | StaffStatus | LoadStatus;
  size?: BadgeSize;
}

export const StatusBadge = ({ status, size = "md" }: StatusBadgeProps) => {
  return (
    <Badge variant={statusVariantMap[status] || "default"} size={size}>
      {status}
    </Badge>
  );
};
