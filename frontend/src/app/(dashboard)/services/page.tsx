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
  Badge,
  ConfirmModal,
  useToast,
} from "@/components/ui";
import { servicesApi } from "@/services/api";

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const serviceSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  duration: z.enum(["15", "30", "60"]),
  requiredStaffType: z.enum(["Doctor", "Consultant", "Support Agent"]),
});

type ServiceForm = z.infer<typeof serviceSchema>;

interface Service {
  id: string;
  serviceName: string;
  duration: number;
  requiredStaffType: "Doctor" | "Consultant" | "Support Agent";
}

export default function ServicesPage() {
  const { addToast } = useToast();
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const fetchServices = async () => {
    try {
      const response = await servicesApi.getAll();
      setServicesList(response.data.services);
    } catch (error) {
      addToast("error", "Failed to load services");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

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

  const onSubmit = async (data: ServiceForm) => {
    setIsSubmitting(true);
    try {
      if (editingService) {
        await servicesApi.update(editingService.id, data);
        addToast("success", "Service updated successfully");
      } else {
        await servicesApi.create(data);
        addToast("success", "Service created successfully");
      }
      setIsModalOpen(false);
      fetchServices();
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
      await servicesApi.delete(deletingId);
      addToast("success", "Service deleted successfully");
      setIsDeleteModalOpen(false);
      setDeletingId(null);
      fetchServices();
    } catch (error: any) {
      addToast("error", error.response?.data?.error || "Delete failed");
    } finally {
      setIsSubmitting(false);
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
        data={servicesList}
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
            <Button type="submit" isLoading={isSubmitting}>
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
        isLoading={isSubmitting}
      />
    </PageContainer>
  );
}
