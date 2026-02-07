"use client";

import {
  PageWrapper,
  LoginCard,
  Logo,
  Form,
  Divider,
  Footer,
} from "./Login.styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/api/useAuth";
import { loginSchema, LoginForm } from "@/schemas/auth.schema";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card } from "@/components/ui";

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    login(data);
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

          <Button type="submit" fullWidth isLoading={isLoggingIn}>
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
