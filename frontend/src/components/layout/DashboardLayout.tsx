"use client";

import styled from "styled-components";
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 260px;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

const PageDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

interface DashboardLayoutProps {
  children: ReactNode;
  user?: { name: string; email: string };
}

export const DashboardLayout = ({ children, user }: DashboardLayoutProps) => {
  return (
    <LayoutWrapper>
      <Sidebar user={user} />
      <MainContent>{children}</MainContent>
    </LayoutWrapper>
  );
};

interface PageContainerProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export const PageContainer = ({
  title,
  description,
  action,
  children,
}: PageContainerProps) => {
  return (
    <>
      <PageHeader>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <PageTitle>{title}</PageTitle>
            {description && <PageDescription>{description}</PageDescription>}
          </div>
          {action && <div>{action}</div>}
        </div>
      </PageHeader>
      {children}
    </>
  );
};
