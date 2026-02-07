"use client";

import { PageWrapper, SignupCard, Logo, Form, Footer } from "./Signup.styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/api/useAuth";
import { signupSchema, SignupForm } from "@/schemas/auth.schema";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card } from "@/components/ui";

export default function SignupPage() {
  const { signup, isSigningUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupForm) => {
    signup(data);
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

          <Button type="submit" fullWidth isLoading={isSigningUp}>
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
