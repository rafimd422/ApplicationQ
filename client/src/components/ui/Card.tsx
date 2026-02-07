"use client";

import {
  StyledCard,
  CardHeaderWrapper,
  CardTitle,
  CardDescription,
  StatCardWrapper,
  StatIconWrapper,
  StatContent,
  StatValue,
  StatLabel,
} from "./Card.styles";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hoverable?: boolean;
}

export const Card = ({
  children,
  className,
  padding = "lg",
  hoverable = false,
}: CardProps) => {
  return (
    <StyledCard className={className} $padding={padding} $hoverable={hoverable}>
      {children}
    </StyledCard>
  );
};

// Card Header

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const CardHeader = ({ title, description, action }: CardHeaderProps) => {
  return (
    <CardHeaderWrapper>
      <div>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </div>
      {action && <div>{action}</div>}
    </CardHeaderWrapper>
  );
};

// Stat Card for Dashboard

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  iconBgColor?: string;
}

export const StatCard = ({
  icon,
  value,
  label,
  iconBgColor = "#E0E7FF",
}: StatCardProps) => {
  return (
    <StatCardWrapper>
      <StatIconWrapper $color={iconBgColor}>{icon}</StatIconWrapper>
      <StatContent>
        <StatValue>{value}</StatValue>
        <StatLabel>{label}</StatLabel>
      </StatContent>
    </StatCardWrapper>
  );
};
