"use client";

import {
  FilterBar,
  FilterItem,
  ActionButtons,
  Form,
  StaffAvailability,
  WarningText,
} from "./Appointments.styles";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppointments } from "@/hooks/api/useAppointments";
import { useStaff } from "@/hooks/api/useStaff";
import { useServices } from "@/hooks/api/useServices";
import {
  appointmentSchema,
  AppointmentForm,
} from "@/schemas/appointment.schema";
import { Appointment } from "@/types/appointment";
import { Staff } from "@/types/staff";
import { Service } from "@/types/service";
import dayjs from "dayjs";
import { PageContainer } from "@/components/layout";
import {
  Button,
  Input,
  Select,
  Table,
  Modal,
  ModalFooter,
  StatusBadge,
  ConfirmModal,
} from "@/components/ui";

export default function AppointmentsPage() {
  const [filters, setFilters] = useState({
    date: dayjs().format("YYYY-MM-DD"),
    staffId: "",
    status: "",
  });
  const {
    appointments,
    isLoading: isLoadingAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    completeAppointment,
    noShowAppointment,
    isSubmitting,
  } = useAppointments(filters);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const { staff, isLoading: isLoadingStaff } = useStaff();
  const { services, isLoading: isLoadingServices } = useServices();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
  });

  const selectedServiceId = watch("serviceId");
  const selectedDate = watch("appointmentDate");

  const openCreateModal = () => {
    setEditingAppointment(null);
    setConflictError(null);
    reset({
      customerName: "",
      serviceId: "",
      staffId: "",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
      appointmentTime: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setConflictError(null);
    reset({
      customerName: appointment.customerName,
      serviceId: appointment.serviceId,
      staffId: appointment.staffId || "",
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: AppointmentForm) => {
    if (!conflictError) {
      // Only close modal if no conflict error
      setIsModalOpen(false);
    }
  };

  const handleCancel = async () => {
    if (!cancellingId) return;
    try {
      await cancelAppointment(cancellingId);
      setIsCancelModalOpen(false);
      setCancellingId(null);
    } catch (error) {
      // Error is handled by hook's toast
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateAppointment({ id, data: { status } });
  };

  const handleComplete = async (id: string) => {
    await completeAppointment(id);
  };

  const handleNoShow = async (id: string) => {
    await noShowAppointment(id);
  };

  const columns = [
    { key: "customerName" as const, header: "Customer", width: "15%" },
    { key: "serviceName" as const, header: "Service", width: "15%" },
    {
      key: "staffName" as const,
      header: "Staff",
      width: "15%",
      render: (apt: Appointment) =>
        apt.staffName || <span style={{ color: "#F59E0B" }}>In Queue</span>,
    },
    { key: "appointmentTime" as const, header: "Time", width: "10%" },
    {
      key: "status" as const,
      header: "Status",
      width: "12%",
      render: (apt: Appointment) => <StatusBadge status={apt.status} />,
    },
    {
      key: "actions" as const,
      header: "Actions",
      width: "33%",
      render: (apt: Appointment) => (
        <ActionButtons>
          {apt.status === "Scheduled" && (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => openEditModal(apt)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleComplete(apt.id)}
              >
                Complete
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleNoShow(apt.id)}
              >
                No-Show
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  setCancellingId(apt.id);
                  setIsCancelModalOpen(true);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </ActionButtons>
      ),
    },
  ];

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const filteredStaffForService = staff.filter((s) =>
    selectedService ? s.staffType === selectedService.requiredStaffType : true,
  );

  return (
    <PageContainer
      title="Appointments"
      description="View and manage all appointments"
      action={<Button onClick={openCreateModal}>New Appointment</Button>}
    >
      <FilterBar>
        <FilterItem>
          <Input
            type="date"
            value={filters.date}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, date: e.target.value }))
            }
          />
        </FilterItem>
      </FilterBar>

      <Table
        columns={columns}
        data={appointments}
        isLoading={isLoadingAppointments}
        emptyMessage="No appointments for this date"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAppointment ? "Edit Appointment" : "New Appointment"}
        size="md"
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          {conflictError && <WarningText>{conflictError}</WarningText>}

          <Input
            label="Customer Name"
            placeholder="Enter customer name"
            error={errors.customerName?.message}
            {...register("customerName")}
          />

          <Select
            label="Service"
            placeholder="Select a service"
            options={services.map((s) => ({
              value: s.id,
              label: `${s.serviceName} (${s.duration} min)`,
            }))}
            error={errors.serviceId?.message}
            {...register("serviceId")}
          />

          <Input
            label="Date"
            type="date"
            error={errors.appointmentDate?.message}
            {...register("appointmentDate")}
          />

          <Input
            label="Time"
            type="time"
            error={errors.appointmentTime?.message}
            {...register("appointmentTime")}
          />

          <div>
            <Select
              label="Staff (Optional)"
              options={[
                { value: "", label: "Auto-assign" },
                ...filteredStaffForService.map((s: Staff) => ({
                  value: s.id,
                  label: s.name,
                })),
              ]}
              {...register("staffId")}
            />
            {filteredStaffForService.length > 0 && (
              <StaffAvailability
                $isAvailable={filteredStaffForService.some(
                  (s: Staff) => s.isAvailable,
                )}
              >
                {
                  filteredStaffForService.filter((s: Staff) => s.isAvailable)
                    .length
                }{" "}
                staff available
              </StaffAvailability>
            )}
          </div>

          <ModalFooter style={{ padding: 0, border: "none", marginTop: "8px" }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingAppointment ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancel}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment?"
        confirmText="Cancel Appointment"
        variant="danger"
        isLoading={isSubmitting}
      />
    </PageContainer>
  );
}
