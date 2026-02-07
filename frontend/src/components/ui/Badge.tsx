"use client";

import { ReactNode } from "react";
import { StyledBadge, BadgeVariant, BadgeSize } from "./Badge.styles";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

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
