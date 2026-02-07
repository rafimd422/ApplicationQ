import styled from "styled-components";
import Link from "next/link";

export const SidebarWrapper = styled.aside`
  width: 260px;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
`;

export const Logo = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h1 {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin: 0;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

export const Nav = styled.nav`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const NavItem = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primaryFaded : "transparent"};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.primaryFaded : theme.colors.surfaceHover};
    color: ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.text};
    text-decoration: none;
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

export const NavSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};

  &:first-child {
    margin-top: 0;
  }
`;

export const NavSectionTitle = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const UserSection = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const UserName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UserEmail = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
