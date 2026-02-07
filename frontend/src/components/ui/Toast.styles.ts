import styled, { css, keyframes } from "styled-components";
import { ToastType } from "./Toast.types";

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

export const ToastContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  z-index: ${({ theme }) => theme.zIndices.toast};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const typeStyles = {
  success: css`
    background: ${({ theme }) => theme.colors.success};
  `,
  error: css`
    background: ${({ theme }) => theme.colors.error};
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.warning};
  `,
  info: css`
    background: ${({ theme }) => theme.colors.info};
  `,
};

export const ToastItem = styled.div<{ $type: ToastType; $isExiting: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 300px;
  max-width: 450px;
  animation: ${({ $isExiting }) => ($isExiting ? slideOut : slideIn)} 0.3s ease
    forwards;

  ${({ $type }) => typeStyles[$type as keyof typeof typeStyles]}
`;

export const ToastIcon = styled.span`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

export const ToastMessage = styled.span`
  flex: 1;
`;

export const CloseButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.radii.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;
