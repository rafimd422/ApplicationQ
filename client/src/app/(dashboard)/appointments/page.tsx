"use client";

import {
  FilterBar,
  FilterItem,
  ActionButtons,
  Form,
  StaffAvailability,
  WarningText,
} from "./Appointments.styles";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  useToast,
} from "@/components/ui";
import { appointmentsApi, servicesApi, staffApi } from "@/services/api";

const appointmentSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  serviceId: z.string().min(1, "Service is required"),
  staffId: z.string().optional(),
  appointmentDate: z.string().min(1, "Date is required"),
  appointmentTime: z.string().min(1, "Time is required"),
});

type AppointmentForm = z.infer<typeof appointmentSchema>;

interface Appointment {
  id: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  staffId: string | null;
  staffName: string | null;
  appointmentDate: string;
  appointmentTime: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "No-Show";
}

interface Service {
  id: string;
  serviceName: string;
  duration: number;
  requiredStaffType: string;
}

interface Staff {
  id: string;
  name: string;
  staffType: string;
  dailyCapacity: number;
  currentAppointments?: number;
  isAvailable?: boolean;
}

export default function AppointmentsPage() {
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState(dayjs().format("YYYY-MM-DD"));

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

  const fetchAppointments = async () => {
    try {
      const response = await appointmentsApi.getAll({ date: filterDate });
      setAppointments(response.data.appointments);
    } catch (error) {
      addToast("error", "Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await servicesApi.getAll();
      setServices(response.data.services);
    } catch (error) {
      console.error("Failed to load services");
    }
  };

  const fetchStaffWithAvailability = async (
    date: string,
    requiredStaffType?: string,
  ) => {
    try {
      const response = await staffApi.getAllAvailability(date);
      let staff = response.data.staff;
      if (requiredStaffType) {
        staff = staff.filter((s: Staff) => s.staffType === requiredStaffType);
      }
      setFilteredStaff(staff);
    } catch (error) {
      console.error("Failed to load staff availability");
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchServices();
    fetchStaffWithAvailability(dayjs().format("YYYY-MM-DD"));
  }, [filterDate]);

  useEffect(() => {
    if (selectedServiceId && selectedDate) {
      const service = services.find((s) => s.id === selectedServiceId);
      if (service) {
        fetchStaffWithAvailability(selectedDate, service.requiredStaffType);
      }
    }
  }, [selectedServiceId, selectedDate, services]);

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
    setIsSubmitting(true);
    setConflictError(null);
    try {
      if (editingAppointment) {
        await appointmentsApi.update(editingAppointment.id, {
          ...data,
          staffId: data.staffId || undefined,
        });
        addToast("success", "Appointment updated successfully");
      } else {
        const response = await appointmentsApi.create({
          ...data,
          staffId: data.staffId || null,
        });
        if (response.data.addedToQueue) {
          addToast("warning", "Appointment added to waiting queue");
        } else {
          addToast("success", "Appointment created successfully");
        }
      }
      setIsModalOpen(false);
      fetchAppointments();
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Operation failed";
      if (errorMsg.includes("already has an appointment")) {
        setConflictError(errorMsg);
      } else {
        addToast("error", errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!cancellingId) return;
    setIsSubmitting(true);
    try {
      await appointmentsApi.cancel(cancellingId);
      addToast("success", "Appointment cancelled");
      setIsCancelModalOpen(false);
      setCancellingId(null);
      fetchAppointments();
    } catch (error: any) {
      addToast("error", error.response?.data?.error || "Cancel failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await appointmentsApi.complete(id);
      addToast("success", "Appointment marked as completed");
      fetchAppointments();
    } catch (error) {
      addToast("error", "Failed to complete appointment");
    }
  };

  const handleNoShow = async (id: string) => {
    try {
      await appointmentsApi.noShow(id);
      addToast("warning", "Appointment marked as no-show");
      fetchAppointments();
    } catch (error) {
      addToast("error", "Failed to mark as no-show");
    }
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
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </FilterItem>
      </FilterBar>

      <Table
        columns={columns}
        data={appointments}
        isLoading={isLoading}
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
              label="Assign Staff (Optional)"
              placeholder="Select staff or leave in queue"
              options={[
                { value: "", label: "Add to waiting queue" },
                ...filteredStaff.map((s) => ({
                  value: s.id,
                  label: `${s.name} (${s.currentAppointments || 0}/${s.dailyCapacity})`,
                })),
              ]}
              {...register("staffId")}
            />
            {filteredStaff.length > 0 && (
              <StaffAvailability
                $isAvailable={filteredStaff.some((s) => s.isAvailable)}
              >
                {filteredStaff.filter((s) => s.isAvailable).length} staff
                available
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
