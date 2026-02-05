"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { staffApi } from "@/services/api";

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const staffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  staffType: z.enum(["Doctor", "Consultant", "Support Agent"]),
  dailyCapacity: z.string().regex(/^\d+$/, "Must be a number"),
  availabilityStatus: z.enum(["Available", "On Leave"]),
});

type StaffForm = z.infer<typeof staffSchema>;

interface Staff {
  id: string;
  name: string;
  staffType: "Doctor" | "Consultant" | "Support Agent";
  dailyCapacity: number;
  availabilityStatus: "Available" | "On Leave";
}

export default function StaffPage() {
  const { addToast } = useToast();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StaffForm>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      dailyCapacity: "5",
      availabilityStatus: "Available",
    },
  });

  const fetchStaff = async () => {
    try {
      const response = await staffApi.getAll();
      setStaffList(response.data.staff);
    } catch (error) {
      addToast("error", "Failed to load staff");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const openCreateModal = () => {
    setEditingStaff(null);
    reset({
      name: "",
      staffType: "Doctor",
      dailyCapacity: "5",
      availabilityStatus: "Available",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (staff: Staff) => {
    setEditingStaff(staff);
    reset({
      name: staff.name,
      staffType: staff.staffType,
      dailyCapacity: String(staff.dailyCapacity),
      availabilityStatus: staff.availabilityStatus,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: StaffForm) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        dailyCapacity: parseInt(data.dailyCapacity, 10),
      };

      if (editingStaff) {
        await staffApi.update(editingStaff.id, payload);
        addToast("success", "Staff updated successfully");
      } else {
        await staffApi.create(payload);
        addToast("success", "Staff created successfully");
      }
      setIsModalOpen(false);
      fetchStaff();
    } catch (error: any) {
      addToast("error", error.response?.data?.error || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsSubmitting(true);
    try {
      await staffApi.delete(deletingId);
      addToast("success", "Staff deleted successfully");
      setIsDeleteModalOpen(false);
      setDeletingId(null);
      fetchStaff();
    } catch (error: any) {
      addToast("error", error.response?.data?.error || "Delete failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: "name" as const, header: "Name", width: "25%" },
    { key: "staffType" as const, header: "Type", width: "20%" },
    { key: "dailyCapacity" as const, header: "Capacity", width: "15%" },
    {
      key: "availabilityStatus" as const,
      header: "Status",
      width: "20%",
      render: (staff: Staff) => (
        <StatusBadge status={staff.availabilityStatus} />
      ),
    },
    {
      key: "actions" as const,
      header: "Actions",
      width: "20%",
      render: (staff: Staff) => (
        <ActionButtons>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => openEditModal(staff)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              setDeletingId(staff.id);
              setIsDeleteModalOpen(true);
            }}
          >
            Delete
          </Button>
        </ActionButtons>
      ),
    },
  ];

  return (
    <PageContainer
      title="Staff Management"
      description="Manage your staff members and their availability"
      action={<Button onClick={openCreateModal}>Add Staff</Button>}
    >
      <Table
        columns={columns}
        data={staffList}
        isLoading={isLoading}
        emptyMessage="No staff members found"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStaff ? "Edit Staff" : "Add Staff"}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Name"
            placeholder="Enter staff name"
            error={errors.name?.message}
            {...register("name")}
          />

          <Select
            label="Staff Type"
            options={[
              { value: "Doctor", label: "Doctor" },
              { value: "Consultant", label: "Consultant" },
              { value: "Support Agent", label: "Support Agent" },
            ]}
            error={errors.staffType?.message}
            {...register("staffType")}
          />

          <Input
            label="Daily Capacity"
            type="number"
            placeholder="5"
            error={errors.dailyCapacity?.message}
            {...register("dailyCapacity")}
          />

          <Select
            label="Availability Status"
            options={[
              { value: "Available", label: "Available" },
              { value: "On Leave", label: "On Leave" },
            ]}
            error={errors.availabilityStatus?.message}
            {...register("availabilityStatus")}
          />

          <ModalFooter style={{ padding: 0, border: "none", marginTop: "8px" }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingStaff ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Staff"
        message="Are you sure you want to delete this staff member? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isSubmitting}
      />
    </PageContainer>
  );
}
