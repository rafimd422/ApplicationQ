"use client";

import {
  LayoutWrapper,
  MainContent,
  PageHeader,
  PageTitle,
  PageDescription,
  PageHeaderContent,
} from "./DashboardLayout.styles";
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

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
        <PageHeaderContent>
          <div>
            <PageTitle>{title}</PageTitle>
            {description && <PageDescription>{description}</PageDescription>}
          </div>
          {action && <div>{action}</div>}
        </PageHeaderContent>
      </PageHeader>
      {children}
    </>
  );
};
