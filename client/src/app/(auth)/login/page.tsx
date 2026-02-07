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

const LoginCard = styled(Card)`
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

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.md} 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }

  span {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data);
      setAuth(response.data.user, response.data.token);
      addToast("success", "Welcome back!");
      router.push("/dashboard");
    } catch (error: any) {
      addToast("error", error.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setValue("email", "demo@example.com");
    setValue("password", "demo123");
  };

  return (
    <PageWrapper>
      <LoginCard>
        <Logo>
          <h1>AppointmentQ</h1>
          <p>Smart Appointment & Queue Manager</p>
        </Logo>

        <Form onSubmit={handleSubmit(onSubmit)}>
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
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button type="submit" fullWidth isLoading={isLoading}>
            Sign In
          </Button>
        </Form>

        <Divider>
          <span>or</span>
        </Divider>

        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={handleDemoLogin}
        >
          Fill Demo Credentials
        </Button>

        <Footer>
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </Footer>
      </LoginCard>
    </PageWrapper>
  );
}
