"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout";
import { StatCard, Card, CardHeader, Badge, Button } from "@/components/ui";
import { dashboardApi, activityApi } from "@/services/api";
import dayjs from "dayjs";

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const StaffLoadList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StaffLoadItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const StaffInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StaffAvatar = styled.div`
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

const StaffName = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const LoadIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActivityItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityTime = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  min-width: 70px;
`;

const ActivityText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const LoadingText = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface DashboardStats {
  today: string;
  totalAppointments: number;
  completed: number;
  pending: number;
  cancelled: number;
  noShow: number;
  waitingQueueCount: number;
  totalStaff: number;
  availableStaff: number;
}

interface StaffLoad {
  id: string;
  name: string;
  staffType: string;
  currentAppointments: number;
  dailyCapacity: number;
  loadStatus: "OK" | "Booked";
}

interface ActivityLog {
  id: string;
  action: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [staffLoad, setStaffLoad] = useState<StaffLoad[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, staffRes, activityRes] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getStaffLoad(),
          activityApi.getRecent(5),
        ]);
        setStats(statsRes.data);
        setStaffLoad(staffRes.data.staffLoad);
        setActivities(activityRes.data.logs);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <PageContainer
        title="Dashboard"
        description="Overview of your appointment system"
      >
        <LoadingText>Loading dashboard...</LoadingText>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Dashboard"
      description={`Today is ${dayjs().format("dddd, MMMM D, YYYY")}`}
    >
      <StatsGrid>
        <StatCard
          icon={
            <svg
              fill="none"
              stroke="#4F46E5"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
          value={stats?.totalAppointments || 0}
          label="Total Appointments Today"
          iconBgColor="#E0E7FF"
        />
        <StatCard
          icon={
            <svg
              fill="none"
              stroke="#10B981"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          value={stats?.completed || 0}
          label="Completed"
          iconBgColor="#D1FAE5"
        />
        <StatCard
          icon={
            <svg
              fill="none"
              stroke="#F59E0B"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          value={stats?.pending || 0}
          label="Pending"
          iconBgColor="#FEF3C7"
        />
        <StatCard
          icon={
            <svg
              fill="none"
              stroke="#EF4444"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          }
          value={stats?.waitingQueueCount || 0}
          label="In Queue"
          iconBgColor="#FEE2E2"
        />
      </StatsGrid>

      <ContentGrid>
        <Card>
          <CardHeader
            title="Staff Load Summary"
            description="Today's appointment distribution"
          />
          <StaffLoadList>
            {staffLoad.length === 0 ? (
              <LoadingText>No staff members found</LoadingText>
            ) : (
              staffLoad.map((staff) => (
                <StaffLoadItem key={staff.id}>
                  <StaffInfo>
                    <StaffAvatar>{staff.name.charAt(0)}</StaffAvatar>
                    <StaffName>{staff.name}</StaffName>
                  </StaffInfo>
                  <LoadIndicator>
                    <span>
                      {staff.currentAppointments} / {staff.dailyCapacity}
                    </span>
                    <Badge
                      variant={
                        staff.loadStatus === "OK" ? "success" : "warning"
                      }
                      size="sm"
                    >
                      {staff.loadStatus}
                    </Badge>
                  </LoadIndicator>
                </StaffLoadItem>
              ))
            )}
          </StaffLoadList>
        </Card>

        <Card>
          <CardHeader
            title="Recent Activity"
            description="Latest actions in the system"
          />
          <ActivityList>
            {activities.length === 0 ? (
              <LoadingText>No recent activity</LoadingText>
            ) : (
              activities.map((activity) => (
                <ActivityItem key={activity.id}>
                  <ActivityTime>
                    {dayjs(activity.createdAt).format("h:mm A")}
                  </ActivityTime>
                  <ActivityText>{activity.action}</ActivityText>
                </ActivityItem>
              ))
            )}
          </ActivityList>
        </Card>
      </ContentGrid>
    </PageContainer>
  );
}
