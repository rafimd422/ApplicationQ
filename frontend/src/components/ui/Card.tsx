"use client";

import styled from "styled-components";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hoverable?: boolean;
}

const StyledCard = styled.div<{ $padding: string; $hoverable: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme, $padding }) =>
    theme.spacing[$padding as keyof typeof theme.spacing]};
  transition: all ${({ theme }) => theme.transitions.normal};

  ${({ $hoverable, theme }) =>
    $hoverable &&
    `
    cursor: pointer;
    
    &:hover {
      box-shadow: ${theme.shadows.md};
      transform: translateY(-2px);
    }
  `}
`;

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
const CardHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 4px 0 0 0;
`;

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
const StatCardWrapper = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatIconWrapper = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.2;
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
`;

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
