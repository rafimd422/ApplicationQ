"use client";

import { ActionButtons, Form } from "./Staff.styles";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStaff } from "@/hooks/api/useStaff";
import { staffSchema, StaffForm } from "@/schemas/staff.schema";
import { Staff } from "@/types/staff";
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

export default function StaffPage() {
  const {
    staff,
    isLoading,
    createStaff,
    updateStaff,
    deleteStaff,
    isCreating,
    isUpdating,
    isDeleting,
  } = useStaff();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const onSubmit = (data: StaffForm) => {
    if (editingStaff) {
      updateStaff({ id: editingStaff.id, data });
    } else {
      createStaff(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteStaff(deletingId);
      setIsDeleteModalOpen(false);
      setDeletingId(null);
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
        data={staff}
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
            <Button
              type="submit"
              fullWidth
              isLoading={isCreating || isUpdating}
            >
              {editingStaff ? "Update Member" : "Add Member"}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </PageContainer>
  );
}
