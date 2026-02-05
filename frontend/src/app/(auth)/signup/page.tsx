"use client";

import styled from "styled-components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card, useToast } from "@/components/ui";
import { authApi } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primaryDark} 0%,
    ${({ theme }) => theme.colors.primary} 100%
  );
  padding: ${({ theme }) => theme.spacing.lg};
`;

const SignupCard = styled(Card)`
  width: 100%;
  max-width: 420px;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  h1 {
    font-size: ${({ theme }) => theme.fontSizes["2xl"]};
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Footer = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
`;

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      const response = await authApi.signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setAuth(response.data.user, response.data.token);
      addToast("success", "Account created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      addToast("error", error.response?.data?.error || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <SignupCard>
        <Logo>
          <h1>Create Account</h1>
          <p>Get started with AppointmentQ</p>
        </Logo>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your name"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button type="submit" fullWidth isLoading={isLoading}>
            Create Account
          </Button>
        </Form>

        <Footer>
          Already have an account? <Link href="/login">Sign in</Link>
        </Footer>
      </SignupCard>
    </PageWrapper>
  );
}
