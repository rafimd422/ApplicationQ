"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { PageContainer } from "@/components/layout";
import { Button, Card, Badge, Select, useToast } from "@/components/ui";
import { queueApi, staffApi } from "@/services/api";

const QueueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const QueueItem = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const QueuePosition = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.primaryFaded};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  flex-shrink: 0;
`;

const QueueInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const CustomerInfo = styled.div`
  min-width: 200px;
`;

const CustomerName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const ServiceInfo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AppointmentDetails = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const DetailItem = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};

  span {
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const QueueActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const AssignSelect = styled.div`
  min-width: 200px;
`;

const EmptyQueue = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    opacity: 0.5;
  }

  h3 {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

interface QueueEntry {
  id: string;
  queuePosition: number;
  addedAt: string;
  appointmentId: string;
  customerName: string;
  serviceName: string;
  requiredStaffType: string;
  serviceDuration: number;
  appointmentDate: string;
  appointmentTime: string;
}

interface Staff {
  id: string;
  name: string;
  staffType: string;
  dailyCapacity: number;
  currentAppointments?: number;
  isAvailable?: boolean;
}

export default function QueuePage() {
  const { addToast } = useToast();
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);

  const fetchQueue = async () => {
    try {
      const response = await queueApi.getAll();
      setQueue(response.data.queue);
    } catch (error) {
      addToast("error", "Failed to load queue");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await staffApi.getAllAvailability(
        dayjs().format("YYYY-MM-DD"),
      );
      setStaffList(response.data.staff);
    } catch (error) {
      console.error("Failed to load staff");
    }
  };

  useEffect(() => {
    fetchQueue();
    fetchStaff();
  }, []);

  const handleAutoAssign = async () => {
    setIsAssigning(true);
    try {
      const response = await queueApi.autoAssign();
      if (response.data.assigned) {
        addToast("success", response.data.message);
        fetchQueue();
        fetchStaff();
      } else {
        addToast("warning", response.data.message);
      }
    } catch (error: any) {
      addToast("error", error.response?.data?.error || "Auto-assign failed");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleManualAssign = async (queueId: string, staffId: string) => {
    if (!staffId) return;
    setIsAssigning(true);
    try {
      const response = await queueApi.manualAssign(queueId, staffId);
      addToast("success", response.data.message);
      fetchQueue();
      fetchStaff();
    } catch (error: any) {
      addToast("error", error.response?.data?.error || "Assignment failed");
    } finally {
      setIsAssigning(false);
    }
  };

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const getAvailableStaff = (requiredType: string) => {
    return staffList.filter(
      (s) => s.staffType === requiredType && s.isAvailable,
    );
  };

  if (isLoading) {
    return (
      <PageContainer
        title="Waiting Queue"
        description="Manage appointments waiting for staff assignment"
      >
        <EmptyQueue>
          <p>Loading queue...</p>
        </EmptyQueue>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Waiting Queue"
      description={`${queue.length} appointment${queue.length !== 1 ? "s" : ""} waiting for assignment`}
      action={
        queue.length > 0 && (
          <HeaderActions>
            <Button onClick={handleAutoAssign} isLoading={isAssigning}>
              Assign From Queue
            </Button>
          </HeaderActions>
        )
      }
    >
      {queue.length === 0 ? (
        <Card>
          <EmptyQueue>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3>Queue is Empty</h3>
            <p>All appointments have been assigned to staff members.</p>
          </EmptyQueue>
        </Card>
      ) : (
        <QueueList>
          {queue.map((entry) => {
            const availableStaff = getAvailableStaff(entry.requiredStaffType);

            return (
              <QueueItem key={entry.id} padding="md">
                <QueueInfo>
                  <QueuePosition>{entry.queuePosition}</QueuePosition>

                  <CustomerInfo>
                    <CustomerName>{entry.customerName}</CustomerName>
                    <ServiceInfo>
                      {entry.serviceName} ({entry.serviceDuration} min)
                    </ServiceInfo>
                  </CustomerInfo>

                  <AppointmentDetails>
                    <DetailItem>
                      Date:{" "}
                      <span>
                        {dayjs(entry.appointmentDate).format("MMM D, YYYY")}
                      </span>
                    </DetailItem>
                    <DetailItem>
                      Time: <span>{entry.appointmentTime}</span>
                    </DetailItem>
                    <Badge variant="info">{entry.requiredStaffType}</Badge>
                  </AppointmentDetails>
                </QueueInfo>

                <QueueActions>
                  <AssignSelect>
                    <Select
                      placeholder="Select staff"
                      options={availableStaff.map((s) => ({
                        value: s.id,
                        label: `${s.name} (${s.currentAppointments || 0}/${s.dailyCapacity})`,
                      }))}
                      onChange={(e) =>
                        handleManualAssign(entry.id, e.target.value)
                      }
                      disabled={isAssigning}
                    />
                  </AssignSelect>
                </QueueActions>
              </QueueItem>
            );
          })}
        </QueueList>
      )}
    </PageContainer>
  );
}
