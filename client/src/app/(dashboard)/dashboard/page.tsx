"use client";

import {
  StatsGrid,
  ContentGrid,
  StaffLoadList,
  StaffLoadItem,
  StaffInfo,
  StaffAvatar,
  StaffName,
  LoadIndicator,
  ActivityList,
  ActivityItem,
  ActivityIcon,
  ActivityTime,
  ActivityText,
  LoadingText,
} from "./Dashboard.styles";
import {
  useDashboardStats,
  useStaffLoad,
  useRecentActivity,
} from "@/hooks/api/useDashboard";
import { PageContainer } from "@/components/layout";
import { StatCard, Card, CardHeader, Badge, Button } from "@/components/ui";
import dayjs from "dayjs";

import { DashboardStats, StaffLoad, ActivityLog } from "@/types/dashboard";

export default function DashboardPage() {
  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();
  const { data: staffLoad, isLoading: isLoadingStaff } = useStaffLoad();
  const { data: recentActivity, isLoading: isLoadingActivity } =
    useRecentActivity(5);

  const getDayName = (dayCount: number) => {
    return dayjs().add(dayCount, "day").format("ddd");
  };

  if (isLoadingStats || isLoadingStaff || isLoadingActivity) {
    return (
      <PageContainer title="Dashboard" description="Overview of your business">
        <LoadingText>Loading dashboard data...</LoadingText>
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
              staffLoad.map((staff: StaffLoad) => (
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
            {recentActivity.length === 0 ? (
              <LoadingText>No recent activity</LoadingText>
            ) : (
              recentActivity.map((activity: ActivityLog) => (
                <ActivityItem key={activity.id}>
                  <ActivityIcon>
                    {activity.action.includes("created") ? "📅" : "👤"}
                  </ActivityIcon>
                  <ActivityText>
                    <strong>{activity.userName}</strong> {activity.action}
                    <br />
                    <small>{dayjs(activity.timestamp).fromNow()}</small>
                  </ActivityText>
                </ActivityItem>
              ))
            )}
          </ActivityList>
        </Card>
      </ContentGrid>
    </PageContainer>
  );
}
