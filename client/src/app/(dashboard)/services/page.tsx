"use client";

import { ActionButtons, Form } from "./Services.styles";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServices } from "@/hooks/api/useServices";
import { serviceSchema, ServiceForm } from "@/schemas/service.schema";
import { Service } from "@/types/service";
import { PageContainer } from "@/components/layout";
import {
  Button,
  Input,
  Select,
  Table,
  Modal,
  ModalFooter,
  Badge,
  ConfirmModal,
} from "@/components/ui";

export default function ServicesPage() {
  const {
    services,
    isLoading,
    createService,
    updateService,
    deleteService,
    isCreating,
    isUpdating,
    isDeleting,
  } = useServices();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      duration: "30",
      requiredStaffType: "Doctor",
    },
  });

  const openCreateModal = () => {
    setEditingService(null);
    reset({ serviceName: "", duration: "30", requiredStaffType: "Doctor" });
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    reset({
      serviceName: service.serviceName,
      duration: String(service.duration) as "15" | "30" | "60",
      requiredStaffType: service.requiredStaffType,
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: ServiceForm) => {
    if (editingService) {
      updateService({ id: editingService.id, data });
    } else {
      createService(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteService(deletingId);
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const columns = [
    { key: "serviceName" as const, header: "Service Name", width: "30%" },
    {
      key: "duration" as const,
      header: "Duration",
      width: "20%",
      render: (service: Service) => (
        <Badge variant="primary">{service.duration} min</Badge>
      ),
    },
    {
      key: "requiredStaffType" as const,
      header: "Required Staff",
      width: "25%",
      render: (service: Service) => (
        <Badge variant="info">{service.requiredStaffType}</Badge>
      ),
    },
    {
      key: "actions" as const,
      header: "Actions",
      width: "25%",
      render: (service: Service) => (
        <ActionButtons>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => openEditModal(service)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              setDeletingId(service.id);
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
      title="Services"
      description="Manage appointment services and their requirements"
      action={<Button onClick={openCreateModal}>Add Service</Button>}
    >
      <Table
        columns={columns}
        data={services}
        isLoading={isLoading}
        emptyMessage="No services found"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? "Edit Service" : "Add Service"}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Service Name"
            placeholder="Enter service name"
            error={errors.serviceName?.message}
            {...register("serviceName")}
          />

          <Select
            label="Duration"
            options={[
              { value: "15", label: "15 minutes" },
              { value: "30", label: "30 minutes" },
              { value: "60", label: "60 minutes" },
            ]}
            error={errors.duration?.message}
            {...register("duration")}
          />

          <Select
            label="Required Staff Type"
            options={[
              { value: "Doctor", label: "Doctor" },
              { value: "Consultant", label: "Consultant" },
              { value: "Support Agent", label: "Support Agent" },
            ]}
            error={errors.requiredStaffType?.message}
            {...register("requiredStaffType")}
          />

          <ModalFooter style={{ padding: 0, border: "none", marginTop: "8px" }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreating || isUpdating}>
              {editingService ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </PageContainer>
  );
}
