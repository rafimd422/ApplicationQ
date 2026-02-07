"use client";

import {
  TableWrapper,
  StyledTable,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  EmptyState,
  EmptyStateIcon,
  LoadingState,
} from "./Table.styles";
import { ReactNode } from "react";

interface Column<T> {
  key: keyof T | "actions";
  header: string;
  width?: string;
  render?: (item: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  isLoading?: boolean;
}

export function Table<T extends { id: string }>({
  columns,
  data,
  emptyMessage = "No data found",
  isLoading = false,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <TableWrapper>
        <LoadingState>Loading...</LoadingState>
      </TableWrapper>
    );
  }

  if (data.length === 0) {
    return (
      <TableWrapper>
        <EmptyState>
          <EmptyStateIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </EmptyStateIcon>
          <p>{emptyMessage}</p>
        </EmptyState>
      </TableWrapper>
    );
  }

  return (
    <TableWrapper>
      <StyledTable>
        <TableHead>
          <tr>
            {columns.map((col) => (
              <TableHeaderCell key={String(col.key)} $width={col.width}>
                {col.header}
              </TableHeaderCell>
            ))}
          </tr>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {columns.map((col) => (
                <TableCell key={String(col.key)}>
                  {col.render
                    ? col.render(item)
                    : col.key !== "actions"
                      ? String(item[col.key as keyof T] ?? "")
                      : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableWrapper>
  );
}
