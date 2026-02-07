"use client";

import {
  QueueList,
  QueueItem,
  QueuePosition,
  QueueInfo,
  CustomerInfo,
  CustomerName,
  ServiceInfo,
  AppointmentDetails,
  DetailItem,
  QueueActions,
  AssignSelect,
  EmptyQueue,
  HeaderActions,
} from "./Queue.styles";
import { useQueue } from "@/hooks/api/useQueue";
import { useStaff } from "@/hooks/api/useStaff";
import { Staff } from "@/types/staff";
import { QueueEntry } from "@/types/queue";
import dayjs from "dayjs";
import { PageContainer } from "@/components/layout";
import { Button, Card, Badge, Select } from "@/components/ui";

export default function QueuePage() {
  const {
    queue,
    isLoading: isLoadingQueue,
    autoAssign,
    isAutoAssigning,
    manualAssign,
    isManualAssigning,
  } = useQueue();
  const { staff: staffList, isLoading: isLoadingStaff } = useStaff();

  const handleAutoAssign = async () => {
    await autoAssign();
  };

  const handleManualAssign = async (queueId: string, staffId: string) => {
    if (!staffId) return;
    await manualAssign({ queueId, staffId });
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

  if (isLoadingQueue) {
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
            <Button onClick={handleAutoAssign} isLoading={isAutoAssigning}>
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
                        label: `${s.name} (${s.dailyCapacity} max)`,
                      }))}
                      onChange={(e) =>
                        handleManualAssign(entry.id, e.target.value)
                      }
                      disabled={isManualAssigning}
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
