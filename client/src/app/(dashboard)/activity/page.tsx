"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PageContainer } from "@/components/layout";
import { Card, useToast } from "@/components/ui";
import { activityApi } from "@/services/api";

dayjs.extend(relativeTime);

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ActivityItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.primaryFaded};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityAction = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const ActivityTime = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    opacity: 0.5;
  }
`;

const LoadingState = styled.div`
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface ActivityLog {
  id: string;
  action: string;
  details: Record<string, any> | null;
  createdAt: string;
}

export default function ActivityPage() {
  const { addToast } = useToast();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await activityApi.getRecent(50);
        setActivities(response.data.logs);
      } catch (error) {
        addToast("error", "Failed to load activity logs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (action: string) => {
    if (action.includes("assigned")) {
      return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      );
    }
    if (action.includes("cancelled")) {
      return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      );
    }
    if (action.includes("completed")) {
      return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      );
    }
    if (action.includes("queue")) {
      return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      );
    }
    return (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    );
  };

  if (isLoading) {
    return (
      <PageContainer
        title="Activity Log"
        description="Recent actions and events in the system"
      >
        <Card>
          <LoadingState>Loading activities...</LoadingState>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Activity Log"
      description="Recent actions and events in the system"
    >
      <Card padding="sm">
        {activities.length === 0 ? (
          <EmptyState>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p>No activity logs yet</p>
          </EmptyState>
        ) : (
          <ActivityList>
            {activities.map((activity) => (
              <ActivityItem key={activity.id}>
                <ActivityIcon>{getActivityIcon(activity.action)}</ActivityIcon>
                <ActivityContent>
                  <ActivityAction>{activity.action}</ActivityAction>
                  <ActivityTime>
                    {dayjs(activity.createdAt).format("MMM D, YYYY h:mm A")} (
                    {dayjs(activity.createdAt).fromNow()})
                  </ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </ActivityList>
        )}
      </Card>
    </PageContainer>
  );
}
