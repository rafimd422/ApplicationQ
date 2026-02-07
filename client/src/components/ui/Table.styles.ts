import styled from "styled-components";

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const TableHeaderCell = styled.th<{ $width?: string }>`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  width: ${({ $width }) => $width || "auto"};
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

export const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  vertical-align: middle;
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const EmptyStateIcon = styled.svg`
  width: 48px;
  height: 48px;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  opacity: 0.5;
  display: block;
`;

export const LoadingState = styled.div`
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  animation: pulse 1.5s infinite;
`;
